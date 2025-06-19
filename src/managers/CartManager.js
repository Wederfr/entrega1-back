import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CARTS_FILE = path.join(__dirname, '../../data/carts.json');

class CartManager {
  async _readFile() {
    try {
      const data = await fs.readFile(CARTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(CARTS_FILE, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: Date.now().toString(),
      products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find(c => c.id === cid);
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex === -1) return null;

    const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);

    if (productIndex !== -1) {
      carts[cartIndex].products[productIndex].quantity += 1;
    } else {
      carts[cartIndex].products.push({ product: pid, quantity: 1 });
    }

    await this._writeFile(carts);
    return carts[cartIndex];
  }
}

export default CartManager;