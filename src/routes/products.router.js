import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET - Listar todos produtos 
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const numPage = Number(page);
    const numLimit = Number(limit);

    const products = await Product.find()
      .skip((numPage - 1) * numLimit)
      .limit(numLimit);
    const count = await Product.countDocuments();
    res.json({
      status: 'success',
      payload: products,
      total: count,
      page: numPage,
      pages: Math.ceil(count / numLimit)
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Erro ao obter produtos.' });
  }
});

// GET - Produto por ID
router.get('/:pid', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.pid);
    if (!prod)
      return res.status(404).json({ status: 'error', message: 'Produto não encontrado.' });
    res.json({ status: 'success', payload: prod });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Erro ao buscar produto.' });
  }
});

// POST - Criar produto
router.post('/', async (req, res) => {
  try {
    const { nome, preco } = req.body;
    if (!nome || !preco) {
      return res.status(400).json({ status: 'error', message: 'Nome e preço obrigatórios.' });
    }
    const novoProduto = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: novoProduto });
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Erro ao criar produto.' });
  }
});

// PUT - Atualizar produto por ID
router.put('/:pid', async (req, res) => {
  try {
    const { nome, preco } = req.body;
    if (!nome && !preco) {
      return res.status(400).json({
        status: 'error',
        message: 'Envie ao menos um campo (nome ou preço) para atualizar.'
      });
    }
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updated)
      return res.status(404).json({ status: 'error', message: 'Produto não encontrado.' });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'Erro ao atualizar produto.' });
  }
});

// DELETE - Apagar produto por ID
router.delete('/:pid', async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.pid);
    if (!removed)
      return res.status(404).json({ status: 'error', message: 'Produto não encontrado.' });
    res.json({ status: 'success', payload: removed });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Erro ao remover produto.' });
  }
});

export default router;