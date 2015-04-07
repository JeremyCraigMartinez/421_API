
module.exports = function (app) {

	//404s
	app.use(function(req, res, next) {
		res.status(404);

		if (req.accepts('html')) {
			return res.send("<h2>These aren't the webpages you're looking for</h2>");
		}

		if (req.accepts('json')) {
			return res.json({ error: "These aren't the json files you're looking for" });
		}

		//default response type
		res.type('txt');
		res.send("There are the text files you looking for");
	});

	app.use(function(err, req, res, next) {
		console.error('error at %s\n', req.url, err);
		res.send(500, 'Oops');
	});
}