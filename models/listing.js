const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    location: { type: String, required: true },
    image: { 
        url: String,
        filename: String
},
review: [{
    type: Schema.Types.ObjectId,
    ref: 'Review',
}
],
owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
latitude: Number,
longitude: Number,
category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic cities",
      "Waterside",
      "Mountains",
      "Castles",
      "Arctic",
      "Campaign",
      "Farms",
    ],
    required: true
  },
});

listingSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await mongoose.model('Review').deleteMany({
            _id: { $in: doc.review }
        });
    }
});

module.exports = mongoose.model('Listing', listingSchema);
