const Order = require('../models/order');
const Cart = require('../models/cart');
const generateOrderCode = require('../utils/generateOrderCode');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { products, total } = req.body;

    const newOrder = new Order({
      user: req.user._id,
      products,
      total,
      status: 'pending',
      orderCode: generateOrderCode()
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Buyurtma muvaffaqiyatli yaratildi!',
      order: newOrder
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Serverda xatolik!',
      error: err.message
    });
  }
};


// 📋 Foydalanuvchi buyurtmalari
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
};

// 🔍 Bitta buyurtmani ko‘rish
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) return res.status(404).json({ message: 'Buyurtma topilmadi' });

  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Ruxsat yo‘q' });
  }

  res.json(order);
};

// 🛠 Admin: barcha buyurtmalar
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product');
  res.json(orders);
};

// 🛠 Admin: buyurtma holatini yangilash
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: 'Buyurtma topilmadi' });

  order.status = status;
  await order.save();

  res.json({ message: 'Buyurtma holati yangilandi', order });
};

// ✅ Foydalanuvchi: to‘lov qilish (fake)
exports.payForOrder = async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });
  if (order.user.toString() !== userId.toString()) return res.status(403).json({ message: "Ruxsat yo'q" });

  if (order.paymentStatus === 'paid') {
    return res.status(400).json({ message: "Bu buyurtma allaqachon to'langan" });
  }

  // Fake to'lov logikasi (muvaffaqiyatli deb olaylik)
  order.paymentStatus = 'paid';
  order.status = 'paid';
  await order.save();

  res.json({ message: "To‘lov muvaffaqiyatli bajarildi", order });
};

// 🛠 Admin: to‘lov holatini yangilash
exports.updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: 'Buyurtma topilmadi' });

  order.paymentStatus = paymentStatus;
  await order.save();

  res.json({ message: 'To‘lov holati yangilandi', order });
};
