const alert = require('alert')

module.exports.quyen = function(req,res,next){
    if(req.session.user != 'admin'){
        alert('Ban khong co quyen')
    }
}