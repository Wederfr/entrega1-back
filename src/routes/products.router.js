import { Router } from 'express';

const router = Router();

export default (productManager) => {
  router.get('/', (req, res) => {
    res.json(productManager.getProducts());
  });

  router.post('/', (req, res) => {
    const product = req.body;
    productManager.addProduct(product);
    res.status(201).json({ message: 'Produto adicionado com sucesso' });
  });

  router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    productManager.deleteProduct(id);
    res.json({ message: 'Produto removido com sucesso' });
  });

  return router;
};