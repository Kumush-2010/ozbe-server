
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


// admins
  fetch('/api/admin')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = '';

    data.admins.map(admin => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
       <tr>
              <div class="item">
                <td>
                  <div class="author-info">
                    <div class="avatar">${admin.adminname?.slice(0, 2).toUpperCase()}</div>
                  </div>
                </td>
                <td>                    
                    <div>
                      <div class="author-name">${admin.adminname}</div>
                    </div>
                </td>
                <td><div class="author-email">${admin.email}</div></td>
                <td>${admin.phone || 'Noma’lum'}</td>
                <td><span class="status status-online">${admin.role}</span></td>
                <td>${admin.lastLogin || 'Noma’lum'}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-edit" onclick="editUser('${admin._id}')">
                      <i class="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      class="btn btn-delete"
                      onclick="confirmDelete('${admin._id}')"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </div>
            </tr>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Xatolik:', err));


    // admin edit
  function editUser(button) {
    console.log("Tugma: ", button);
  const row = button.closest('td');
  const email = row.querySelector('.author-email')?.textContent.trim();

  fetch(`/api/admins/email/${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(admin => {
      // Modalni ochish
     document.getElementById('modalOverlay').style.display = 'flex';


      // Formani to‘ldirish
      document.getElementById('inputName').value = admin.name || '';
      document.getElementById('inputEmail').value = admin.email || '';
      document.getElementById('inputPhone').value = admin.phone || '';
      document.getElementById('inputRole').value = admin.role || '';
      document.getElementById('inputLogin').value = admin.lastLogin || '';

      // ID ni saqlash (keyin PUT uchun kerak)
      document.getElementById('saveBtn').dataset.id = admin._id;
    })
    .catch(err => {
      console.error('Xatolik:', err);
      alert("Admin ma'lumotlarini olishda xatolik yuz berdi");
    });
}
document.getElementById('saveBtn')?.addEventListener('click', function () {
  const id = this.dataset.id;

  const updatedAdmin = {
    name: document.getElementById('inputName').value,
    email: document.getElementById('inputEmail').value,
    phone: document.getElementById('inputPhone').value,
    role: document.getElementById('inputRole').value,
    lastLogin: document.getElementById('inputLogin').value
  };

  // saveBtn
  fetch(`/api/admins/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAdmin)
  })
    .then(res => res.json())
    .then(data => {
      alert("Ma'lumot muvaffaqiyatli yangilandi!");
      document.getElementById('modalOverlay').style.display = 'none';
      location.reload(); // sahifani yangilash
    })
    .catch(err => {
      console.error('Yangilashda xatolik:', err);
      alert('Yangilashda muammo yuz berdi');
    });
});

