const Cart = require('../models/Cart');

class CartManager {
  async getAll() {
    return await Cart.find().populate('products.product');
  }

  async getById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async create(cartData) {
    return await Cart.create(cartData);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrinho não encontrado');

    const existingProduct = cart.products.find(
      (item) => String(item.product) === String(productId)
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrinho não encontrado');

    cart.products = cart.products.filter(
      (item) => String(item.product) !== String(productId)
    );
    await cart.save();
    return cart;
  }

  async delete(cartId) {
    return await Cart.findByIdAndDelete(cartId);
  }
}

module.exports = new CartManager();