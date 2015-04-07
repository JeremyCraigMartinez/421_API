var loggedIn = require('../middleware/loggedIn');
var BlogPost = require('../models/BlogPost');

module.exports = function (app) {
	//create
	app.get("/post/create", loggedIn, function (req, res) {
		res.render('post/create.jade');
	});

	app.post("/post/create", loggedIn, function (req, res, next) {
		var body = req.body['body'];
		var title = req.body['title'];
		var user = req.session.user;

		BlogPost.create({
			body: body,
			title: title,
			author: user
		}, function (err, post) {
			console.log("here");
			console.log(err);
			//if (err) return next(err);
			res.redirect('/post/' + post.id);
		});
	});

	app.get("/post/:id", function (req, res, next) {
		console.log('here');
		var query = BlogPost.findById(req.params['id']);

		query.populate('author');

		query.exec(function (err, post) {
			if (err) return next(err);

			if (!post) return next(); //404

			res.render('post/view.jade', { post: post});
		});
	});
}