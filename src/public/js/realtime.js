const socket = io();

// Atualiza lista em tempo real
socket.on('products', products => {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';
  products.forEach(prod => {
    const li = document.createElement('li');
    li.textContent = `ID: ${prod._id || prod.id} | ${prod.title} - R$ ${prod.price}`;
    productList.appendChild(li);
  });
});

// Adicionar produto
const addForm = document.getElementById('addForm');
addForm.addEventListener('submit', e => {
  e.preventDefault();
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    thumbnail: document.getElementById('thumbnail').value,
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
  };
  socket.emit('addProduct', product);
  addForm.reset();
});

// Deletar produto
const deleteForm = document.getElementById('deleteForm');
deleteForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('deleteId').value;
  socket.emit('deleteProduct', id);
  deleteForm.reset();
});