const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

const cm = new CartManager();

// POST 
router.post('/', async (req, res) => {
  const newCart = await cm.createCart();
  res.status(201).json(newCart);
});

// GET 
router.get('/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });
  res.json(cart.products);
});

// POST 
router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cm.addProductToCart(req.params.cid, req.params.pid);
  if (!updatedCart) return res.status(404).json({ error: 'Carrinho não encontrado' });
  res.json(updatedCart);
});

module.exports = router;
