import { Router } from 'express';

const router = Router();

export default (productManager) => {
  router.get('/', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
  });

  router.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
  });

  return router;
};
