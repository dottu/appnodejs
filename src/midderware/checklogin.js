// const cate_news = require("../routers/catenews");
const alret = require('alert');

// const con = require('../model/connect');

module.exports.checklogin = function(req,res,next) {
    if(!req.session.user){
        res.redirect('/login')
    }
    next();
}