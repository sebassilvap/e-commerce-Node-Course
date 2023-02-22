const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },

    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: 100,
    },

    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);
// with this, we make sure that the user can ONLY leave 1 review per product!
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

//! static -> because I create this on the Schema not on the instance
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  //console.log(productId);

  const result = await this.aggregate([
    // 1) first stage - matching
    { $match: { product: productId } },

    // 2) second stage - grouping
    {
      $group: {
        //_id: '$product' //? when we have complex data and we want to group it by rating, for example
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result); // EX: [ { _id: null, averageRating: 4, numOfReviews: 2 } ]

  // => Update the product with this new INFO
  // in case I don't have anything put 0 -> use optional chaining '?'
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.averageRating || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post('save', async function () {
  //! call the static method that Schema has
  await this.constructor.calculateAverageRating(this.product);
  //console.log('post save hook called');
});

ReviewSchema.post('remove', async function () {
  //! call the static method that Schema has
  await this.constructor.calculateAverageRating(this.product);
  //console.log('post remove hook called');
});

module.exports = mongoose.model('Review', ReviewSchema);
