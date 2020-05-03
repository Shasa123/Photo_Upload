const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectID = Schema.Types.ObjectId;

const commentSchema = new Schema({
    image_id: { type: ObjectID },
    email: { type: String },
    name: { type: String },
    gravatar: { type: String },
    comment: { type: String },
    timestamp: { type: Date, 'default': Date.now }
});

commentSchema.virtual('image')
.set(function(image){
    this._image = image;
}).get(function(){
    return this._image;
});

module.exports = mongoose.model('Comment',commentSchema);