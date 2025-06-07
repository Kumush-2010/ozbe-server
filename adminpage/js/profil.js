// Cookie’dan adminId olish uchun funksiya
  function getCookie(name) {
    const nameReg = new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    );
    const match = document.cookie.match(nameReg);
    return match ? decodeURIComponent(match[1]) : "";
  }

  document.addEventListener("DOMContentLoaded", function() {
    const adminId = getCookie("adminId");
    console.log("adminId:", adminId);

    // Agar hech qanday adminId bo'lmasa, alert chiqaramiz
    if (!adminId) {
      alert("⚠️ adminId cookie’da topilmadi. Login qildingizmi?");
      return;
    }

    // DOM elementlarini olish
    const nameInput        = document.getElementById("adminname");
    const birthInput         = document.getElementById("birth");
    const jinsInput      = document.getElementById("jins");
    const phoneInput       = document.getElementById("phone");
    const emailInput       = document.getElementById("email");
    const fileInput        = document.getElementById("profileImageInput"); // rasm input
    const imagePreview    = document.getElementById("imagePreview");     // <img> preview

    const editBtn   = document.getElementById("editBtn");
    const saveBtn   = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    // Dastlabki maʼlumotlarni saqlab qoʻyamiz
    let originalData = {
      adminname: nameInput.value.trim(),
      birth:      birthInput.value.trim(),
      jins:   jinsInput.value,
      phone:    phoneInput.value.trim(),
      email:    emailInput.value.trim(),
      // rasm uchun preview-ni keyin qayta o‘qish oson emas, 
      // shuning uchun cancel da sahifani reload qilishdan foydalanamiz.
    };

    // “Yangilash” tugmasi bosilganda
    editBtn.addEventListener("click", () => {
      // Dastlabki qiymatlarni yangilaymiz (agar keyin “Bekor qilish” bosilsa qaytarish uchun)
      originalData = {
        adminname: nameInput.value.trim(),
        birth:      birthInput.value,
        jins:   jinsInput.value,
        phone:    phoneInput.value.trim(),
        email:    emailInput.value.trim()
      };

      // Barcha input/ select larni enabled qilamiz
      nameInput.disabled   = false;
      birthInput.disabled    = false;
      jinsInput.disabled = false;
      phoneInput.disabled  = false;
      emailInput.disabled  = false;
      fileInput.disabled   = false; // rasm inputini yoqamiz

      editBtn.disabled   = true;
      saveBtn.disabled   = false;
      cancelBtn.disabled = false;
    });

    // “Bekor qilish” tugmasi bosilganda
    cancelBtn.addEventListener("click", () => {
      // Original maʼlumotlarni qaytaramiz
      nameInput.value   = originalData.adminname;
      birthInput.value    = originalData.birth;
      jinsInput.value = originalData.jins;
      phoneInput.value  = originalData.phone;
      emailInput.value  = originalData.email;
      fileInput.value   = ""; // fayl inputini tozalaymiz

      // Input’larni yana disabled qilamiz
      nameInput.disabled   = true;
      birthInput.disabled    = true;
      jinsInput.disabled = true;
      phoneInput.disabled  = true;
      emailInput.disabled  = true;
      fileInput.disabled   = true;

      editBtn.disabled   = false;
      saveBtn.disabled   = true;
      cancelBtn.disabled = true;

      // Rasm preview-ni ham asl holatiga qaytarish uchun sahifani reload qilamiz
      location.reload();
    });

    // “Saqlash” tugmasi bosilganda — forma yuborilishi
    document.getElementById("profile-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      // Yana cookie tekshirib qo'yish (pow-safe)
      if (!adminId) {
        alert("⚠️ adminId cookie’da topilmadi. Login qildingizmi?");
        return;
      }

      try {
        // FormData yaratiladi
        const formData = new FormData();

        // Agar foydalanuvchi rasm tanlagan bo‘lsa, qo‘shamiz
        if (fileInput.files.length > 0) {
          formData.append("image", fileInput.files[0]);
        }

        // Boshqa input maydonlarini yod olish (HTML’da name attributelariga mos qilib)
        formData.append("adminname", nameInput.value.trim());
        formData.append("birth",      birthInput.value);
        formData.append("jins",   jinsInput.value);
        formData.append("phone",    phoneInput.value.trim());
        formData.append("email",    emailInput.value.trim());

        // Fetch orqali formni yuboramiz
        // Eslatma: backend’da route POST yoki PUT bo‘lishiga qarab moslash kerak.
        // Biz oldin misolda router.post('/profil/update/:id') qilgandik,
        // shuning uchun POST qilib yuboryapmiz.
        const response = await fetch(`/api/admin/profil/${adminId}`, {
          method: "POST",            // yoki agar siz PUT ishlatayotgan bo‘lsangiz, “PUT”
          body: formData             // Content-Type: multipart/form-data avtomatik beriladi
        });

        if (!response.ok) {
          // Agar javobda xato bo‘lsa, text sifatida o‘qiymiz va Error uchiramiz
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        alert("✅ Profil muvaffaqiyatli yangilandi!");

        // Yangi ma’lumotlar qaytdi deb hisoblab, input’larni yana disabled qilamiz
        nameInput.disabled   = true;
        birthInput.disabled    = true;
        jinsInput.disabled = true;
        phoneInput.disabled  = true;
        emailInput.disabled  = true;
        fileInput.disabled   = true;

        saveBtn.disabled   = true;
        cancelBtn.disabled = true;
        editBtn.disabled   = false;

        // originalData’ni yangilab qo‘yamiz (keyingi Bekor qilish uchun)
        originalData = {
          adminname: data.adminname   || nameInput.value.trim(),
          birth:      data.birth        || birthInput.value,
          jins:   data.jins     || jinsInput.value,
          phone:    data.phone      || phoneInput.value.trim(),
          email:    data.email      || emailInput.value.trim()
        };

        // Agar backend rasm URL ni qaytargan bo‘lsa, preview-ni yangilaymiz
        if (data.image) {
          imagePreview.src = data.image;
        }

        fileInput.value = ""; // fayl inputini tozalab qo‘yamiz

      } catch (err) {
        console.error("❌ Xatolik:", err);
        alert("Xatolik yuz berdi: " + err.message);
      }
    });

    // Fayl tanlanganda rasmni preview qilish:
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(event) {
        imagePreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  });





//   fetch('http://localhost:3000/api/admin/profil', {
//   method: 'GET',
//   credentials: 'include' // Cookie yuborilishi uchun MUHIM!
// })
// .then(res => res.json())
// .then(data => console.log(data))
// .catch(err => console.error(err));
