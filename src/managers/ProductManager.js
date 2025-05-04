const fs = require('fs').promises;
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');

class ProductManager {
  async _readFile() {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  }

  async getAll() {
    return await this._readFile();
  }

  async getById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === id);
  }

  async add(product) {
    const products = await this._readFile();
    const newProduct = {
      id: Date.now().toString(), 
      ...product
    };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async update(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates, id };
    await this._writeFile(products);
    return products[index];
  }

  async delete(id) {
    const products = await this._readFile();
    const filtered = products.filter(p => p.id !== id);
    await this._writeFile(filtered);
  }
}

module.exports = ProductManager;
