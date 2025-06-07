
document.getElementById('configBtn')?.addEventListener('click', () => {
  document.getElementById('configPanel').classList.add('show');
});

document.getElementById('closeConfig')?.addEventListener('click', () => {
  document.getElementById('configPanel').classList.remove('show');
});

document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', function () {
    let color = this.getAttribute('data-color');
    document.querySelector('.sidebar').style.backgroundColor = color;
  });
});

document.querySelectorAll('.typeBtn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.typeBtn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    if (this.dataset.type === "white") {
      document.querySelector('.sidebar').classList.remove('dark');
    } else {
      document.querySelector('.sidebar').classList.add('dark');
    }
  });
});

document.getElementById('navbarFixed')?.addEventListener('change', function () {
  document.querySelector('.navbar').style.position = this.checked ? 'fixed' : 'relative';
});

document.getElementById('miniSidenav')?.addEventListener('change', function () {
  document.querySelector('.sidebar').classList.toggle('mini');
});

document.getElementById('darkMode')?.addEventListener('change', function () {
  document.body.classList.toggle('dark-mode');
});
