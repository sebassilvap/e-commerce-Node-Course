const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide a product name'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },

    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },

    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },

    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },

    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },

    company: {
      type: String,
      required: [true, 'Please provide product company'],
      //another way to set up the enum with msg in case the company is not found
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },

    colors: {
      type: [String],
      default: ['#222'], // default color if not provided
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      required: true,
      default: 15,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    // user is type UserSchema
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  {
    timestamps: true,

    // set up virtuals to have access to Reviews
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id', // what is common between the 2
  foreignField: 'product',
  justOne: false, // I want the list
  //?match: { rating: 5 }, // documents where rating is 1
});

//! If I remove the product, remove the reviews associated with it

ProductSchema.pre('remove', async function (next) {
  // when I remove the product, I want to access the Review model
  await this.model('Review').deleteMany({
    // delete the reviews that match with the id of the product
    product: this._id,
  });
});

module.exports = mongoose.model('Product', ProductSchema);
