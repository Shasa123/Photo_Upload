const express = require('express');
app = express();
config = require('./server/configure');
var mongoose = require('mongoose');
var path = require('path');
app.set('port',process.env.PORT || 3300);
app.set('Views',`${__dirname}/Views`)
app = config(app);
console.log(app.get('Views'));
app.get('/',(req,res) => {
    console.log('Hello World');
});

mongoose.connect('mongodb://localhost:27017/myProject',{useNewUrlParser:true,useUnifiedTopology:true});
var connection = mongoose.connection;

connection.once('open',() => {
    console.log('Connection to DB established successfully');
});

app.listen(app.get('port'),() => {
    console.log(`Server up at ${app.get('port')}`);
});

