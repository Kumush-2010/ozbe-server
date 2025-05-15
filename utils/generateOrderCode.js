const generateOrderCode = () => {
  return 'ORD-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000000).toString(36).toUpperCase();
};

module.exports = generateOrderCode;

