const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.querySelector('.submit');

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.success) {
    alert('Xush kelibsiz, Admin!');
    window.location.href = '/admin'; // admin sahifasiga yo'naltirish
  } else {
    alert(data.message || 'Email yoki parol noto‘g‘ri');
  }
});
