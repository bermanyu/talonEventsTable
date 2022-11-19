const http       = require('http');
const Data = require('./data.json')
const port = 8000

//const PORT =

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors());
const configOptions = {
    methods:['GET'],
    origin:'http://localhost:3000'
}
app.get('/dataTable',cors(configOptions),(req,res)=>{
    res.json(Data)
})

app.listen(port,()=>{
    console.log('Server is Listening')
})

//const server = http.createServer(function(req,res){
//    res.setHeader('Content-Type','application/json');
//    res.setHeader('Access-Control-Allow-Origin','*');
//    res.writeHead(200);
////    res.write(Data.toString())
//
//    return res.end(JSON.stringify(Data));
//})
//
//server.listen(port, function(error){
//    if(error){
//        console.log('Something went wrong',error)
//    }
//    else{
//        console.log('Server is listening on port: '+ port);
//    }
//})

//const createServer = require('http')
//
//
//const server = createServer(function(request,response){
//    response.writeHead(200,{'Content-Type':'application/json'});
//
//})
