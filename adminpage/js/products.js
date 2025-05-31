fetch('/api/products')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    data.forEach(product => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${product.image || 'https://via.placeholder.com/50'}" width="50" /></td>
        <td>${product.name}</td>
        <td>${product.description || '—'}</td>
        <td>${product.price} so‘m</td>
        <td>${product.category || 'Noma’lum'}</td>
        <td>
          <button class="btn btn-edit" onclick="editProduct('${product._id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-delete" onclick="deleteProduct('${product._id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Xatolik:', err));

function openProductModal() {
  document.getElementById('createProductModal').style.display = 'flex';
}

function closeProductModal() {
  document.getElementById('createProductModal').style.display = 'none';
}


  document.getElementById('saveProductBtn').addEventListener('click', () => {
  const newProduct = {
    name: document.getElementById('productName').value,
    description: document.getElementById('productDescription').value,
    price: parseFloat(document.getElementById('productPrice').value),
    category: document.getElementById('productCategory').value,
    image: document.getElementById('productImage').value,
  };

  fetch('/api/products/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  })
    .then(res => res.json())
    .then(data => {
      alert('Mahsulot muvaffaqiyatli qo‘shildi!');
      closeProductModal();
      location.reload();
    })
    .catch(err => {
      console.error('Xatolik:', err);
      alert('Qo‘shishda xatolik yuz berdi.');
    });
});

function openEditProductModal(product) {
  document.getElementById('editProductModal').style.display = 'flex';

  // Ma'lumotlarni inputlarga joylash
  document.getElementById('editProductName').value = product.name;
  document.getElementById('editProductDescription').value = product.description;
  document.getElementById('editProductPrice').value = product.price;
  document.getElementById('editProductCategory').value = product.category;
  document.getElementById('editProductImage').value = product.image;

  // Yangilash tugmasiga mahsulot ID'sini biriktiramiz
  document.getElementById('updateProductBtn').dataset.id = product._id;
}

function closeEditProductModal() {
  document.getElementById('editProductModal').style.display = 'none';
}

document.getElementById('updateProductBtn').addEventListener('click', () => {
  const id = document.getElementById('updateProductBtn').dataset.id;

  const updatedProduct = {
    name: document.getElementById('editProductName').value,
    description: document.getElementById('editProductDescription').value,
    price: parseFloat(document.getElementById('editProductPrice').value),
    category: document.getElementById('editProductCategory').value,
    image: document.getElementById('editProductImage').value,
  };

  fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedProduct)
  })
    .then(res => res.json())
    .then(data => {
      alert('Mahsulot yangilandi!');
      closeEditProductModal();
      location.reload();
    })
    .catch(err => {
      console.error('Xatolik:', err);
      alert('Yangilashda xatolik yuz berdi.');
    });
});

function editProduct(button) {
  const row = button.closest('tr');
  const id = button.dataset.id;

  const product = {
    _id: id,
    name: row.querySelector('.product-name').textContent.trim(),
    description: row.querySelector('.product-description').textContent.trim(),
    price: parseFloat(row.querySelector('.product-price').textContent.trim()),
    category: row.querySelector('.product-category').textContent.trim(),
    image: row.querySelector('img')?.src || ''
  };

  openEditProductModal(product);
}
