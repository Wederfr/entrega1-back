const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const pm = new ProductManager();

// GET 
router.get('/', async (req, res) => {
  const products = await pm.getAll();
  res.json(products);
});

// GET 
router.get('/:pid', async (req, res) => {
  const product = await pm.getById(req.params.pid);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// POST 
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || price == null || stock == null || !category) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const newProduct = await pm.add({ title, description, code, price, status, stock, category, thumbnails });
  res.status(201).json(newProduct);
});

// PUT 
router.put('/:pid', async (req, res) => {
  const updated = await pm.update(req.params.pid, req.body);
  if (!updated) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(updated);
});

// DELETE 
router.delete('/:pid', async (req, res) => {
  await pm.delete(req.params.pid);
  res.json({ message: 'Produto deletado com sucesso' });
});

module.exports = router;
