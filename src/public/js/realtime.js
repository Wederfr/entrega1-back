const socket = io();

const productList = document.getElementById('productList');

socket.on('productList', products => {
  productList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerText = `ID: ${p.id} | ${p.title} - R$ ${p.price}`;
    productList.appendChild(li);
  });
});

// Adicionar produto
document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    thumbnail: document.getElementById('thumbnail').value,
    code: document.getElementById('code').value,
    stock: parseInt(document.getElementById('stock').value)
  };
  socket.emit('addProduct', product);
  e.target.reset();
});

// Deletar produto
document.getElementById('deleteForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = parseInt(document.getElementById('deleteId').value);
  socket.emit('deleteProduct', id);
  e.target.reset();
});
