var express = require('express');
var router = express.Router();
var db    = require("../models");
var axios = require("axios");
var cheerio  = require("cheerio");


/* GET home page. */
// display all scraped data on page
router.get("/", function(req, res){
	db.Article
	.find({}).sort({createdAt:-1})
	.then(function(dbArticles){
		if(dbArticles.length != 0){
			var handlerObj = {
				articles: dbArticles
			}
			res.render("home", handlerObj)
		} 
		else {
			res.render("home")
		}
	})
})

// get data from a webpade
router.get("/scrape", function(req, res){
	var res = res
	axios.get("https://www.atlasobscura.com/articles")
	.then(function(response){
		var $ = cheerio.load(response.data);
		var scrape = {
			articles: [],
			count: 0
		};

		//for every  `a` tag inside of container
		$(".container .index-row-wrap .article-card").each(function(i, element){
			//console.log(element);

			//console.log($(this).attr("href"))
			var link = "https://www.atlasobscura.com"+ $(this).attr("href");
			//console.log(link)
			
			//console.log($(this).find("img").attr("data-src"))
			var image = "https:" + $(this).find("img").attr("data-src");
			//console.log(image)

			//console.log($(this).find("h3 span").text())
			var title = $(this).find("h3 span").text();
			//console.log(title)

			//console.log($(this).find(".content-card-subtitle").text())
			var description = $(this).find(".content-card-subtitle").text()
			//console.log(description)

			//console.log($(this).find(".article-card-date").text())
			var date = $(this).find(".article-card-date").text()
			//console.log(date)

			var newArticle = {
				title: title,
				description: description,
				link: link,
				image: image,
				date: date
			}

			db.Article
			.create(newArticle)
			.then(function(dbArticle){
				scrape.articles.push(dbArticle)
				scrape.count++
				console.log("created")
				res.redirect("/")
			})

		})
	})
})

// update a particular article 
router.post("/save/:id", function(req, res){
	console.log(req.params.id)
	db.Article
	.findOneAndUpdate({_id:req.params.id}, {saved: req.body.saved})
	.then(function(response){
		console.log("updated")
		res.json({updated:true})
	})
})

// get all articles that are saved (true)
router.get("/saved", function(req, res){
	// find all articles that are saved
	// render "saved" and send in an object
	db.Article
	.find({saved: true}).sort({createdAt: -1})
	.then(function(dbArticles){
		console.log(dbArticles)
		var handlerObj = {
			savedArticles: dbArticles // []
		}
		res.render("saved", handlerObj)
	})
})

// get all notes for a particular article
router.get("/article/:id/notes", function(req, res){
	//console.log(req.params.id);
	db.Article
	.findOne({_id:req.params.id})
	.populate("note")
	.then(function(results){
		console.log("&&&&",results.note)
		res.json(results.note)
	})
})

// create a note and update article 
router.post("/create/note", function(req, res){
	console.log(req.body.articleID)
	//console.log(req.body.body)
	db.Note
	.create({body:req.body.body})
	.then(function(dbNote){
		//console.log(dbNote)
	
		db.Article
		.findOneAndUpdate({_id:req.body.articleID}, {$push:{ note: dbNote._id}})
		.then(function(result){
			console.log(result)
			
			res.json(dbNote)
		}).catch(function(err){
			console.log(err)
		})
	})
})

// delete a particular note from the db
router.get("/delete/note/:id", function(req, res){
	db.Note
	.findOneAndRemove({_id:req.params.id})
	.then(function(dbNote){
		//console.log(dbNote)
		res.json(dbNote);
	})
	.catch(function(err){
		console.log(err)
	})
})

module.exports = router;
