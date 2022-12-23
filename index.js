// 配置
const CONFIG={
    NAME:"PayPass",
    TRC:"TLKztS9rZgEYvL8yu9rMdi5CEHiJsv75B3",
    TOKEN:"5468349282:AAEiyCr1YxSqj456BFgDCOobSsUkyuh6rMA",
    DB:"mongodb+srv://paypass:hello010@cluster0.bv2rmsp.mongodb.net/?retryWrites=true&w=majority"
}
// 依赖
const md5 = require('md5-node');
const express = require('express');
const app = express();
require("events").EventEmitter.defaultMaxListeners=0;
const Telebot=require("./Telebot")
const {MongoClient}=require("mongodb");
const request=require("request")
// 连接 数据库
const client=new MongoClient(CONFIG.DB)
const pp=client.db("pp")
const db={
  user:pp.collection("user"),
  group:pp.collection("group"),
  member:pp.collection("member")
}
let ACTION={}
app.use(express.json())
app.post("/",async(req,final)=>{  
  let tb=new Telebot(req.body)
  
  tb=undefined
  final.send("SUCCESS")
})
function Stamp2Rest(s){
  const now=new Date(Date.now())*1
  if(s<=now){
      return 0
  }else{
      return ((s-now)/1000).toFixed(0)
  }
}
function createOrder(TRC,quant,callback,form){
  return new Promise((resolve, reject) => {
    request({
      url:"http://96.43.88.208:8443/createOrder?to="+TRC+"&quant="+quant+"&callback="+callback+"&data="+JSON.stringify(form),
      json:true
    },(err,res,body)=>{
      resolve(body)
    })
  })
}
const PORT=process.env.PORT || 80
app.listen(PORT, () => {
    console.log("Run【"+CONFIG.NAME+"】Service")
});