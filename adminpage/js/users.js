//   const selectAll = document.getElementById('selectAll');
//   const checkbox = document.querySelectorAll('.checkbox');
  
//   selectAll.addEventListener('change', function () {
//     checkbox.forEach(checkbox => {
//       checkbox.checked = selectAll.checked;
//     });
//   });
  
  
//     // Qidiruv funksiyasi
//     const searchInput = document.querySelector('.search-input input');
//     const tableRows = document.querySelectorAll('table tbody tr');

//     searchInput.addEventListener('input', function() {
//         const searchTerm = searchInput.value.toLowerCase();
        
//         tableRows.forEach(row => {
//             const nameCell = row.querySelector('.author-name').textContent.toLowerCase();
//             const emailCell = row.querySelector('.author-email').textContent.toLowerCase();
            
//             if (nameCell.includes(searchTerm) || emailCell.includes(searchTerm)) {
//                 row.style.display = '';
//             } else {
//                 row.style.display = 'none';
//             }
//         });
//     });

//     // "Select All" checkboxni boshqarish
//     const selectAllCheckbox = document.getElementById('selectAll');
//     const individualCheckboxes = document.querySelectorAll('.checkbox');

//     selectAllCheckbox.addEventListener('change', function() {
//         individualCheckboxes.forEach(checkbox => {
//             checkbox.checked = selectAllCheckbox.checked;
//         });
//     });

//     // Har bir delete tugmasi uchun tasdiqlash va o'chirish
//     function confirmDelete(button) {
//         const confirmation = confirm("Are you sure you want to delete this item?");
        
//         if (confirmation) {
//             const row = button.closest('tr'); // Eng yaqin tr elementini topib o'chiradi
//             row.remove();
//         }
//     }

//     // Delete tugmasini dinamik tarzda qo'shish
//     document.querySelectorAll('.btn-delete').forEach(button => {
//         button.addEventListener('click', function() {
//             confirmDelete(button);
//         });
//     });


//     const modalOverlay = document.getElementById("modalOverlay");
//     const closeBtn = document.getElementById("closeBtn");
//     const saveBtn = document.getElementById("saveBtn");
  
//     const inputName = document.getElementById("inputName");
//     const inputEmail = document.getElementById("inputEmail");
//     const inputPhone = document.getElementById("inputPhone");
//     const inputOrders = document.getElementById("inputOrders");
//     const inputLogin = document.getElementById("inputLogin");
  
//     // Edit button click handler
//     function editUser(button) {
//       const row = button.closest("tr");
//       const name = row.querySelector(".author-name").textContent.trim();
//       const email = row.querySelector(".author-email").textContent.trim();
//       const phone = row.querySelector(".phone") ? row.querySelector(".phone").value : row.cells[3].textContent.trim();
//       const role = row.querySelector(".status").textContent.trim();
//       const login = row.querySelector(".last-login") ? row.querySelector(".last-login").value : row.cells[5].textContent.trim();
  
//       inputName.value = name;
//       inputEmail.value = email;
//       inputPhone.value = phone;
//       inputOrders.value = role;
//       inputLogin.value = login;
  
//       modalOverlay.style.display = "block";
//     }
  
//     // Close modal
//     closeBtn.onclick = () => {
//       modalOverlay.style.display = "none";
//     };
  
//     // Save changes (You can replace this with real saving logic)
//     saveBtn.onclick = () => {
//       alert("Ma'lumotlar saqlandi (yoki serverga jo‘natiladi)");
//       modalOverlay.style.display = "none";
//     };
  
//     // Optional: Close modal on outside click
//     window.onclick = (e) => {
//       if (e.target == modalOverlay) {
//         modalOverlay.style.display = "none";
//       }
//     };
  
    

// // Create
// const createModalOverlay = document.getElementById("createModalOverlay");
// const createCloseBtn = document.getElementById("createCloseBtn");
// const createSaveBtn = document.getElementById("createSaveBtn");

