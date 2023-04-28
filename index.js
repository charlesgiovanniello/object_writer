const express = require('express');
const {main} = require('./app')
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World');
  });

app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port 3000!")
  });

main();