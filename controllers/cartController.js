const Cart = require('../models/cart');
const Product = require('../models/product');

// ➕ Mahsulot qo‘shish yoki miqdorini oshirish
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }

  await cart.save();
  res.status(200).json(cart);
};

// 📋 Savatni ko‘rish
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
};

// ✏️ Miqdorni yangilash
exports.updateItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: 'Savat topilmadi' });

  const item = cart.items.find(item => item.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
    return res.json(cart);
  }

  res.status(404).json({ message: 'Mahsulot savatda topilmadi' });
};

// ❌ Mahsulotni o‘chirish
exports.removeItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: 'Savat topilmadi' });

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};

// 🧹 Savatni tozalash
exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Savat topilmadi' });

  cart.items = [];
  await cart.save();
  res.json({ message: 'Savat tozalandi' });
};
