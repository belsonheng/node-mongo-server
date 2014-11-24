var express		= require('express'),
    app			= express();

var server    	= require('http').createServer(app),
    mongodb 	= require('./mongo'),
    bodyParser 	= require('body-parser'),
    path 		= require('path'),
    Primus		= require('primus'),
    Emitter		= require('primus-emitter');

var primus = new Primus(server, {transformer: 'SockJS'});

app.set('port', process.env.PORT || 9002);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser({limit: '1gb'}));
app.use(express.static(path.join(__dirname, 'public')));

// root
app.get('/', function(request, response) {
  response.render('index');
});

// get all documents within a collection
app.get('/:collection', mongodb.findAll);

// get a single document by id
app.get('/:collection/:id', mongodb.findById);

// save new document into collection
app.post('/:collection', mongodb.addDocument, function(request, response) {
  primus.send('data', request.result);
  response.send({'id':request.result['_id']});
});

// update document in a collection
app.put('/:collection/:id', mongodb.updateDocument);

//delete document in a collection
app.delete('/:collection/:id', mongodb.deleteDocument);

// 404
app.use(function(request, response) {
  response.render('404', {url:request.url});
});

primus.use('emitter', Emitter);
primus.on('connection', function(spark) {
  console.log('client ' + spark.id + ' has connected to the server');
});

server.listen(app.get('port'), function() {
  console.log('Mongo server listening on port ' + app.get('port'));
});

primus.save(__dirname + '/primus.js');