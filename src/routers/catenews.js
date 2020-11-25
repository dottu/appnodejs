const express = require('express');
const { render } = require('pug');
const { commit } = require('../model/connect');
const cate_news = express.Router();
const con = require('../model/connect');
const check = require('../midderware/checklogin');
// const grant = require('../midderware/grant');
const path = require('path');
const multer  = require('multer');
const { normalize } = require('path');
// const upload = multer({dest : 'uploads/'})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        // cb(null, file.fieldname + '-' + Date.now() + file.path.split('/').slice(0).join('/'+ '.jpg'))
    }
})
const upload = multer({storage:storage});

                // for(var i=0; i < listIdTheLoai.length; i++) {
                //     var captintuctheloai = {
                //         idnews: idtintuc,
                //         idcategory: listIdTheLoai[i]
                //     }
                //     console.log('cap du lieu', captintuctheloai)
                //     // luu vao bang trung gian
                //     var luu = "INSERT INTO `categorynews` (idcategory, idnews) VALUES (";
                //         luu+= "'"+captintuctheloai.idcategory+"',";
                //         luu+= "'"+captintuctheloai.idnews+"')";
                //     con.query(luu,(err,result) =>{
                //         // console.log(result)
                //     });
                // }
//                 listIdTheLoai.forEach(i => {
//                     var captintuctheloai = {
//                         idnews: idtintuc,
//                         idcategory: i
//                     }
//                     console.log('abcde', captintuctheloai)
//                     var luu = "INSERT INTO `categorynews` (idcategory, idnews) VALUES (";
//                         luu+= "'"+captintuctheloai.idcategory+"',";
//                         luu+= "'"+captintuctheloai.idnews+"')";
//                     con.query(luu, (err,result)=>{

//                     });
//                 });
//             // console.log(req.body.img = req.file.path.split('/').slice(0).join('/'));
//             console.log('abcdef', req.file)
//             }
//         });  
//         // redirect 
//         // res.send(result)
//         res.redirect('/catenews/view')
//     });
// });

cate_news.get('/', (req,res)=>{
    con.query("SELECT * FROM news",(err,news)=>{
        res.render('index',{news:news})
    })
})

//QH 1-n

cate_news.get('/catenews',  (req, res,next) =>{
    //lay du lieu tat ca the loai
    con.query("SELECT * FROM `category`",(err, category) => {
        con.query("SELECT * FROM `author`",(err, author) => {
            res.render('products/catenews', {category:category, author: author})
        })
    })
});

cate_news.post('/catenews',upload.single('img'),(req,res)=>{
    // console.log('file', req.file)
    req.body.img = req.file.filename;
    // console.log('abas', req.body)
    // console.log('input dau vao', req.body)
    var ctnews = "INSERT INTO `news` (img,title,description,status,idauthor,createat,updateat) VALUES (";
        ctnews += "'"+req.body.img+"',";
        ctnews += "'"+req.body.title+"',";
        ctnews += "'"+req.body.description+"',";
        ctnews += "'"+req.body.status+"',";
        ctnews += "'"+req.body.idauthor+"',";
        ctnews += "'"+req.body.createat+"',";
        ctnews += "'"+req.body.updateat+"')"; 
    con.query(ctnews,(err, result) => {
        // lay lai id vua tao
        con.query("SELECT * FROM news ORDER BY idnews DESC LIMIT 1",(err,result)=>{
             // ghep vs id the loai 
             console.log('tg',result)
            var chitiettintucvuatao = result[0];
            // console.log('abc',chitiettintucvuatao)
            var idtintuc = chitiettintucvuatao.idnews;
            console.log('a', idtintuc)
            // var listIdTheLoai = [];
            // listIdTheLoai.push(req.body.idcategory);
            var listIdTheLoai = req.body.idcategory;
            console.log(listIdTheLoai)
            // console.log('abccc', listIdTheLoai)
            if (listIdTheLoai.length > 0) {
                // for(var i=0; i < listIdTheLoai.length; i++) {
                //     var captintuctheloai = {
                //         idnews: idtintuc,
                //         idcategory: listIdTheLoai[i]
                //     }
                //     console.log('cap du lieu', captintuctheloai)
                //     // luu vao bang trung gian
                //     var luu = "INSERT INTO `categorynews` (idcategory, idnews) VALUES (";
                //         luu+= "'"+captintuctheloai.idcategory+"',";
                //         luu+= "'"+captintuctheloai.idnews+"')";
                //     con.query(luu,(err,result) =>{
                //         // console.log(result)
                //     });
                // }
                listIdTheLoai.forEach(i => {
                    var captintuctheloai = {
                        idnews: idtintuc,
                        idcategory: i
                    }
                    console.log('abcde', captintuctheloai)
                    var luu = "INSERT INTO `categorynews` (idcategory, idnews) VALUES (";
                        luu+= "'"+captintuctheloai.idcategory+"',";
                        luu+= "'"+captintuctheloai.idnews+"')";
                    con.query(luu, (err,result)=>{

                    });
                });
            }
        });  
        // redirect 
        setTimeout(() => {
        res.redirect('/catenews/view?q=')
        }, 500);
    });
});

