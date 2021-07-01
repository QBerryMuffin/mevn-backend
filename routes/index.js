const express = require('express')
const router = express.Router()

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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CUCM Backend API' });
});

router.get('/orgs/getNames', (reg, res) => {
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
router.get('/:collection/byId/:id', (req, res) => {
  const collection = client.db("mevn-testbed").collection(req.params.collection)
  const query = {"orgName": req.params.id}
  console.log(query)
  collection.find(query, {_id: 0}).toArray(function (err, results){
    if (err) {
      console.log(err)
      res.json({"code": 10000, "data": {"error": err}})
    } else {
      res.json({"code": 20000, "data": results})
    }
  })
})
router.post ('/:collection/save', (req, res) => {
  const collection = client.db("mevn-testbed").collection(req.params.collection)
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

module.exports = router;