// const createName = document.getElementById("createName");
// const createEmail = document.getElementById("createEmail");
// const createPhone = document.getElementById("createPhone");
// const createOrders = document.getElementById("createOrders");
// const createLogin = document.getElementById("createLogin");

// // Create modalni ochish funksiyasi
// function openCreateModal() {
//   createName.value = "";
//   createEmail.value = "";
//   createPhone.value = "";
//   createOrders.value = "admin"; // yoki default qiymat
//   createLogin.value = "";

//   createModalOverlay.style.display = "block";
// }

// // Create modalni yopish
// createCloseBtn.onclick = () => {
//   createModalOverlay.style.display = "none";
// };

// // Create ma'lumotlarini saqlash
// createSaveBtn.onclick = () => {
//   const newUser = {
//     name: createName.value.trim(),
//     email: createEmail.value.trim(),
//     phone: createPhone.value.trim(),
//     role: createOrders.value,
//     lastLogin: createLogin.value.trim(),
//   };

//   console.log("Yangi foydalanuvchi:", newUser);
//   alert("Yangi foydalanuvchi qo‘shildi (yoki serverga jo‘natiladi)");
//   createModalOverlay.style.display = "none";
// };

// // Tashqariga bosilganda yopish
// window.onclick = (e) => {
//   if (e.target == createModalOverlay) {
//     createModalOverlay.style.display = "none";
//   }
// };


fetch('/api/users/')
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    data.Users.forEach(User => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="author-info">
            <img src="${User.image || 'https://via.placeholder.com/40'}" alt="Avatar" class="avatar">
            <div><div class="author-name">${User.name}</div></div>
          </div>
        </td>
        <td><div class="author-email">${User.email}</div></td>
        <td>${User.phone || 'Noma’lum'}</td>
        <td><span class="status status-online">${User.role || '-'}</span></td>
        <td>${User.createdAt?.slice(0, 10) || 'Noma’lum'}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-edit" data-id="${User._id}" onclick="editUser(this)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-delete" data-id="${User._id}" onclick="confirmDelete(this)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  })
  // .catch(err => console.error('Xatolik:', err));

document.getElementById('createUserBtn')?.addEventListener('click', () => {
  const newUser = {
    username: document.getElementById('newName').value,
    email: document.getElementById('newEmail').value,
    phone: document.getElementById('newPhone').value,
    role: document.getElementById('newRole').value,
    image: document.getElementById('newImage').value,
    password: document.getElementById('newPassword').value,
  };

  fetch('/api/users/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
    .then(res => res.json())
    .then(data => {
      alert('Foydalanuvchi yaratildi!');
      location.reload();
    })
    .catch(err => {
      console.error('Xatolik:', err);
      alert('Yaratishda xatolik');
    });
});

function editUser(button) {
  const row = button.closest('tr');
  const id = button.dataset.id;

  const name = row.querySelector('.author-name')?.textContent.trim();
  const email = row.querySelector('.author-email')?.textContent.trim();
  const phone = row.children[3]?.textContent.trim();
  const role = row.querySelector('.status')?.textContent.trim();

  // Modalni ochamiz va inputlarga qiymatlarni o‘rnatamiz
  document.getElementById('editModal').style.display = 'flex';
  document.getElementById('editName').value = name;
  document.getElementById('editEmail').value = email;
  document.getElementById('editPhone').value = phone;
  document.getElementById('editRole').value = role;
  document.getElementById('editSaveBtn').dataset.id = id;
}

document.getElementById('editSaveBtn')?.addEventListener('click', () => {
  const id = document.getElementById('editSaveBtn').dataset.id;

  const updatedUser = {
    username: document.getElementById('editName').value,
    email: document.getElementById('editEmail').value,
    phone: document.getElementById('editPhone').value,
    role: document.getElementById('editRole').value,
  };

  fetch(`/api/users/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUser)
  })
    .then(res => res.json())
    .then(data => {
      alert('Foydalanuvchi yangilandi!');
      location.reload();
    })
    .catch(err => {
      console.error('Xatolik:', err);
      alert('Yangilashda xatolik');
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
