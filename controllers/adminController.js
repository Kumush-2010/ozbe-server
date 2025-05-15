const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

exports.getAdminStats = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();

    const orders = await Order.find({ status: 'paid' });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // 🔢 So‘nggi 7 kunlik buyurtmalar (kunlar bo‘yicha guruhlash)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6); // bugun + oldingi 6 kun

    const recentOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      productCount,
      userCount,
      orderCount,
      totalRevenue,
      recentOrders
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
