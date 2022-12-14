
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const ShipEngineClient = require("./models/shipEngineClient.js")
const postgres = require("./models/postgres.js")
const Log = require("./models/logger.js");
const ContractWatcher = require('./models/contractWatcher.js');

const app = express()
const pg = new postgres();
const client = new ShipEngineClient()
const log = new Log()
const procname = 'index'
const correlationID = uuidv4()
const env = process.env.ENV
const genomeContract = process.env.GENOME_CONTRACT
const marketPlace = process.env.MRKTPL_CONTRACT

app.use(express.json());
app.use(cors());


log.logInfo(procname, "Starting Server", correlationID)

log.logInfo(procname, "Starting Contract Listener", correlationID)
const watcher = new ContractWatcher()


//Ship Engine tracking is defined in the client
// for now we will set the delivery status manually until we can get live shipping
//Ship Engine does not provide a dynamic test environment.
app.route('/getpackageStatus/:trackingnumber')
  .get(async (req, res) => {
    try {
      let cid = uuidv4();
      let tn = req.params.trackingnumber
      log.logInfo('getpackageStatus', `Start getStatus ${tn}`, cid)
      let delivStatus = await pg.getDeliveryStatusByTN(tn);
      let status = { deliveryStatus: delivStatus }
      res.status(200)
      res.send(status)
      log.logInfo('getpackageStatus', `End getStatus`, cid)

    } catch (ex) {
      log.logInfo(ex)
      res.sendStatus(ex)
    }
  })

/*Note: This is baked in for demo purposes and should be removed after the demo
*/

app.route('/settokenStatus/:tokenID/:status')
  .get((req, res) => {
    try {
      let cid = uuidv4();
      let tokenID = req.params.tokenID
      let status = req.params.status
      log.logInfo('setpackageStatus', `Start setStatus tokenID = ${tokenID}, status = ${status}`, cid)
      pg.upsertTokenTransferInfo(genomeContract, tokenID, status)
      watcher.updateDeliveryStatus(tokenID, status)
      log.logInfo('setpackageStatus', `END setStatus`, cid)
      res.status(200)
      res.end()
    }
    catch (ex) {
      log.logInfo(ex)
      res.sendStatus(ex)

    }
  })


//Test Route runs on a cron and will update tokens to deliver package
//In the future this will shck the delivery status from ship engine
//then call the contract with the appropriate delivery status
app.route('/updateToDelivered')
  .get(async (req, res) => {
    try {
      let cid = uuidv4();
      let tokens = await pg.getAllTokens()
      console.log(tokens)
      for (let i = 0; i < tokens.length; i++) {
        log.logInfo('setpackageStatus', `Start setStatus tokenID = ${tokens[i]}, status = 2`, cid)
        
        
        try{
          await watcher.updateDeliveryStatus(tokens[i], 2)
          await pg.upsertTokenTransferInfo(marketPlace, tokens[i], 2)
        }
        catch(ex){
          console.log(`delivery update status failed for ${tokens[i]}`)
        }
      }
      log.logInfo('setpackageStatus', `END setStatus`, cid)
      res.status(200)
      res.end()
    }
    catch (ex) {
      log.logInfo(ex)
      res.sendStatus(ex)

    }
  })


//TODO: once working with real shipper apis remove this
app.route('/shipPackage/:tokenID')
  .post(async (req, res) => {
    try {
      let cid = uuidv4();
      let tID = req.params.tokenID

      let tn = req.params.trackingNumber
      log.logInfo('createTrackingNumber', `Start createTrackingNumber TN= ${tn} tokenID = ${tID}`, cid)
      let shippingInfo = await client.GetTestLabel(req.body)

      //TODO Remove the reandom generation once working with prod shipengine
      shippingInfo.tracking_number = "1Z" + Math.random().toString().substr(2, 16);

      //Delivery Status will always be 1 when a label is created.
      let wasUpdateSuccseesful = await watcher.updateDeliveryStatus(tID, 1)

      if (wasUpdateSuccseesful) {
        await pg.updateTokenTrackingNumber(marketPlace, tID, shippingInfo.tracking_number, "1");
      }
      else {
        await pg.updateTokenTrackingNumber(marketPlace, tID, shippingInfo.tracking_number, "0");
      }

      log.logInfo('createTrackingNumber', `END createTrackingNumber`, cid)

      res.status(200)
      let resp = { tracking_number: shippingInfo.tracking_number, pdfLabel: shippingInfo.label_download.pdf, wascontractupdateded: wasUpdateSuccseesful }
      res.send(resp)
    }
    catch (ex) {
      log.logInfo(ex)
      res.sendStatus(ex)
    }
  })



app.listen(8080, 'localhost').on('error', (err) => {
  log.logInfo('procname', err, correlationID);
});


