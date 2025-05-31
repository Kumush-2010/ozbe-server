// function editUser(button) {
//   const row = button.closest('tr');
//   const id = button.dataset.id;

//   const name = row.querySelector('.author-name')?.textContent.trim();
//   const email = row.querySelector('.author-email')?.textContent.trim();
//   const phone = row.children[3]?.textContent.trim();
//   const role = row.querySelector('.status')?.textContent.trim();

//   // Modalni ochamiz va inputlarga qiymatlarni o‘rnatamiz
//   document.getElementById('editModal').style.display = 'flex';
//   document.getElementById('editName').value = name;
//   document.getElementById('editEmail').value = email;
//   document.getElementById('editPhone').value = phone;
//   document.getElementById('editRole').value = role;
//   document.getElementById('editSaveBtn').dataset.id = id;
// }

// document.getElementById('editSaveBtn')?.addEventListener('click', () => {
//   const id = document.getElementById('editSaveBtn').dataset.id;

//   const updatedUser = {
//     username: document.getElementById('editName').value,
//     email: document.getElementById('editEmail').value,
//     phone: document.getElementById('editPhone').value,
//     role: document.getElementById('editRole').value,
//   };

//   fetch(`/api/users/edit/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(updatedUser)
//   })
//     .then(res => res.json())
//     .then(data => {
//       alert('Foydalanuvchi yangilandi!');
//       location.reload();
//     })
//     .catch(err => {
//       console.error('Xatolik:', err);
//       alert('Yangilashda xatolik');
//     });
// });
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


fetch('/api/users/')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    data.users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="author-info">
            <img src="${user.image || 'https://via.placeholder.com/40'}" alt="Avatar" class="avatar">
          </div>
        </td>
        <td>          
          <div class="author-info">
            <div><div class="author-name">${user.name}</div></div>
          </div>
        </td>
        <td><div class="author-email">${user.email}</div></td>
        <td>${user.phone || 'Noma’lum'}</td>
        <td><span class="status status-online">${user.role || '-'}</span></td>
        <td>${user.orderCount || 0} ta</td>
        <td>${user.createdAt?.slice(0, 10) || 'Noma’lum'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-delete" data-id="${user._id}" onclick="confirmDelete(this)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  .catch(err => console.error('Xatolik:', err));


const modal = document.getElementById("createModalOverlay"); 
    // const openModalBtn = document.getElementById("openModalBtn"); 
    // openModalBtn.onclick = () => modal.style.display = "block"; 
    window.onclick = (e) => { if (e.target === modal)
    modal.style.display = "none"; }; // Admin yaratish AJAX orqali

document.querySelectorAll(".close").forEach(closeBtn => {
  closeBtn.addEventListener("click", () => {
    closeBtn.closest(".modal-overlay").style.display = "none";
  });
});




function confirmDelete(button) {
  const id = button.dataset.id;
  if (confirm("Haqiqatan ham ushbu foydalanuvchini o‘chirmoqchimisiz?")) {
    fetch(`/api/users/delete/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        alert("Foydalanuvchi o‘chirildi!");
        location.reload();
      })
      .catch(err => {
        console.error("Xatolik:", err);
        alert("O‘chirishda xatolik");
      });
  }
}