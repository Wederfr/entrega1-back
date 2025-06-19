import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import exphbs from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public'))); 


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.use('/', viewsRouter);


const MONGO_URL = 'mongodb://localhost:27017/lojaDB';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('🟢 MongoDB conectado!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('🔴 Erro ao conectar no MongoDB:', err);
  });