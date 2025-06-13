document.addEventListener('DOMContentLoaded', () => {
  // Kategoriyalarni yuklash
fetch('/api/categories')
  .then(res => {
    if (!res.ok) throw new Error(`Server javobi xato: ${res.status}`);
    return res.json();
  })
  .then(data => {
    // 1) ‘data’ massivmi? Aks holda data.categories yoki data.data ni oling
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data.categories)
        ? data.categories
        : Array.isArray(data.data)
          ? data.data
          : [];

    const tbody = document.getElementById('category-bar');
    tbody.innerHTML = ''; // avval tozalaymiz

    // 2) Endi doim massiv bo‘lib qoladi
    list.forEach(cat => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="category-image">
            <img 
              src="${cat.image || 'https://via.placeholder.com/60'}" 
              alt="${cat.name}" 
              class="avatar" 
              style="width:40px; height:40px; object-fit:cover; border-radius:4px;"
            >
          </div>
        </td>
        <td>
          <div class="category-name">${cat.name}</div>
        </td>
        <td>
          <div class="action-buttons">
            <button 
              class="btn btn-delete" 
              onclick="confirmDeleteCategory('${cat._id}')"
            >
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Xatolik:', err));

});

document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    closeBtn.closest(".modal-overlay").style.display = "none";
  });
});

// Yangi kategoriya qo‘shish modalini ochish
function createCategory() {
  document.getElementById('addCategoryForm').reset();
  document.getElementById('addCategoryMessage').textContent = '';
  document.getElementById('categoryModal').style.display = 'flex';
}

// Form submit: har doim POST /api/categories/create
document.getElementById('addCategoryForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = document.getElementById('addCategoryMessage');
  msg.textContent = '';

  const formData = new FormData(this);
  fetch('/api/categories/create', {
    method: 'POST',
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP xato: ${res.status}`);
      return res.json();
    })
    .then(() => {
      alert('Kategoriya qo‘shildi!');
      document.getElementById('categoryModal').style.display = 'none';
      location.reload();
    })
    .catch(err => {
      console.error(err);
      msg.textContent = 'Saqlashda muammo yuz berdi.';
    });
});



 function confirmDeleteCategory(categoryId) {
    if (confirm('Ushbu kategoriyani o‘chirib tashlamoqchimisiz?')) {
      fetch(`/api/categories/delete/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`O‘chirishda xato: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        // Jadvalni yangilash uchun sahifani qayta yuklash (yoki yana fetch chaqirish mumkin)
        // location.reload();
      })
      .catch(err => {
        console.error('Delete xatolik:', err);
        alert('Kategoriya o‘chirishda xatolik yuz berdi.');
      });
    }
  }

