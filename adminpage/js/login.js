const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.querySelector('.submit');

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('Login tugmasi bosildi');

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // const res = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   credentials: 'include', // cookie uchun muhim
  //   body: JSON.stringify({ email, password })
  // });

  // const data = await res.json();
  // console.log('Server javobi:', data);

  // if (data.success) {
  //   alert('Xush kelibsiz, Admin!');
  //   window.location.href = '../views//admin'; 
  // } else {
  //   alert(data.message || 'Email yoki parol noto‘g‘ri');
  // }
});

// require('../views/')