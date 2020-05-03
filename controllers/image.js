const fs = require('fs');
const path = require('path');
var multer = require('multer');
var sidebar = require('../helpers/sidebar');
const Models = require('../models');
const md5 = require('md5');
const ViewModel = {
    image: {},
    comments: []
};
module.exports = {
    index(req, res) {
        Models.Image.findOne({
            filename: { $regex: `${req.params.image_id}` }
        }, (err, image) => {
            if (err) {
                throw err;
            }
            if (image) {
                image.views = image.views + 1;
                ViewModel.image = image;
                image.save();
                Models.Comment.find({ image_id: image._id }, {}, {
                    sort: {
                        'timestamp': 1
                    }
                }, (err, comments) => {
                    if (err) { throw err; }
                    ViewModel.comments = comments;
                    sidebar(ViewModel, (ViewModel) => {
                        res.render('image', ViewModel);
                    })
                })
            }
            else {
                console.log(req.params);
                res.redirect('/');
            }
        })

    },
    create(req, res) {
        const saveImage = function () {
            const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var imgUrl = '';
            for (let i = 0; i < 6; i += 1) {
                imgUrl += possible.charAt(Math.floor(Math.random() *
                    possible.length));
            }
            Models.Image.find({ filename: imgUrl }, (err, images) => {
                if (images.length > 0) {
                    saveImage();
                } else {
                    console.log('imgUrl ', imgUrl);
                    console.log('filename ', req.file.filename);
                    console.log('ext ', path.extname(req.file.filename));
                    const tempPath = req.file.path,
                        ext = path.extname(req.file.filename).toLowerCase(),
                        targetPath = path.resolve(`./public/upload/${imgUrl}${ext}`);
                    console.log('filename ', req.file.filename);
                    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext ===
                        '.gif') {
                        fs.rename(tempPath, targetPath, (err) => {
                            if (err) throw err;
                            var newImg = new Models.Image({
                                title: req.body.title,
                                filename: imgUrl + ext,
                                description: req.body.description
                            });
                            newImg.save((err, image) => {
                                if (err) { throw err; }
                                console.log('Filename' + image.filename);
                                console.log('Unique ID ' + image.uniqueId);
                                res.redirect(`/images/${image.uniqueId}`);
                            });
                        });
                    } else {
                        fs.unlink(tempPath, (err) => {
                            if (err) throw err;
                            res.status(500).json('Error', 'Only image files are allowed.');
                        });
                    }
                }
            })

        }
        saveImage();
    },
    like(req, res) {
        Models.Image.findOne({ filename: { $regex: req.params.image_id } }, (err, image) => {
            if (!err && image) {
                image.likes = image.likes + 1;
                image.save(err => {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        res.json({ likes: image.likes })
                    }
                })
            }
        })
    },
    comment(req, res) {
        Models.Image.findOne({
            filename: { $regex: req.params.image_id }
        }, (err, image) => {
            if (!err && image) {
                var newComment = new Models.Comment(req.body);
                newComment.gravatar = md5(newComment.email);
                newComment.image_id = image._id;
                newComment.save((err, comment) => {
                    if (err) {
                        throw err;
                    }
                    res.redirect(`/images/${image.uniqueId}#${comment._id}`);
                });
            } else {
                res.redirect('/');
            }
        });
    },
    remove: (req, res) => {
        Models.Image.findOne({
            filename: { $regex: req.params.image_id }
        }, (err, image) => {
            if (err) {
                throw err;
            }
            fs.unlink(path.resolve(`./public/upload/${image.filename}`), (err) => {
                if (err) {
                    throw err;
                }
                Models.Comment.remove({ image_id: image._id }, (err) => {
                    image.remove((err) => {
                        if (!err) {
                            res.json(true);
                        } else {
                            res.json(false);
                        }
                    });
                });
            });
        });
    }
};