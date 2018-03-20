var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    
    title: {
    	type: String, 
    	required: true
    },

    description: {
    	type: String
    },

    link: {
    	type: String, 
    	required: true
    },

    image: {
        type: String
    },

    saved: {
    	type: Boolean, 
    	default: false
    },

    date: {
		type:String,
	},

    createdAt: {
        type: Date,
        default: Date.now
    },

    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article;
