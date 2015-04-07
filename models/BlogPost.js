var mongoose = require('mongoose');

var schema = mongoose.Schema({
	title: { type: String, trim: true },
	created: { type: Date, default: Date.now },
	body: String,
	author: { type: String, ref: 'User' }
});

var lifecycle = require('mongoose-lifecycle');
schema.plugin(lifecycle);

var Post = mongoose.model('BlogPost', schema);

Post.on('afterInsert', function (post) {
	var url = "http://localhost:3000/posts/";
	console.log("read %s%s", url, post.id);
});

module.exports = Post;