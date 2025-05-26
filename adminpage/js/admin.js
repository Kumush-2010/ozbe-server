
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
    const closeBtn = document.querySelector(".close"); 
    openModalBtn.onclick = () => modal.style.display = "block"; 
    closeBtn.onclick = () => modal.style.display = "none"; 
    window.onclick = (e) => { if (e.target === modal)
    modal.style.display = "none"; }; // Admin yaratish AJAX orqali


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


fetch('/api/admin')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = ''; // avval tozalaymiz

    data.admins.forEach(admin => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="author-info">
            <div class="avatar">${admin.adminname?.slice(0, 2).toUpperCase()}</div>
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
  const login   = row.children[5]?.textContent.trim() || '';
  const id      = button.dataset.id; // data-id’dan

  // 3) Modalni ochamiz
  const overlay = document.getElementById('modalOverlay');
  overlay.style.display = 'flex';

  // 4) Inputlarni to‘ldiramiz
  document.getElementById('inputName').value  = nameEl?.textContent.trim() || '';
  document.getElementById('inputEmail').value = emailEl?.textContent.trim() || '';
  document.getElementById('inputPhone').value = phone;
  document.getElementById('inputRole').value  = roleEl?.textContent.trim() || '';
  document.getElementById('inputLogin').value = login;

  // 5) Save tugmasiga id o‘rnatamiz
  document.getElementById('saveBtn').dataset.id = id;
}


document.getElementById('saveBtn')?.addEventListener('click', function (e) {
  e.preventDefault();
  const id = this.dataset.id;
  if (!id) {
    alert("ID topilmadi");
    return;
  }

  const updatedAdmin = {
    adminname: document.getElementById('inputName').value,
    email:     document.getElementById('inputEmail').value,
    phone:     document.getElementById('inputPhone').value,
    role:      document.getElementById('inputRole').value,
    lastLogin: document.getElementById('inputLogin').value,
  };

  fetch(`/api/admins/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAdmin)
  })
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(() => {
      alert("Ma'lumot muvaffaqiyatli yangilandi!");
      document.getElementById('modalOverlay').style.display = 'none';
      location.reload();
    })
    .catch(err => {
      console.error('Yangilash xatosi:', err);
      alert("Yangilashda muammo yuz berdi");
    });
});

