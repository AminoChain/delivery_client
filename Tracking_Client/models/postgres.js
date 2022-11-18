require('dotenv').config();

const {
    Pool,
    Client
} = require("pg");
//TODO USe Secrets after development


class Postgres {

    #credentials = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };

    constructor() { }

    // Connect with a connection pool.
    async poolDemo() {
        const pool = new Pool(this.#credentials);
        const now = await pool.query("SELECT NOW()");
        await pool.end();

        return now;
    }


    // Connect with a client.
    async clientDemo(command) {
        const client = new Client(this.#credentials);
        await client.connect();
        const now = await client.query(command);
        await client.end();

        return now;
    }

    //Updates Target Tokens Delivery Status IN DB
    //dliv status 0,1,2 //will make this enum
    async upsertTokenTransferInfo(contractAddress, tokenID, deliv_sts) {
        try {
            //console.log("inserting", contractAddress, tokenID, deliv_sts)
            const clientResult = await this.clientDemo(`Insert INTO tokens VALUES('${contractAddress}','${tokenID}','${deliv_sts}',null) ON CONFLICT (contract_address,tokennumber) DO UPDATE SET contract_address = EXCLUDED.contract_address, tokennumber = EXCLUDED.tokennumber, deliverystatus = EXCLUDED.deliverystatus`);
            //console.log(`Insert INTO tokens VALUES(${contractAddress},${tokenID})`);
        } catch (ex) {
            //console.log('error in upsertTokenTransferInfo')
        }
    }

    //Updates Target Token With tracking number
    async updateTokenTrackingNumber(contractAddress, tokenID, tracking_num,deliveryStatus) {
        try {
            console.log("inserting", contractAddress, tokenID, tracking_num)
            console.log(`UPDATE tokens set deliverystatus = '${deliveryStatus}', tracking_num ='${tracking_num}' where contract_address = '${contractAddress}' and tokennumber ='${tokenID}'`)
            const clientResult = await this.clientDemo(`UPDATE tokens set deliverystatus = '${deliveryStatus}', tracking_num ='${tracking_num}' where contract_address = '${contractAddress}' and tokennumber ='${tokenID}'`);
            console.log(`Insert INTO tokens VALUES(${contractAddress},${tokenID})`);
        }
        catch (ex) {
            console.log(ex)
        }
    }


    async loadContractInfo() {
        //console.log("inserting", contractAddress, tokenID)
        const clientResult = await this.clientDemo(`select * from contracts`);
        //console.log(`Insert INTO tokens VALUES(${contractAddress},${tokenID})`);
    }


    async getDeliveryStatusByTN(tracking_num) {
        //console.log("looking for contracts with tracking number")
        console.log(tracking_num)
        try {
            const clientResult = await this.clientDemo(`select * from tokens where tracking_num = '${tracking_num}'`);

            console.log(clientResult.rows[0])
            console.log(clientResult.rows[0].deliverystatus);
            return clientResult.rows[0].deliverystatus
        }
        catch (ex) {
            return null
        }
    }

    async getDeliveryStatusByToken(tokenID) {
        //console.log("looking for contracts with tracking number")
        console.log(tokenID)
        try {
            const clientResult = await this.clientDemo(`select * from tokens where tokennumber = '${tokenID}'`);
            
            if(clientResult.rows[0] && clientResult.rows[0].deliverystatus != '' ){
                return clientResult.rows[0].deliverystatus
            }
            else{
                return -1
            }
        }
        catch (ex) {
            console.log(ex)
            return -2
        }
    }

    async getAllTokens() {
        //console.log("looking for contracts with tracking number"):
        let tokens = [];
        try {
            const clientResult = await this.clientDemo(`select * from tokens`);
            console.log(clientResult.rows)
            for(let i = 0; i <clientResult.rows.length; i++){
                if(clientResult.rows[i].deliverystatus == '1'){
                    tokens.push(clientResult.rows[i].tokennumber);
                }
            }
            console.log(tokens)
            return tokens
        }
        catch (ex) {
            console.log(ex)
            return tokens
        }
    }



}

module.exports = Postgres;