//view ra màn hình

cate_news.get('/catenews/view', (req, res) =>{
    //lay' mang trung gian

    // console.log('áb', req.query)
    // var titlesearch = req.query.q;
    // var des = req.query.q;
    // var  status = req.query.q;
    // var tg = req.query.q;
    // var tl = req.query.q;
    // var datedang = req.query.q;
    // var datesua = req.query.q;
    // console.log('absdbasf', titlesearch)

    var danhsachbaiviet = [];
    var listtheloai = [];
    let query ='SELECT news.idnews,news.img,news.title,news.description,news.status,news.idauthor,news.createat,news.updateat FROM news INNER JOIN categorynews ON news.idnews=categorynews.idnews';
    if(req.query.q && req.query.idcategory){
        query += " WHERE news.title LIKE '%"+req.query.q+"%'";
        query += " AND categorynews.idcategory = '"+req.query.idcategory+"'";
    }
    else if(req.query.q){
        query += " WHERE news.title LIKE '%"+req.query.q+"%'";
    }else if(req.query.idcategory){
        query += " WHERE categorynews.idcategory = '"+req.query.idcategory+"'";
    }

    // var viewtheloai = [];
    // var listbaiviet = [];
    con.query(query, (err, news) =>{
        //duyet mang news
        news.forEach(item => {
            // console.log(item);
            var objbaiviet = item;
            // console.log('haha',objbaiviet)
            objbaiviet.objtacgia = {};
            objbaiviet.arraytheloai = [];
            // objbaiviet.objtheloai = {};
            var tacgia = item.idauthor;
            var tintuc = item.idnews;
            // console.log('tacgia : ', tacgia)
            con.query("SELECT * FROM author WHERE idauthor="+tacgia, (err, author)=>{
                // console.log('agda',author)
                objbaiviet.objtacgia = author[0];
                // console.log('abcccc', objbaiviet)
                // danhsachbaiviet.push(objbaiviet)
            });
            con.query("SELECT * FROM categorynews WHERE idnews="+tintuc,(err, categorynews)=>{
                categorynews.forEach(element => {
                    // objbaiviet.arraytheloai = [];
                    var theloai = element.idcategory;
                    console.log('theloai', theloai)
                    con.query("SELECT * FROM category WHERE idcategory="+theloai, (err, category)=>{
                        category.forEach(tl => {
                            var objtheloai = category[0];
                            console.log(objtheloai)
                            objbaiviet.arraytheloai.push(objtheloai);
                            console.log('arrtheloai', objbaiviet.arraytheloai)
                        });
                    })
                });
            });
            // console.log('abccc', objbaiviet)
            // var flag_exist = false;
            // // for danhsachbaiviet
            // danhsachbaiviet.forEach(lit => {
            //     if(lit.idnews==objbaiviet.idnews){
            //         flag_exist = true;
            //         return;
            //     }
            // });
            //   // ton tai
            //    //flag_exist= true; break;
            
            // if (!flag_exist) {
            //     // danhsachbaiviet.push(objbaiviet);
            //     if(objbaiviet.idnews){
            //         danhsachbaiviet.push(objbaiviet);
            //     }
            // }
            con.query('SELECT DISTINCT idnews * FROM categorynews',(err,bana)=>{
                console.log('eqwe', bana)
                bana.forEach(nit => {
                    var lap = nit;
                    objbaiviet.p
                });
            })
        });
        con.query("SELECT * FROM category",(err,cates)=>{
                listtheloai = cates;
        });
        // let query ='SELECT news.title ,categorynews.idnews,categorynews.idcategory FROM news INNER JOIN categorynews ON news.idnews=categorynews.idnews';
        // if(req.query.q && req.query.idcategory){
        //     query += " WHERE news.title LIKE '%"+req.query.q+"%'";
        //     query += " AND categorynews.idcategory = '"+req.query.idcategory+"'";
        // }
        // else if(req.query.q){
        //     query += " WHERE news.title LIKE '%"+req.query.q+"%'";
        // }else if(req.query.idcategory){
        //     query += " WHERE categorynews.idcategory = '"+req.query.idcategory+"'";
        // }
        // console.log('asd',query)
        // con.query(query,(err,caten)=>{
        //     console.log('asdas',caten)
        //     // caten.forEach(tlll => {
                
        //     // });
        //     // danhsachbaiviet = caten;
        // });
    });
    setTimeout(() => {
        // var kq = danhsachbaiviet.filter((ne)=>{
        //     // console.log('tacgiaaa', ne.objtacgia.name)
        //     var tacg = ne.objtacgia.name.toLowerCase().indexOf(tg.toLowerCase()) !== -1;
        //     // console.log('tacgia', tacg)
        //     var list = [];

        //     list.forEach(tloai => {
        //         var tennn = tloai;
        //         var t =  tennn.toLowerCase().indexOf(tl.toLowerCase()) !== -1;
        //         listboolean.push(t)
        //         // console.log('boolean',t)
        //         return t;
        //     });

        //         return  ne.title.toLowerCase().indexOf(titlesearch.toLowerCase()) !== -1 || ne.description.toLowerCase().indexOf(des.toLowerCase()) !== -1 ||ne.status.toLowerCase().indexOf(des.toLowerCase()) !== -1 || tacg ;
        // });
        // console.log('var', viewtheloai)
        // console.log('asbad', kq)
        console.log('asasdas', danhsachbaiviet)
        res.render('products/viewct', {danhsachbaiviet:danhsachbaiviet, listtheloai:listtheloai})
    }, 1000);

});




