document.querySelectorAll(".close").forEach(closeBtn => {
  closeBtn.addEventListener("click", () => {
    closeBtn.closest(".modal-overlay").style.display = "none";
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const createForm = document.getElementById('productForm');
  const editForm = document.getElementById('productEdit');
  const tbody = document.getElementById('productsTableBody');
  const submitEditBtn = document.getElementById('submitEditBtn');

  const selectedImagesCreate = []; // create uchun tanlangan rasmlar

  document.getElementById('searchInput')?.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('#productsTableBody tr').forEach(row => {
      const name = row.querySelector('.product-name')?.textContent.toLowerCase() || '';
      row.style.display = name.includes(query) ? '' : 'none';
    });
  });

  // --- Load Categories
  function loadCategories() {
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => {
        const createSelect = document.getElementById('categorySelectCreate');
        const editSelect = document.getElementById('categorySelectEdit');
        createSelect.innerHTML = '<option value="">— Kategoriya tanlang —</option>';
        editSelect.innerHTML = '<option value="">— Kategoriya tanlang —</option>';
        data.forEach(cat => {
          const opt1 = document.createElement('option');
          opt1.value = cat._id; opt1.textContent = cat.name;
          createSelect.appendChild(opt1);
          editSelect.appendChild(opt1.cloneNode(true));
        });
      })
      .catch(err => { console.error(err); alert('Kategoriyalarni yuklashda xato'); });
  }

  // --- Load Products
  function loadProducts() {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        tbody.innerHTML = '';
        data.forEach(product => {
          const tr = document.createElement('tr');
          const tdImg = document.createElement('td');
          const imgs = product.images || [];
          const thumb = document.createElement('img');
          thumb.src = imgs[0] || 'https://via.placeholder.com/50';
          thumb.alt = product.name;
          thumb.width = 50;
          thumb.style.cursor = 'pointer';
          thumb.dataset.images = JSON.stringify(imgs);
          thumb.dataset.index = 0;
          tdImg.appendChild(thumb);
          tr.appendChild(tdImg);

          tr.innerHTML += `
            <td class="product-name">${product.name}</td>
            <td class="product-stock">${product.countInStock || 0}</td>
            <td class="product-price">${product.price}</td>
            <td class="product-category" data-id="${product.category?._id || ''}">
              ${product.category?.name || 'Noma’lum'}
            </td>
            <td>
              <button class="btn btn-edit" onclick="editProduct(this)" data-id="${product._id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-delete" onclick="deleteProduct('${product._id}')">
                <i class="fas fa-trash"></i>
              </button>
            </td>`;
          tbody.appendChild(tr);
        });

        document.querySelectorAll('#productsTableBody img').forEach(thumb => {
          thumb.addEventListener('click', () => {
            const imgs = JSON.parse(thumb.dataset.images);
            const start = parseInt(thumb.dataset.index, 10);
            const galleryDiv = document.createElement('div');
            galleryDiv.style.display = 'none';
            imgs.forEach(src => {
              const img = document.createElement('img');
              img.src = src;
              galleryDiv.appendChild(img);
            });
            document.body.appendChild(galleryDiv);
            const viewer = new Viewer(galleryDiv, {
              toolbar: true,
              navbar: false,
              viewed() { viewer.view(start); },
              hidden() { viewer.destroy(); galleryDiv.remove(); }
            });
            viewer.show();
          });
        });
      })
      .catch(err => console.error('Mahsulotlarni olishda xato:', err));
  }

  // ✅ Bittadan rasm tanlab preview qilish
  document.getElementById('imageInputCreate').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    selectedImagesCreate.push(file);
    previewImage(file, 'previewContainerCreate');
    e.target.value = '';
  });

  function previewImage(file, containerId) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.width = '80px';
      img.style.height = '80px';
      img.style.objectFit = 'cover';
      img.style.border = '1px solid #ccc';
      img.style.borderRadius = '6px';
      img.title = file.name;
      document.getElementById(containerId).appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  // --- CREATE FORM SUBMIT ---
  createForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('nameCreate').value.trim());
    formData.append('description', document.getElementById('descriptionCreate').value.trim());
    formData.append('countInStock', document.getElementById('countInStockCreate').value);
    formData.append('price', document.getElementById('priceCreate').value);
    formData.append('category_id', document.getElementById('categorySelectCreate').value);

    selectedImagesCreate.forEach(imgFile => {
      formData.append('images', imgFile);
    });

    try {
      const res = await fetch('http://localhost:3000/api/products/create', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(await res.text());

      alert('✅ Mahsulot muvaffaqiyatli qo‘shildi!');
      createForm.reset();
      selectedImagesCreate.length = 0;
      document.getElementById('previewContainerCreate').innerHTML = '';
      document.getElementById('categorySelectCreate').value = '';
      closeProductModal();
      loadProducts();
    } catch (err) {
      console.error('Mahsulot qo‘shishda xatolik:', err);
      alert('❌ Qo‘shishda xatolik yuz berdi.');
    }
  });

  // --- EDIT FORM SUBMIT ---
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.currentTarget.dataset.id;
    submitEditBtn.dataset.id = id;

    if (!id) {
      alert('❌ Mahsulot ID topilmadi.');
      return;
    }

    const formData = new FormData();
    formData.append('name', document.getElementById('nameEdit').value.trim());
    formData.append('description', document.getElementById('descriptionEdit').value.trim());
    formData.append('countInStock', document.getElementById('countInStockEdit').value);
    formData.append('price', document.getElementById('priceEdit').value);
    formData.append('category', document.getElementById('categorySelectEdit').value);

    const imageInput = document.getElementById('imageInputCreate');
    if (imageInput.files.length > 0) {
      formData.append('images', imageInput.files[0]);
    }

    try {
      const res = await fetch(`http://localhost:3000/api/products/edit/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!res.ok) throw new Error(await res.text());

      alert('✅ Mahsulot yangilandi!');
      editForm.reset();
      closeEditProductModal();
      loadProducts();
    } catch (error) {
      console.error('Yangilashda xato:', error);
      alert('❌ Yangilashda xatolik yuz berdi.');
    }
  });

  window.editProduct = function (button) {
    const row = button.closest('tr');
    const product = {
      _id: button.dataset.id,
      name: row.querySelector('.product-name').textContent.trim(),
      price: parseFloat(row.querySelector('.product-price').textContent.trim()),
      countInStock: parseInt(row.querySelector('.product-stock').textContent.trim()),
      category: row.querySelector('.product-category')?.dataset.id || '',
      image: row.querySelector('img')?.src || '',
      description: ''
    };

    openEditProductModal(product);
  };

  window.openProductModal = () => document.getElementById('createProductModal').style.display = 'flex';
  window.closeProductModal = () => document.getElementById('createProductModal').style.display = 'none';

  window.openEditProductModal = (product) => {
    document.getElementById('editProductModal').style.display = 'flex';
    document.getElementById('nameEdit').value = product.name;
    document.getElementById('descriptionEdit').value = product.description = '';
    document.getElementById('countInStockEdit').value = product.countInStock;
    document.getElementById('priceEdit').value = product.price;
    document.getElementById('categorySelectEdit').value = product.category;
    submitEditBtn.dataset.id = product._id;
    editForm.dataset.id = product._id;
  };

  window.closeEditProductModal = () => document.getElementById('editProductModal').style.display = 'none';

  window.deleteProduct = async function (id) {
    if (!confirm("🗑 Ushbu mahsulotni o‘chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/products/delete/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(await res.text());
      alert("🗑 Mahsulot o‘chirildi!");
      loadProducts();
    } catch (err) {
      console.error("O‘chirishda xato:", err);
      alert("❌ Mahsulotni o‘chirishda xatolik yuz berdi.");
    }
  };

  loadCategories();
  loadProducts();
});
