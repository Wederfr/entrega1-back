const Product = require('../models/Product');

class ProductManager {
  async getAll() {
    return await Product.find();
  }

  async getById(id) {
    return await Product.findById(id);
  }

  async add(productData) {
    return await Product.create(productData);
  }

  async update(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductManager();