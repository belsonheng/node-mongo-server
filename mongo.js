var BSON = require('mongodb').BSONPure;

var MongoServer = new require('mongodb').Server('localhost', 27017, {auto_reconnect: true});
var MongoDB = new require('mongodb').Db('smartcache', MongoServer);

MongoDB.open(function(error, db) {
  if (!error) {
  	console.log("Connected to 'smartcache' database");
  	MongoDB.collection('html', function(error, collection) {
  	  if (error) console.log("The 'smartcache' collection doesn't exist. ")
  	});
  }
});

exports.findAll = function(request, response) {
  MongoDB.collection(request.params.collection, function(error, collection) {
  	collection.find().toArray(function(error, docs) {
  	  if (request.accepts('html')) response.render('data', {docs: docs, collection: request.params.collection});
      else {
      	response.set('Content-Type', 'application/json');
      	response.send(docs);
      }
  	});
  });
};

exports.findById = function(request, response) {
  var id = request.params.id;
  console.log('Retrieving document: ' + id);
  MongoDB.collection(request.params.collection, function(error, collection) {
  	collection.findOne({'_id':new BSON.ObjectID(id)}, function(error, doc) {
  	  response.send(doc);
  	});
  });
};

exports.addDocument = function(request, response, next) {
  var doc = request.body;
  console.log('Adding document from: ' + doc['source']);
  MongoDB.collection(request.params.collection, function(error, collection) {
  	collection.insert(doc, {safe: true}, function(error, result) {
  	  if (error) response.send({'error':error});
  	  else {
  	  	console.log('success');
        request.result = { "url": result[0].url, 
                           "domain": result[0].domain,
                           "source": result[0].source,
                           "crawled_date": result[0].crawled_date,
                           "response_time": result[0].response_time }; // store result in request
        return next();
  	  }
  	});
  });
};

exports.updateDocument = function(request, response) {
  var id = request.params.id;
  var doc = request.body;
  console.log('Updating document: ' + id);
  console.log(JSON.stringify(doc));
  MongoDB.collection(request.params.collection, function(error, collection) {
  	collection.update({'_id':new BSON.ObjectID(id)}, doc, {safe: true}, function(error, result) {
  	  if (error) response.send({'error':error});
  	  else {
  	  	console.log('' + result + ' document(s) updated');
  	  	response.send(request.body);
  	  }
  	});
  });
};

exports.deleteDocument = function(request, response) {
  var id = request.params.id;
  console.log('Deleting document: ' + id);
  MongoDB.collection(request.params.collection, function(error, collection) {
  	collection.remove({'_id':new BSON.ObjectID(id)}, {safe: true}, function(error, result) {
  	  if (error) response.send({'error':error});
  	  else {
  	  	console.log('' + result + ' document(s) deleted');
  	  	response.send(request.body);
  	  }
  	});
  });
};