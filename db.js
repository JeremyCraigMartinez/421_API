var MongoClient = require('mongodb').MongoClient;

// Open the connection to the Server
MongoClient.connect('mongodb://localhost:27017/test', function(err,db) {
	if (err) throw err;

	// Find one documents in our collection
	db.collection('names').findOne({}, function(err, doc) {
		if (err) throw err;

		// Print the result
		console.dir(doc);

		// Close the DB
		db.close();
	});

	// Declare success
	console.dir('Called findOne!');
})