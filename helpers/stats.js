var async = require('async'),
models = require('../models');
module.exports = (callback) => {
    async.parallel([
        (next) => {
            models.Image.count({},next);
        },
        (next) => {
            models.Comment.count({},next);
        },
        (next) => {
            models.Image.aggregate([{
                $group : {
                    _id : '1',
                    viewTotal : { $sum : '$views'} 
                }
            }],(err,results) => {
                var viewTotal = 0;
                if(results.length > 0){
                    viewTotal += results[0].viewTotal;
                }
                next(null,viewTotal);
            })
        },
        (next) => {
            models.Image.aggregate([{
                $group : {
                    _id : '1',
                    likeTotal : {$sum : '$likes'}
                }
            }],(err,results) => {
                var likeTotal = 0;
                if(results.length>0)
                {
                    likeTotal += results[0].likeTotal
                }
                next(null,likeTotal);
            });
        }
    ],(err,results) => {
        callback(null,{
            images : results[0],
            comments : results[1],
            views : results[2],
            likes : results[3]
        });
    });
}