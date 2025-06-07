

 document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/categories')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server javobi xato: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        const tbody = document.getElementById('category-bar');
        tbody.innerHTML = ''; // Oldingi satrlarni tozalaymiz

        const categories = data;
        if (!Array.isArray(categories)) {
          tbody.innerHTML = '<tr><td colspan="2" style="color: red;">Kategoriyalarni olishda format xatolik.</td></tr>';
          return;
        }

        categories.forEach(category => {
          const tr = document.createElement('tr');

          const tdName = document.createElement('td');
          tdName.textContent = category.name;

          const tdAction = document.createElement('td');
          tdAction.innerHTML = `
            <div class="action-buttons">
              <button class="btn btn-delete" onclick="confirmDeleteCategory('${category._id}')">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          `;

          tr.appendChild(tdName);
          tr.appendChild(tdAction);
          tbody.appendChild(tr);
        });
      })
    //   .catch(err => {
    //     console.error('Xatolik:', err);
    //     const tbody = document.getElementById('category-bar');
    //     tbody.innerHTML = '<tr><td colspan="2" style="color: red;">Kategoriyalarni yuklashda xatolik yuz berdi.</td></tr>';
    //   });
  });


function createCategory() {
  const overlay = document.getElementById('categoryModal');
  const input = document.getElementById('categoryName');

  overlay.style.display = 'flex';

  input.value = '';
  
  delete document.getElementById('saveBtn').dataset.id;
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

document.querySelectorAll(".close").forEach(closeBtn => {
  closeBtn.addEventListener("click", () => {
    closeBtn.closest(".modal-overlay").style.display = "none";
  });
})


function editCategory(id) {
  document.getElementById('categoryEdit').style.display = 'block';
   const saveBtn = document.getElementById('saveBtn');
  saveBtn.dataset.id = id;
}


document.getElementById('saveBtn')?.addEventListener('click', function (e) {
  e.preventDefault();

  const id = e.currentTarget.dataset.id; 
  console.log("Yuborilayotgan ID:", id); 

  const updatedCategory = {
    name: document.getElementById('categoryName').value,
  };


  fetch(`/api/categories/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCategory)
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP xatolik: ${res.status}`);
      return res.json();
    })
    .then(data => {
      alert("Kategoriya ma'lumotlari muvaffaqiyatli yangilandi!");
      document.getElementById('categoryEdit').style.display = 'none';
      location.reload();
    })
    .catch(err => {
      console.error("Xatolik:", err);
      alert("Yangilashda muammo yuz berdi");
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

