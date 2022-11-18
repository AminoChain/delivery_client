
const fs = require('fs');
const postgres = require("./postgres")
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const Log = require("./logger.js");
const ethers = require('ethers')



class ContractWatcher {
    #logger = new Log();
    #parentContract = process.env.MRKTPL_CONTRACT;
    #genome_ContractAddress = process.env.GENOME_CONTRACT;
    #nodeHostURL = process.env.NODE_HOST_URL;
    #Owner_PrivateKey = process.env.OWNER_PRIVATEKEY;
    #pg = new postgres();
    //Contracts Info for updating Shipping info
    #parentABI;
    #genome_ContractABI;
   


    #alchemyProvider
    #alchemycontract
    #signer

    #genomeContract;

    constructor() {
        this.#genome_ContractABI = require('../ABIS/aminoV1_Mumbai.json');
        this.#nodeHostURL = this.#nodeHostURL;
        this.#parentABI = require('../ABIS/main_mumbai.json');
        this.generateAlchemyProvider();
        this.EthersStartListening();
        this.#logger.logInfo("Listening for contract updates");
    }

    EthersStartListening() {
        this.#genomeContract = new ethers.Contract(this.#genome_ContractAddress, this.#genome_ContractABI, this.#alchemyProvider);

        this.#genomeContract.on("Transfer", async (from, to, value, event) => {
            try {
                let tokenID = parseInt(value._hex);
                this.#logger.logInfo(event);
                let delivStatus = await this.#pg.getDeliveryStatusByToken(tokenID);
                this.#logger.logInfo(delivStatus);
                //if we dont have the token in our db add it on -1 we dont have it on -2 something else went wrong. Do Nothing
                if(delivStatus == -1)
                {
                    await this.#pg.upsertTokenTransferInfo(this.#parentContract,tokenID,0);
                    this.#logger.logInfo(`No delivery status found for ${tokenID} setting status to 0`);
                }
            }
            catch (ex) {
                this.#logger.logInfo(ex);
            }
        });
    }



    generateAlchemyProvider() {
        this.#alchemyProvider = new ethers.providers.AlchemyProvider(
            'maticmum',
            'fN74C3gnEZcQf_XAajwdQ4AjeGv4ZR2f'
        )
        this.#signer = new ethers.Wallet(process.env.OWNER_PRIVATEKEY, this.#alchemyProvider);
        this.#alchemycontract = new ethers.Contract(process.env.MRKTPL_CONTRACT, this.#parentABI, this.#signer);
    }




    async updateDeliveryStatus(tokenID, status) {
        let wasUpdateSuccessful = false;
        this.#logger.logInfo(`Updating Delivery Status to ${status}, for  ${tokenID}`);
        try {
            this.#logger.logInfo(await this.#alchemycontract.updateDeliveryStatus(tokenID, status));
            wasUpdateSuccessful = true;
            return wasUpdateSuccessful;
        } catch (ex) {
            this.#logger.logInfo(ex);
            wasUpdateSuccessful = false;
            return wasUpdateSuccessful;

        }

    }


}

module.exports = ContractWatcher