import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = Router();

// Exibir carrinho
router.get('/carrinho', async (req, res) => {
  const cartId = req.session.cartId;
  let cart = cartId
    ? await Cart.findById(cartId).populate('products.product')
    : null;
  if (!cart) cart = { products: [] };
  res.render('cart', { cart });
});

// Adicionar produto ao carrinho
router.post('/api/carts/add', async (req, res) => {
  const { productId, quantity } = req.body;
  const qnt = Number(quantity);
  if (!productId || !Number.isInteger(qnt) || qnt < 1) {
    return res.status(400).send('Dados inválidos');
  }

  // Confere se produto existe
  const exists = await Product.findById(productId);
  if (!exists) return res.status(400).send('Produto não encontrado');

  let cart = req.session.cartId ? await Cart.findById(req.session.cartId) : null;
  if (!cart) {
    cart = new Cart({ products: [] });
    await cart.save();
    req.session.cartId = cart._id;
  }

  const prodIndex = cart.products.findIndex(p => p.product.equals(productId));
  if (prodIndex > -1) {
    cart.products[prodIndex].quantity += qnt;
  } else {
    cart.products.push({ product: productId, quantity: qnt });
  }
  await cart.save();
  res.redirect('/carrinho');
});

// Remover item do carrinho
router.post('/api/carts/remove', async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findById(req.session.cartId);
  if (cart) {
    cart.products = cart.products.filter(p => !p.product.equals(productId));
    await cart.save();
  }
  res.redirect('/carrinho');
});



export default router;