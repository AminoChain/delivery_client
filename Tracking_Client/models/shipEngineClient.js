require('dotenv').config();
const Shipment = require("../views/shipRequest.js");
const Dimensions = require("../views/shipRequest.js");
const Package = require("../views/shipRequest.js");
const Weight = require("../views/shipRequest.js");
const Address = require('../views/shipRequest.js');
const ShipResponse = require('../views/shipResponse.js');
const ShipReqRoot = require('../views/shipRequest.js');
const https = require('node:https');
const { default: ShipEngine } = require('shipengine');
const trackingResponse = require("../views/trackingResponse.js")
const UPS_URL = process.env.UPS_URL;
const postgres = require("./postgres");
const { hexStripZeros } = require('ethers/lib/utils.js');
class ShipEngineClient {
    #pg = new postgres();

    async GetTestLabel(requestString) {
       // let shipreq = new Shipment();
        let req = Object.assign(new ShipReqRoot(),requestString)

        // await client.generateLabelData(JSON.stringify(ship));
        let info = await this.generateLabelData(JSON.stringify(req))
        let resp = Object.assign(new ShipResponse, JSON.parse(info))

        return resp
    }

    //Will retrieve the delivery status from ship engine
    async getShipData(carrier,trackingNumber) {
       


        return new Promise((resolve, reject) => {
            console.log(process.env.SHIP_ENGINE_APIKEY);
            const options = {
                host: process.env.SHIP_ENGINE_URL,
                path: `/v1/tracking?carrier_code=${carrier}&tracking_number=${trackingNumber}`,
                method: "GET",
                headers: {
                    'API-Key': process.env.SHIP_ENGINE_APIKEY,
                }
            }
            
            let req = https.request(options, res => {
                let chunks_of_data = [];

                res.on('data', (fragments) => {
                    chunks_of_data.push(fragments);
                });

                res.on('end', () => {
                    let responseBody = Buffer.concat(chunks_of_data);

                    var resp = new trackingResponse();
                    resp = JSON.parse(responseBody.toString());
                    //console.log(resp.trackResponse.shipment[0].package);
                    console.log("test")
                    console.log(resp)
                    resolve(responseBody.toString());
                });

                res.on('error', error => {
                    Logger.logError('Failed to call UPS' + error);
                    reject(error);
                });

            });
            req.end();
        });

    }

    //Generates the shipping data from ship engine
    async generateLabelData(shipdata) {
        console.log(shipdata)



        return new Promise((resolve, reject) => {
            console.log(process.env.SHIP_ENGINE_APIKEY);
            const options = {
                host: process.env.SHIP_ENGINE_URL,
                path: '/v1/labels',
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'API-Key': process.env.SHIP_ENGINE_APIKEY,
                    'Content-Length': shipdata.length
                }
            }

            let req = https.request(options, res => {
                let chunks_of_data = [];

                res.on('data', (fragments) => {
                    chunks_of_data.push(fragments);
                });

                res.on('end', () => {
                    let responseBody = Buffer.concat(chunks_of_data);

                    var resp = new trackingResponse();
                    resp = JSON.parse(responseBody.toString());
                    //console.log(resp.trackResponse.shipment[0].package);
                    console.log("test")
                    console.log(resp)
                    resolve(responseBody.toString());
                });

                res.on('error', error => {
                    Logger.logError('Failed to call UPS' + error);
                    reject(error);
                });

            });
            req.write(shipdata);
        });

    }

}

module.exports = ShipEngineClient;