//EDIT
cate_news.get('/catenews/view/:idnews',check.checklogin,(req, res) =>{
	con.query("SELECT * FROM news WHERE idnews='"+req.params.idnews+"'", (err, result) =>{
        // console.log('abc', result)
        con.query("SELECT * FROM `category`", (err, category)=>{
            con.query("SELECT * FROM `author`", (err, author)=>{
                con.query("SELECT * FROM categorynews",(err,categorynews)=>{
                    res.render('products/editnews', {category:category, author:author, result:result[0],categorynews:categorynews})           
                })
            });
        });
	});
});

cate_news.post('/catenews/view/:idnews', (req, res)=>{
    // console.log('abc', req.params.idnews)
    //delete idnew trong bang trung gian
    con.query("DELETE FROM categorynews WHERE idnews="+req.params.idnews+"",(err,categorynews)=>{
        // console.log('abad', categorynews)
        var upn = "UPDATE news SET ";
            upn += "img ='"+req.body.img+"',";
            upn += "title ='"+req.body.title+"',";
            upn += "status ='"+req.body.status+"',";
            upn += "idauthor ='"+req.body.idauthor+"',";
            upn += "createat ='"+req.body.createat+"',";
            upn += "updateat ='"+req.body.updateat+"'";
            upn += "WHERE idnews="+req.params.idnews+"";
        // console.log('abas', upn)
        con.query(upn,(err, result)=>{
            // console.log('aba', result)
            var layidtintuc = req.params.idnews;
            // console.log('abc',layidtintuc);
            var layidtheloai = req.body.idtheloai;
            // console.log(layidtheloai,'adc')
            // con.query("SELECT * FROM category", (err, category)=>{
                for(var i = 0 ; i < layidtheloai.length ; i++){
                    // console.log('acbasaf',listtl)
                    // console.log('acdd', listtl)
                    var updatetheloai = {
                        idnews: layidtintuc,
                        idcategory : layidtheloai[i]
                    }
                    // console.log('abcccc', updatetheloai)
                    var upd = "INSERT INTO categorynews (idcategory,idnews) VALUE (";
                        upd += ""+updatetheloai.idcategory+",";
                        upd += ""+updatetheloai.idnews+")";
                    con.query(upd,(err, result)=>{
                        // console.log('avaf', result)
                        res.redirect('/catenews/view')
                    })
                }// });
            // });
        });
    });
});

