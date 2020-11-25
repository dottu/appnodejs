const express = require('express');
const user_router = express.Router();
const con = require('../model/connect');
const bodyParser = require('body-parser');
const { query } = require('express');
const { render } = require('pug');
const { use } = require('./catenews');
const check = require('../midderware/checklogin');
const grant = require('../midderware/grant')


// var ktra = [check,grant]
//AUTHOR
user_router.get('/author', function(req, res){
	con.query('SELECT * FROM author', function(err, author){
		res.render('post/author',{author:author});
	})
});

user_router.get('/author/createauthor',function(req, res){
	res.render('post/createauthor');
});

user_router.post('/author/createauthor', function(req, res){
	// console.log('abca', req.body)
	var queryy = "INSERT INTO `author` (name, createat, updateat) VALUES (";     
                queryy += " '"+req.body.name+"',";
                queryy += " '"+req.body.createat+"',";
                queryy += " '"+req.body.updateat+"')";
            con.query(queryy,(err, result) =>{
				res.redirect('/post/author')
			});
});

//CATEGORY
user_router.get('/category', function(req, res){
	con.query ("SELECT *FROM category ", function(err, category){
		res.render('post/category', {category:category}
			
		);
		// console.log({category:category})
	})
});

user_router.get('/category/createcategory',(req, res) =>{
	res.render('post/createcategory');
});

user_router.post('/category/createcategory', (req, res) => {
	var ct = "INSERT INTO `category` (name) VALUES (";
		ct += "'"+req.body.name+"')";
	con.query(ct,(err, result)=>{
		res.redirect('/post/category');
	})	
	// console.log(req.body);
});

//NEWS

user_router.get('/news', (req, res) => {
	con.query('SELECT *FROM `news`',(err, news)=>{
		res.render('post/news',{news:news})
	})
	con.query('SELECT *FROM `category`', (err, category)=>{
		res.render('post/news',{category:category})
	})
});

user_router.get('/news/ctnews',(req, res) =>{
	res.render('post/ctnews')
});

// user_router.post('/news/ctnews', (req, res) =>{
// 	var ctnews = "INSERT INTO `news` (title,description,status,createat,updateat) VALUES (";
// 		ctnews += "'"+req.body.title+"',";
// 		ctnews += "'"+req.body.description+"',";
// 		ctnews += "'"+req.body.status+"',";
// 		ctnews += "'"+req.body.idauthor+"',";
// 		ctnews += "'"+req.body.createat+"',";
// 		ctnews += "'"+req.body.updateat+"')";
// 	con.query(ctnews,(err, result) => {
// 		res.redirect('/post/news')
// 	});
// });

// DELETE
user_router.get('/author/:idauthor', (req, res) =>{
	// code
	con.query("DELETE FROM author WHERE idauthor='"+req.params.idauthor+"'",(err, result) =>{
		if(result.affectedRows){
			res.redirect('/post/author')
		}
	});
});
user_router.get('/category/:idcategory', (req, res) =>{
	// code
	con.query("DELETE FROM category WHERE idcategory='"+req.params.idcategory+"'",(err, result) =>{
		if(result.affectedRows){
			res.redirect('/post/category')
		}
	});
});

// UPDATE 
// user_router.get('/category/update/:idcategory', (req, res)=>{
// 		con.query("SELECT * FROM category WHERE idcategory="+req.params.idcategory+"", (err, result)=>{
// 			// console.log('ac', result)
// 			res.render('post/updatect',{result:result})
// 		})
// })

// user_router.post('/category/update/:idcategory', (req, res)=>{
// 	var up = "UPDATE category SET";
// 		up += "name='"+req.body.name+"'";
// 		up += "WHERE idcategory='"+req.body.idcategory+"'";
// 	con.query(up,(err,result)=>{
// 		if(err) throw err;
// 		console.log('abc',result.affectedRows)
// 		// res.redirect('/post/category')
// 	})
// })









module.exports = user_router;