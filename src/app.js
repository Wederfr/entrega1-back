import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import ProductManager from './dao/productManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Config Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/', viewsRouter(productManager));
app.use('/api/products', productsRouter(productManager));

// Servidor HTTP + WebSocket
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', socket => {
  console.log('Novo cliente conectado');

  // Enviar lista inicial de produtos
  socket.emit('productList', productManager.getProducts());

  // Adicionar produto
  socket.on('addProduct', product => {
    productManager.addProduct(product);
    io.emit('productList', productManager.getProducts());
  });

  // Remover produto
  socket.on('deleteProduct', id => {
    productManager.deleteProduct(id);
    io.emit('productList', productManager.getProducts());
  });
});

export { io };
