const modalOverlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");

const inputClient = document.getElementById("inputClient");
const inputLocation = document.getElementById("inputLocation");
const inputStatus = document.getElementById("inputStatus");
const inputPrice = document.getElementById("inputPrice");
const inputDate = document.getElementById("inputDate");

function editProduct(button) {
  const row = button.closest("tr");

  const client = row.querySelector(".author-name").textContent.trim();
  const location = row.querySelector(".location").textContent.trim();
  const status = row.querySelector(".status").textContent.trim();
  const price = row.querySelector(".price").textContent.trim();
  const date = row.querySelector(".last-login").textContent.trim();

  inputClient.value = client;
  inputLocation.value = location;
  inputStatus.value = status;
  inputPrice.value = price;
  inputDate.value = date;

  modalOverlay.style.display = "block";
}

closeBtn.onclick = () => {
  modalOverlay.style.display = "none";
};

saveBtn.onclick = () => {
  alert("Ma'lumotlar saqlandi (yoki serverga jo‘natiladi)");
  modalOverlay.style.display = "none";
};

window.onclick = (e) => {
  if (e.target == modalOverlay) {
    modalOverlay.style.display = "none";
  }
};


// Create
const createModalOverlay2 = document.getElementById("createModalOverlay2");
const createCloseBtn = document.getElementById("createCloseBtn");
const createSaveBtn = document.getElementById("createSaveBtn");

const createClient = document.getElementById("createClient");
const createLocation = document.getElementById("createLocation");
const createStatus = document.getElementById("createStatus");
const createPrice = document.getElementById("createPrice");
const createDate = document.getElementById("createDate");

// Open Create Modal
function openCreateModal() {
  // Optional: clear old values
  createClient.value = "";
  createLocation.value = "";
  createStatus.value = "";
  createPrice.value = "admin";
  createDate.value = "";

  createModalOverlay2.style.display = "block";
}

// Close Create Modal
createCloseBtn.onclick = () => {
  createModalOverlay2.style.display = "none";
};

// Save new admin
createSaveBtn.onclick = () => {
  const newProduct = {
    client: createClient.value.trim(),
    location: createLocation.value.trim(),
    status: createStatus.value.trim(),
    price: createPrice.value,
    date: createDate.value.trim(),
  };

  console.log("Yangi product:", newProduct);
  alert("Yangi product qo‘shildi (yoki serverga jo‘natiladi)");
  createModalOverlay2.style.display = "none";
};

// Outside click to close
window.onclick = (e) => {
  if (e.target == createModalOverlay2) {
    createModalOverlay2.style.display = "none";
  }
};






// 

const selectAll = document.getElementById('selectAll');
const checkbox = document.querySelectorAll('.checkbox');

selectAll.addEventListener('change', function () {
  checkbox.forEach(checkbox => {
    checkbox.checked = selectAll.checked;
  });
});


  const searchInput = document.querySelector('.search-input input');
  const tableRows = document.querySelectorAll('table tbody tr');

  searchInput.addEventListener('input', function() {
      const searchTerm = searchInput.value.toLowerCase();
      
      tableRows.forEach(row => {
          const nameCell = row.querySelector('.author-name').textContent.toLowerCase();
          const emailCell = row.querySelector('.author-email').textContent.toLowerCase();
          
          if (nameCell.includes(searchTerm) || emailCell.includes(searchTerm)) {
              row.style.display = '';
          } else {
              row.style.display = 'none';
          }
      });
  });

  const selectAllCheckbox = document.getElementById('selectAll');
  const individualCheckboxes = document.querySelectorAll('.checkbox');

  selectAllCheckbox.addEventListener('change', function() {
      individualCheckboxes.forEach(checkbox => {
          checkbox.checked = selectAllCheckbox.checked;
      });
  });

  function confirmDelete(button) {
      const confirmation = confirm("Are you sure you want to delete this item?");
      
      if (confirmation) {
          const row = button.closest('tr'); 
          row.remove();
      }
  }

  document.querySelectorAll('.btn-delete').forEach(button => {
      button.addEventListener('click', function() {
          confirmDelete(button);
      });
  });

