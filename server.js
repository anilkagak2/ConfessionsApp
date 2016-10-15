var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONFESSIONS_COLLECTION = "confessions";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/confessions", function(req, res) {
});

/*
{
  "_id": <ObjectId>
  "firstName": <String>,
  "lastName": <String>,
  "email": <String>,
  anonymous: <Boolean>,
  confession: <String>,
  city: <String>,
  country: <String>,
  createdate: <Date>
}
 */
app.post("/confession", function(req, res) {
    var newConfession = req.body;
    newConfession.createDate = new Date();
    
    if (!req.body.confession) {
        handleError(res, "Invalid confession", "Must provide a confession", 400);
    }
    
    db.collection(CONFESSIONS_COLLECTION).insertOne(newConfession, function(error, doc) {
        if (error) {
            handleError(res, error.message, "Failed to create a confession");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});
