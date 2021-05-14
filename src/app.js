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

app.get('/org/', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    
    collection.find().toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send([])
            return
        }

        res.send({code: 20000, data: results[0].orgs.default})
    })
})
app.get('/org/:id', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    let id = req.params.id
    collection.find().toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send([])
            return
        }

        res.send({code: 20000, data: results[0].orgs[id]})
    })
})

app.get('/getOrgNames', (reg, res) => {
    const collection = client.db("test").collection("CUCM")
    
    collection.find().toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send([])
            return
        }
        let list = Object.keys(results[0].orgs)
        res.send({code: 20000, data:{total: list.length, items: list}})
    })
})

app.post ('/addOrg', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    var todo = req.body.todo // parse the data from the request's body
    collection.insertOne({title: todo}, function (err, results){
        if (err) {
            console.log(err)
            res.send('')
            return
        }
        res.send(results.orgs) // returns the new document
    })
})

app.listen(process.env.PORT || 8081)