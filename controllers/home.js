const sidebar = require('../helpers/sidebar'),
ImageModel = require('../models/image');
const ViewModel = {
    images : []
}

module.exports = {
    index(req,res){
        ImageModel.find({},{},{sort : {timestamp : -1}},(err,images) => {
            if(err){
                throw err;
            }
            ViewModel.images = images;
            sidebar(ViewModel,(ViewModel) => {
                res.render('index',ViewModel);
               });
        });
       
   }
};