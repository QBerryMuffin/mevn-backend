const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongo = require('mongodb')
const { raw } = require('body-parser')
const MongoClient = mongo.MongoClient
const uri = 'mongodb+srv://test:test1234@testbug.rhc7n.mongodb.net/test'
var client
const mongoClient = new MongoClient(uri, { reconnectTries : Number.MAX_VALUE, 
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
    const query = {"name": "default"}
    collection.find(query).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send({'code': 10000, "data": {"error": err}})
            return
        }

        res.send({code: 20000, data: results})
    })
})
app.get('/org/:id', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    let id = req.params.id
    const query = {"name": id}
    collection.find(query).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send({'code': 10000, "data": {"error": err}})
            return
        }
        delete results[0]._id
        res.send({code: 20000, data: results[0]})
    })
})

app.get('/getOrgNames', (reg, res) => {
    const collection = client.db("test").collection("CUCM")
    const projection = {name: 1}
    collection.find().project(projection).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.send({'code': 10000, "data": {"error": err}})
            return
        }
        const list = results.map(i => i.name)

        res.send({code: 20000, data:{total: list.length, items: list }})
    })
})

app.post ('/saveOrg', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    const query = { name: req.body.name }
    const updateDoc = {$set: req.body}
      

    collection.updateOne(query, updateDoc, function (err, results){
        if (err) {
            console.log(err)
            res.send({'code': 10000, "data": {"error": err}})
            return
        }
        res.send({'code': 20000, "data": {"results": results}}) // returns the new document
    })
})

app.listen(process.env.NODE_ENV.PORT || 8081)