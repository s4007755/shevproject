/* ---------------------------
   Firebase (Modular v12+)
--------------------------- */

import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
  getFirestore, collection, addDoc, query, orderBy, getDocs 
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

/* ---------------------------
   Floating heart animation
--------------------------- */

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

/* ---------------------------
   Elements
--------------------------- */

const form = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");

/* ---------------------------
   Submit a Note
--------------------------- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  spawnFloatingHeart();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const content = document.getElementById("content").value.trim();
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
    imageUrl,
    timestamp: Date.now()
  });

  form.reset();
  loadNotes();
});

/* ---------------------------
   Load Notes
--------------------------- */

async function loadNotes() {
  notesList.innerHTML = "";

  const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const n = doc.data();

    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      <div class="note-stickers">
        <span>🌸</span>
        <span>💖</span>
        <span>⭐</span>
      </div>

      <h3 class="note-title">${n.title}</h3>
      <div class="note-meta">By ${n.author} • ${new Date(n.timestamp).toLocaleString()}</div>

      <div class="note-content">${n.content}</div>

      ${n.imageUrl ? `<img class="note-img" src="${n.imageUrl}" />` : ""}
    `;

    notesList.appendChild(card);
  });
}

loadNotes();
