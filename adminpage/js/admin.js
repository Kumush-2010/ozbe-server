
// const selectAll = document.getElementById('selectAll');
// const checkbox = document.querySelectorAll('.checkbox');

// selectAll.addEventListener('change', function () {
//   checkbox.forEach(checkbox => {
//     checkbox.checked = selectAll.checked;
//   });
// });

//   // "Select All" checkboxni boshqarish
//   const selectAllCheckbox = document.getElementById('selectAll');
//   const individualCheckboxes = document.querySelectorAll('.checkbox');

//   selectAllCheckbox.addEventListener('change', function() {
//       individualCheckboxes.forEach(checkbox => {
//           checkbox.checked = selectAllCheckbox.checked;
//       });
//   });

//   // Har bir delete tugmasi uchun tasdiqlash va o'chirish
//   function confirmDelete(button) {
//       const confirmation = confirm("Are you sure you want to delete this item?");
      
//       if (confirmation) {
//           const row = button.closest('tr'); // Eng yaqin tr elementini topib o'chiradi
//           row.remove();
//       }
//   }


const modal = document.getElementById("adminModal"); 
    const openModalBtn = document.getElementById("openModalBtn"); 
    openModalBtn.onclick = () => modal.style.display = "block"; 
    window.onclick = (e) => { if (e.target === modal)
    modal.style.display = "none"; }; // Admin yaratish AJAX orqali

document.querySelectorAll(".close").forEach(closeBtn => {
  closeBtn.addEventListener("click", () => {
    closeBtn.closest(".modal-overlay").style.display = "none";
  });
});

    // search
  document.getElementById('searchInput')?.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const rows = document.querySelectorAll('#adminTableBody tr');

  rows.forEach(row => {
    const name = row.querySelector('.author-name')?.textContent.toLowerCase() || '';
    const email = row.querySelector('.author-email')?.textContent.toLowerCase() || '';

    const match = name.includes(query) || email.includes(query);
    row.style.display = match ? '' : 'none';
  });
});


fetch('/api/admin/')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = ''; // avval tozalaymiz

    data.admins.forEach(admin => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="author-info">
            <img src="${admin.image || 'https://via.placeholder.com/40'}" alt="Avatar" class="avatar">
          </div>
        </td>
        <td>
          <div class="author-name">${admin.adminname}</div>
        </td>
        <td>
          <div class="author-email">${admin.email}</div>
        </td>
        <td>${admin.phone || 'Noma’lum'}</td>
        <td><span class="status status-online">${admin.role}</span></td>
        <td>${admin.lastLogin || 'Noma’lum'}</td>
        <td>
          <div class="action-buttons">
            <!-- MUHIM: shu yerda ID emas, this uzatilyapti -->
            <button class="btn btn-edit" data-id="${admin._id}" onclick="editUser(this)">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-delete" onclick="confirmDelete('${admin._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Xatolik:', err));

 document.getElementById("adminForm")?.addEventListener("submit", function (e) {
    e.preventDefault(); // Formani avtomatik yuborilishini to‘xtatadi

    const form = e.target;
    const formData = new FormData(form); // FormData - fayllarni yuborishda ishlatiladi

    fetch("http://localhost:3000/api/admin/create", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        alert("✅ Admin muvaffaqiyatli yaratildi!");
        form.reset(); // Formani tozalash
        document.getElementById("adminModal").style.display = "none"; // Modalni yopish
        // location.reload(); // Sahifani yangilash
      })
      .catch((err) => {
        console.error("Xatolik:", err);
        document.getElementById("message").textContent =
          "Admin yaratishda xatolik yuz berdi!";
      });
  });


function editUser(button) {
  // 1) Tugma ustidagi <tr> elementni topamiz
  const row = button.closest('tr');
  if (!row) {
    console.error("Qator (tr) topilmadi");
    return;
  }

  // 2) Jadvaldan ma'lumotlarni olamiz
  const nameEl  = row.querySelector('.author-name');
  const emailEl = row.querySelector('.author-email');
  const phone   = row.children[3]?.textContent.trim() || '';
  const roleEl  = row.querySelector('.status');
  // const login   = row.children[5]?.textContent.trim() || '';
  const id      = button.dataset.id; // data-id’dan

  // 3) Modalni ochamiz
  const overlay = document.getElementById('modalOverlay');
  overlay.style.display = 'flex';

  // 4) Inputlarni to‘ldiramiz
  document.getElementById('inputName').value  = nameEl?.textContent.trim() || '';
  document.getElementById('inputEmail').value = emailEl?.textContent.trim() || '';
  document.getElementById('inputPhone').value = phone;
  document.getElementById('inputRole').value  = roleEl?.textContent.trim() || '';
  // document?.getElementById('inputLogin')?.value = login;
  // 5) Save tugmasiga id o‘rnatamiz
  document.getElementById('saveBtn').dataset.id = id;
}


document.getElementById('saveBtn')?.addEventListener('click', async function (e) {
  e.preventDefault();

  const id = this.dataset.id; // Edit qilinayotgan adminning ID si
  if (!id) {
    alert("Admin ID topilmadi");
    return;
  }

  // 1) FormData yarataylik
  const formElement = document.getElementById('editAdminForm');
  const formData = new FormData(formElement);

  // — agar password bo‘sh bo‘lsa, qo‘shmaslik uchun:
  const passwordValue = document.getElementById('inputPassword').value;
  if (!passwordValue.trim()) {
    formData.delete('password');
  }

  try {
    const res = await fetch(`/api/admin/edit/${id}`, {
      method: 'PUT',
      body: formData
      // **Hech qanday Content-Type yozmang**. Agar yozsangiz, `multipart/form-data` bo‘lmaydi.
    });

    if (!res.ok) {
      throw new Error(`HTTP xatolik: ${res.status}`);
    }
    const data = await res.json();
    alert("Admin ma'lumotlari muvaffaqiyatli yangilandi!");
    // Modalni yopish va sahifani yangilash
    document.getElementById('modalOverlay').style.display = 'none';
    location.reload();
  } catch (err) {
    console.error("Xatolik:", err);
    alert("Yangilashda muammo yuz berdi");
  }
});



// delete
function confirmDelete(id) {
  if (confirm("Haqiqatan ham ushbu adminni o‘chirmoqchimisiz?")) {
    fetch(`/api/admin/delete/${id}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP xatolik: ${res.status}`);
      return res.json();
    })
    .then(data => {
      alert("Admin muvaffaqiyatli o‘chirildi!");
      location.reload(); // Jadvalni yangilash
    })
    .catch(err => {
      console.error("Xatolik:", err);
      alert("O‘chirishda xatolik yuz berdi");
    });
  }
}