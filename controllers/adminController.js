const Product = require('../models/product');
const Order = require('../models/order');
const Admin = require('../models/admin');

exports.allAdmins = async (req, res) => {
   try {
            let admins;

            res.status(400).send({
              message: "Adminlar topilmadi!"
            })
    
            if (req.user.role === "superadmin") {
                admins = await Admin.find();
            } else {
                admins = await Admin.find({ _id: req.user.id });
            }
    
            return res.status(200).json({ message: "Adminlar", admins });
        } catch (error) {
            console.error("Adminlarni olishda xatolik:", error);
            return res.status(500).json({ error: "Server xatosi yuz berdi." });
        }
}


exports.adminCreate = async (req, res) => {

}


exports.adminEdit = async (req, res) => {

}


exports.adminDelete = async (req, res) => {

}


exports.getAdminStats = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const adminCount = await Admin.countDocuments();
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
      adminCount,
      orderCount,
      totalRevenue,
      recentOrders
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
