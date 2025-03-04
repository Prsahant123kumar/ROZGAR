const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Workers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workers',
    required: true
  },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true }
  },
  cartItems: [
    {
      menuId: { type: String, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered'],
    required: true
  }
}, { timestamps: true });

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = {Order};
