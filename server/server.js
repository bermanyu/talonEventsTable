const Data = require('./data.json')
const port = 8000


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

