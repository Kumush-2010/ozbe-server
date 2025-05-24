const Product = require('../models/product');
const Order = require('../models/order');
const Admin = require('../models/admin');
const bcrypt = require("bcrypt")

exports.allAdmins = async (req, res) => {
   try {
     const admins = await Admin.find()

     if(!admins){
      return res.status(400).send({
              message: "Adminlar topilmadi!"
            })
     } else {
       return res.status(200).json({ message: "Adminlar", admins });
     }
           
        } catch (error) {
            console.error("Adminlarni olishda xatolik:", error);
            return res.status(500).json({ error: "Server xatosi yuz berdi." });
        }
}


exports.adminCreate = async (req, res) => {
 try {
   console.log("💡 Admin yaratish ishladi", req.body);
    const { adminname, birth, jins, phone, email, image, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

 const newAdmin = new Admin({
     adminname,
      birth,
      jins,
      phone,
      email,
      role: role || "admin",
      password: hashedPassword,
      image: image || "",
      lastLogin: null
    });

    await newAdmin.save();

    return res
            .status(200)
            .json({ message: `${role} muvaffaqiyatli yaratildi` });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
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
