var express = require('express')
var model = require('./model.js')
var api = require('./api')(express, model)
var app = express();
require('./auth')(app, model)

app.use('/api/', api)

app.listen(3000)
console.log('Listening on port 3000')
