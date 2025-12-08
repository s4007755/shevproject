/* ---------------------------
   Firebase (Modular v12+)
--------------------------- */
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
  getFirestore, collection, addDoc, query, orderBy, getDocs, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3rkEOWhLToGSBmLcYs_Km1T3YCmeUAa8",
  authDomain: "iloveshev-4bbea.firebaseapp.com",
  projectId: "iloveshev-4bbea",
  storageBucket: "iloveshev-4bbea.firebasestorage.app",
  messagingSenderId: "525621773920",
  appId: "1:525621773920:web:a390d12b100dee9605e505",
  measurementId: "G-8C39J17DYE"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

/* Floating heart effect */
function spawnFloatingHeart() {
  const heart = document.createElement("div");
  heart.textContent = "♥";
  heart.style.position = "fixed";
  heart.style.left = Math.random() * 90 + "%";
  heart.style.bottom = "10px";
  heart.style.fontSize = "1.6rem";
  heart.style.color = "var(--accent)";
  heart.style.opacity = "0.9";
  heart.style.transition = "transform 2.4s linear, opacity 2.4s";

  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = "translateY(-160px)";
    heart.style.opacity = "0";
  });

  setTimeout(() => heart.remove(), 2600);
}

/* UI elements */
const form = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");
const stickerOptions = document.querySelectorAll(".sticker-options span");
const chosenStickerInput = document.getElementById("chosenSticker");

/* ---------------------------
   Sticker Picker Animation
--------------------------- */
stickerOptions.forEach(sticker => {
  sticker.addEventListener("click", () => {
    stickerOptions.forEach(s => s.classList.remove("active"));
    sticker.classList.add("active");
    chosenStickerInput.value = sticker.dataset.sticker;
  });
});

/* ---------------------------
   Submit a Note
--------------------------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  spawnFloatingHeart();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const content = document.getElementById("content").value.trim();
  const sticker = chosenStickerInput.value;
  const file = document.getElementById("imageInput").files[0];

  let imageUrl = null;

  if (file) {
    const storageRef = ref(storage, "notes/" + Date.now() + "_" + file.name);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, "notes"), {
    title,
    author,
    content,
    sticker,
    imageUrl,
    timestamp: Date.now()
  });

  form.reset();
  stickerOptions.forEach(s => s.classList.remove("active"));
  loadNotes();
});

/* ---------------------------
   Load Notes
--------------------------- */
async function loadNotes() {
  notesList.innerHTML = "";

  const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((document) => {
    const n = document.data();
    const id = document.id;

    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      <div class="note-stickers">${n.sticker ? `<span>${n.sticker}</span>` : ""}</div>

      <h3 class="note-title">${n.title}</h3>
      <div class="note-meta">By ${n.author} • ${new Date(n.timestamp).toLocaleString()}</div>

      <div class="note-content">${n.content}</div>

      ${n.imageUrl ? `<img class="note-img" src="${n.imageUrl}" />` : ""}

      <div class="note-actions">
        <button class="note-btn edit-btn" data-id="${id}" data-author="${n.author}">Edit</button>
        <button class="note-btn delete-btn" data-id="${id}" data-author="${n.author}">Delete</button>
      </div>
    `;

    notesList.appendChild(card);
  });
}

/* ---------------------------
   Edit + Delete Handlers
--------------------------- */
document.addEventListener("click", async (e) => {
  const target = e.target;

  // DELETE
  if (target.classList.contains("delete-btn")) {
    const id = target.dataset.id;
    const author = target.dataset.author;
    const currentAuthor = document.getElementById("author").value.trim();

    if (author !== currentAuthor) {
      alert("You can only delete your own notes ♥");
      return;
    }

    if (confirm("Delete this note?")) {
      await deleteDoc(doc(db, "notes", id));
      loadNotes();
    }
  }

  // EDIT
  if (target.classList.contains("edit-btn")) {
    const id = target.dataset.id;
    const card = target.closest(".note-card");

    const titleEl = card.querySelector(".note-title");
    const contentEl = card.querySelector(".note-content");

    const oldTitle = titleEl.textContent;
    const oldContent = contentEl.textContent;

    titleEl.outerHTML = `<input class="edit-field edit-title" value="${oldTitle}">`;
    contentEl.outerHTML = `<textarea class="edit-field edit-content">${oldContent}</textarea>`;

    target.textContent = "Save";
    target.classList.add("save-btn");
    target.classList.remove("edit-btn");
  }

  // SAVE EDIT
  if (target.classList.contains("save-btn")) {
    const id = target.dataset.id;
    const card = target.closest(".note-card");

    const newTitle = card.querySelector(".edit-title").value.trim();
    const newContent = card.querySelector(".edit-content").value.trim();

    await updateDoc(doc(db, "notes", id), {
      title: newTitle,
      content: newContent
    });

    loadNotes();
  }
});

loadNotes();
