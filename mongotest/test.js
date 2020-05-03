const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser : true,useUnifiedTopology : true},(err,client) =>{
    var db = client.db('myProject');
    console.log('connected to MongoDB');
    var collection = db.collection('users');
    // collection.insert({'name':'Shashwat'},(err,docs)=>{
    //     console.log(`${docs.ops.length} recors inserted`);
    //     console.log(`${docs.ops[0]._id}  ${docs.ops[0].name}`);
    // });

    collection.findOne({name:"Shashwat"},(err,doc) => {
        console.log(`${doc._id}  ${doc.name}`);
    })
});