const Stats = require('./stats'),
Images = require('./Images'),
Comments = require('./comments'),
async = require('async');
module.exports = (ViewModel,cb) =>{
   async.parallel([
       (next) => {
           Stats(next);
       },
       (next) => {
           Images.popular(next);
       },
       (next) => {
           Comments.newest(next);
       }
   ],(err,results) => {
       ViewModel.sidebar = {
           stats : results[0],
           popular : results[1],
           comments : results[2]
       };

       cb(ViewModel);
   });
};