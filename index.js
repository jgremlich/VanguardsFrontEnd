// setup Express
var app = require('./models/express.js');

// start the server
var server = app.listen(80, function() {
console.log("Started on port 80");
var host = server.address().address;
var port = server.address().port;
});