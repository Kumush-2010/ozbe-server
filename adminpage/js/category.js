
fetch("http://localhost:3000/api/categories")
  .then(res => res.json())
  .then(data => console.log("Barcha kategoriyalar:", data));

fetch("http://localhost:3000/api/categories/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "Erkaklar kiyimi" }),
})
.then(res => res.json())
.then(data => console.log("Kategoriya:", data))
.catch(err => console.error("Xatolik:", err));

fetch(`http://localhost:3000/api/categories/edit/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Yangi nom" }),
})
.then(res => res.json())
.then(data => console.log("Yangilangan:", data));

fetch(`http://localhost:3000/api/categories/delete/${id}`, {
  method: "DELETE",
})
.then(res => res.json())
.then(data => console.log("O‘chirildi:", data));
