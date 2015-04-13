
module.exports = function (app) {

	//404s
	app.use(function(req, res, next) {
		res.status(404);

		return res.json({ error: "These aren't the json files you're looking for" });
	});

	app.use(function(err, req, res, next) {
		console.error('error at %s\n', req.url, err);
		res.send(500, 'Oops');
	});
}