const mongoose = require('mongoose');

// with this we add a nice validation, so if some of this is missing, the user won't be able to proceed with the order !!
const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      required: true,
    },

    // subtotal = total for all items where we multiply the price * quantity
    subtotal: {
      type: Number,
      required: true,
    },

    // total = subtotal + tax + shipping fee
    total: {
      type: Number,
      required: true,
    },

    orderItems: [SingleOrderItemSchema],

    status: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
      default: 'pending',
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    clientSecret: {
      type: String,
      required: true,
    },

    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
