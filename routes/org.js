const express = require('express');
const router = express.Router();

const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const uri = "mongodb://home-test-mongo:3B21gdHSSxACQMhxsKeEX06XeWjNCQrI9JF0a8NR3AgcdeigU0WsDHm9cbIVUTeZenF1n7d6G8N1UhBLaAKzjg==@home-test-mongo.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@home-test-mongo@"
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
    const collection = client.db("mevn-testbed").collection("orgs")
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
    const collection = client.db("mevn-testbed").collection("orgs")
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
    const collection = client.db("mevn-testbed").collection("orgs")
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
    const collection = client.db("mevn-testbed").collection("orgs")
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