cate_news.get('/view/:idnews', check.checklogin,(req,res)=>{
    con.query("SELECT * FROM news WHERE idnews="+req.params.idnews+"",(err, result)=>{
        // console.log('abc', result)
        res.render('products/view',{result:result})
    })
});

//DELETE catenews
cate_news.get('/catenews/view/delete/:idnews',(req, res) =>{
    console.log(req.params.idnews)
    con.query("DELETE FROM categorynews WHERE idnews="+req.params.idnews+"", (err, result)=>{
        con.query("DELETE FROM news WHERE idnews="+req.params.idnews+"",(err,news)=>{
            console.log('asbbas',news)
            res.redirect('/catenews/view')
        });
    });
});


//Create Account
cate_news.get('/createaccount',check.checklogin,(req, res)=>{
    res.render('products/createuser')
});

cate_news.post('/createaccount',(req, res)=>{
    var lg = "INSERT INTO user (username,pass) VALUES(";
        lg += "'"+req.body.username+"',";
        lg += "'"+req.body.pass+"')";
    con.query(lg,(err, result)=>{
        // console.log('abc', result);
        res.redirect('/login')
    });
});





//View USER
cate_news.get('/user',check.checklogin,(req,res,next)=>{
    // console.log('abc',req.body)
    con.query('SELECT * FROM user',(err,user)=>{
        res.render('products/user', {user:user});
    });
    // next();
});

//EDIT User

cate_news.get('/user/edit/:id',check.checklogin,(req,res)=>{
    con.query('SELECT * FROM user WHERE id='+req.params.id+"",(err,result)=>{
        res.render('products/edituser',{result:result[0]})
        // console.log('adasd',result)
    });
});

cate_news.post('/user/edit/:id', (req,res)=>{
    // console.log('abc', req.params)
    var upu = "UPDATE user SET ";
        upu += "username='"+req.body.username+"',";
        upu += "pass='"+req.body.pass+"'";
        upu += "WHERE id="+req.params.id+"";
        // console.log('bbb',upu)
    con.query(upu,(err,result)=>{
        res.redirect('/user')
    });
});

//DELETE User

cate_news.get('/user/delete/:id',(req,res)=>{
    con.query('DELETE FROM user WHERE id='+req.params.id+"",(err, result)=>{
        res.redirect('/user')
    });
});

// Login
cate_news.get('/login',(req,res,next)=>{
    res.render('products/login');
});

cate_news.post('/login',(req,res)=>{
    var user = req.body.username;
    var password = req.body.pass;
    // console.log('abc', username);
    // console.log('abcc',password);
    if(user && password){ //check username and password
        con.query("SELECT * FROM user WHERE username= ? AND pass=?",[user,password],(err,result)=>{
            // console.log('abcas',result)
            if(result.length >0){
                req.session.login = true;
                req.session.user = user;
                console.log('abc',req.session.user)
            
                res.redirect('/user')
            }else{
                res.send('Password sai')
            }
        });
    }else{
        res.send('Ban chua nhap user or password')
    }
});


cate_news.get('/uploads',(req,res)=>{
    con.query("SELECT *FROM ima",(err,image)=>{
        // console.log('abc',image)
        res.render('products/upload',{image:image})
    })
})

cate_news.post('/uploads',upload.single('img'), (req,res) =>{
    req.body.img = req.file.filename;
    console.log('abcad',req.body.img);
    var upp = "INSERT INTO ima (img) VALUES (";
        upp += "'"+req.body.img+"')";
    con.query(upp,(err,result)=>{
        // console.log('abcaf', result)
        console.log('abc', req.file.filename)
        console.log('file', req.file)
        console.log('protocol', req.protocol)
        res.redirect('/uploads')
    });
});


//SEARCH 

cate_news.get('/search',(req,res)=>{
    console.log(req.query);
    // var search = req.query.title;
    // var kq = news.filter((new)=>{
    //     return 
    // })
    con.query("select * from news",(err,news)=>{
        var namesearch = req.query.title;
        // console.log(namesearch)
        var result = news.filter((anh)=> {
            return anh.title.toLowerCase().indexOf(namesearch.toLowerCase()) !== -1
        });
        console.log(result)
        res.render('index',{
            news : result
        });
    });
});



module.exports = cate_news;