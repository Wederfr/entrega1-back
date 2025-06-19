import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

// Página inicial 
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('home', { products, hasProducts: products.length > 0 });
  } catch (error) {
    res.status(500).send('Erro ao carregar a home');
  }
});

// Página de detalhes do produto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Produto não encontrado');
    res.render('productDetail', { product });
  } catch (error) {
    res.status(500).send('Erro ao carregar os detalhes do produto');
  }
});

// Página do carrinho
router.get('/cart/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate('products.product')
      .lean();
    if (!cart) return res.status(404).send('Carrinho não encontrado');
    res.render('cart', { cart, hasProducts: cart.products && cart.products.length > 0 });
  } catch (error) {
    res.status(500).send('Erro ao carregar o carrinho');
  }
});

export default router;