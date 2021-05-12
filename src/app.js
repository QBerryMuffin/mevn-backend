const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const uri = 'mongodb+srv://test:test1234@testbug.rhc7n.mongodb.net/test'
var client;

var mongoClient = new MongoClient(uri, { reconnectTries : Number.MAX_VALUE, 
                                         autoReconnect : true,
                                         useNewUrlParser : true })
mongoClient.connect((err, db) => {
    if (err != null) {
        console.log(err)
        return
    }
    client = db
})

const app = express() // create your express app

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

app.get('/CUCM', (reg, res) => {
    const collection = client.db("test").collection("CUCM")
    
    collection.find().toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send([])
            return
        }

        res.send(results)
    })
})
app.post ('/addCUCM', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    var todo = req.body.todo // parse the data from the request's body
    collection.insertOne({title: todo}, function (err, results){
        if (err) {
            console.log(err)
            res.send('')
            return
        }
        res.send(results.ops[0]) // returns the new document
    })
})

app.listen(process.env.PORT || 8081)