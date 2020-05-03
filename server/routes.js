var router = require('express').Router(),
home = require('../controllers/home'),
image = require('../controllers/image');
var path = require('path');
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,'../public/upload/temp'))
    },
    filename :function(req,file,cb){
        cb(null,file.originalname);
    }
});
var upload = multer({storage:storage});

module.exports = (app) => {
    router.get('/',home.index);
    router.get('/images/:image_id',image.index);
    router.post('/images',upload.single('file'),image.create);
    router.post('/images/:image_id/like',image.like);
    router.post('/images/:image_id/comment',image.comment);
    router.delete('/images/:image_id',image.remove);
    app.use(router);
}