const express = require('express');
const router = express.Router();

const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const uri = 'mongodb+srv://test:test1234@testbug.rhc7n.mongodb.net/test'
const mongoClient = new MongoClient(uri, { reconnectTries : Number.MAX_VALUE, 
                                         autoReconnect : true,
                                         useNewUrlParser : true })

var client = {}
mongoClient.connect((err, db) => {
        if (err != null) {
            console.log(err)
        } else{
             client = db
        }
})

router.get('/', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    const query = {"name": "default"}
    collection.find(query).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        } else {
            res.json({"code": 20000, "data": results})
        }
    })
})

router.get('/byId/:id', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    let id = req.params.id
    const query = {"name": id}
    collection.find(query).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        } else {
            delete results[0]._id
            res.json({"code": 20000, "data": results})
        }
    })
})

router.get('/getNames', (reg, res) => {
    const collection = client.db("test").collection("CUCM")
    const projection = {name: 1}
    collection.find().project(projection).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        }else{
            const list = results.map(i => i.name)
            res.json({code: 20000, data:{total: list.length, items: list }})
    
        }
    })
})
 router.post ('/saveOrg', (req, res) => {
    const collection = client.db("test").collection("CUCM")
    const query = { name: req.body.name }
    const updateDoc = {$set: req.body}
      

    collection.updateOne(query, updateDoc, function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        } else{
            res.json({'code': 20000, "data": {"results": results}}) // returns the new document
        }
        
    })
})


module.exports = router