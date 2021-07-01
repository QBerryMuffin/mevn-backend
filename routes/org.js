const express = require('express');
const router = express.Router();

const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const uri = process.env.DB_URI
const mongoClient = new MongoClient(uri, { useNewUrlParser : true,
                                         useUnifiedTopology: true  })

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
    const query = {"orgName": req.params.id}
    collection.find(query, { _id: 0 }).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        } else {
            res.json({"code": 20000, "data": results})
        }
    })
})

router.get('/getNames', (reg, res) => {
    const collection = client.db("mevn-testbed").collection("orgs")
    const projection = {orgName: 1, _id: 0}
    collection.find().project(projection).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        }else{
            const list = results.map(i => i.orgName)
            res.json({code: 20000, data:{total: list.length, items: list }})
    
        }
    })
})
 router.post ('/saveOrg', (req, res) => {
    const collection = client.db("mevn-testbed").collection("orgs")
    const query = { orgName: req.body.name }
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