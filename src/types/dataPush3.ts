import WebSocket from "ws";
import * as z from 'zod';
const webSocketUri = new WebSocket("wss://ws.backpack.exchange");
import {createClient} from 'redis';
import { zodWSData } from "./typesAndZodRuntimes.js";
import type { WSData, SentObject } from "./typesAndZodRuntimes.js";
const redisClient = createClient({
    url: "redis://localhost:6379"
});
try{
    await redisClient.connect();
}catch(e){
    console.log(`Some error occured while connecting to redis client: ${e}`);
}

const dataPush3 = async ()=>{
    const sentObject: SentObject = {
                price_updates: [{
                    asset: "BTC",
                    price: 0,
                    decimal: 0
                },{
                    asset: "ETH",
                    price: 0,
                    decimal: 0
                },{
                    asset: "SOL",
                    price: 0,
                    decimal: 0
                }]
            };
    let countSOL = 0;
    let countBTC = 0;
    let countETH = 0;
    type ObjSOL = {
        asset: "SOL",
        price: number,
        decimal: number
    };
    type ObjBTC = {
        asset: "BTC",
        price: number,
        decimal: number
    };
    type ObjETH = {
        asset: "ETH",
        price: number,
        decimal: number
    }
    let objSOL: ObjSOL = {
        asset: "SOL",
        price: 0,
        decimal: 0
    };
    let objBTC:ObjBTC = {
        asset: "BTC",
        price: 0,
        decimal: 0
    };
    let objETH: ObjETH= {
        asset: "ETH",
        price: 0,
        decimal: 0
    }
    const subscribeMessage = {
        method: "SUBSCRIBE",
        params: ["bookTicker.ETH_USDC","bookTicker.BTC_USDC","bookTicker.SOL_USDC"]
    }
    webSocketUri.on("open",()=>{
        webSocketUri.send(JSON.stringify(subscribeMessage));
    });
    webSocketUri.on('message',async (data)=>{
        // console.log(JSON.parse(data.toString()));
        // const webSocketData: WSData = zodWSData.parse(JSON.parse(data.toString()));
       
        try{
            const webSocketData: WSData = zodWSData.parse(JSON.parse(data.toString()));
            
            if(webSocketData.stream==='bookTicker.BTC_USDC'){
               objBTC.price = Math.trunc(Number(webSocketData.data.b)*10000),
               objBTC.decimal = 4
               objBTC.asset="BTC"
               countBTC++;
            }
            if(webSocketData.stream==='bookTicker.ETH_USDC'){
                objETH.price = Math.trunc(Number(webSocketData.data.b)*10000),
                objETH.decimal = 4
                objETH.asset = "ETH"
                countETH++;
            }
            if(webSocketData.stream==='bookTicker.SOL_USDC'){
                objSOL.price = Math.trunc(Number(webSocketData.data.b)*10000),
                objSOL.decimal = 4
                objSOL.asset = "SOL"
                countSOL++;
            }
            if(countBTC>1 && countETH>1 && countSOL>1){
                sentObject.price_updates[0] = objBTC;
                sentObject.price_updates[1] = objETH;
                sentObject.price_updates[2] = objSOL;
                countBTC=0;
                countETH=0;
                countSOL=0;
                await redisClient.xAdd("stream","*",{
                    data: JSON.stringify(sentObject)
                })
                console.log(sentObject);
            }
            
        }catch(e){
            console.log(`Some error occurred while parsing the data recieved from the websocket stream: ${e}`);
        }
      
    });
    //  setInterval(async () => {
    //     console.log(sentObject);
    //      await redisClient.xAdd("stream", "*", {
    //        data: JSON.stringify(sentObject),
    //      });
    // }, 100);

};

export default dataPush3;