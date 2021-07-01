const express = require('express');
const router = express.Router();

const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const uri = process.env.DB_URI
const mongoClient = new MongoClient(uri, { useUnifiedTopology: true,
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
    const collection = client.db("mevn-testbed").collection("sites")
    const query = {"orgName": "default"}
    collection.find(query).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        } else {
            res.json({ "code": 20000, "data": results})
        }
    })
})

router.get('/byId/:id', (req, res) => {
    const collection = client.db("mevn-testbed").collection("sites")
    const query = {"orgName": req.params.id}
    collection.find(query).toArray(function (err, results){
        if (err) {
            console.log(err)
            res.json({'code': 10000, "data": {"error": err}})
        } else {
            res.json({ "code": 20000, "data": results})
        }
    })
})