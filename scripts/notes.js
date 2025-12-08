/* --------------------------------------------------
   Firebase Init
-------------------------------------------------- */
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { 
  getFirestore, collection, addDoc, query, orderBy, getDocs,
  updateDoc, deleteDoc, doc
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

/* --------------------------------------------------
   DOM Elements
-------------------------------------------------- */
const form = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");
const loadingSpinner = document.getElementById("loadingSpinner");
const typingOverlay = document.getElementById("typingOverlay");

const stickerOptions = document.querySelectorAll(".sticker-options span");

// We temporarily store stickers before final submission
let pendingStickers = [];

/* --------------------------------------------------
   Floating heart animation
-------------------------------------------------- */
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

/* --------------------------------------------------
   Sticker Picker: Tap to create a sticker on the note
-------------------------------------------------- */
stickerOptions.forEach(sticker => {
  sticker.addEventListener("click", () => {
    addStickerToPreview(sticker.dataset.sticker);
  });
});

/* --------------------------------------------------
   Create a draggable sticker in the pending note area
-------------------------------------------------- */
function addStickerToPreview(emoji) {
  const cardArea = document.querySelector(".note-form");

  const s = document.createElement("div");
  s.className = "note-sticker";
  s.textContent = emoji;

  // Position new sticker randomly inside the form
  s.style.left = (50 + Math.random() * 60) + "px";
  s.style.top = (150 + Math.random() * 60) + "px";

  cardArea.appendChild(s);

  // Enable dragging
  enableDragging(s);

  // Add to pending stickers list
  pendingStickers.push({
    emoji,
    x: parseInt(s.style.left),
    y: parseInt(s.style.top)
  });

  // Sync positions when dragged
  s.dataset.index = pendingStickers.length - 1;
}

/* --------------------------------------------------
   Dragging Logic
-------------------------------------------------- */
function enableDragging(el) {
  let offsetX = 0, offsetY = 0, dragging = false;

  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    el.setPointerCapture(e.pointerId);

    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.transition = "none";
  });

  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";

    const index = el.dataset.index;
    if (index !== undefined) {
      pendingStickers[index].x = parseInt(el.style.left);
      pendingStickers[index].y = parseInt(el.style.top);
    }
  });

  el.addEventListener("pointerup", (e) => {
    dragging = false;
  });
}

/* --------------------------------------------------
   SUBMIT NOTE
-------------------------------------------------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  spawnFloatingHeart();
  typingOverlay.classList.remove("hidden");

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const content = document.getElementById("content").value.trim();
  const file = document.getElementById("imageInput").files[0];

  let imageUrl = null;

  // Upload image
  if (file) {
    const storageRef = ref(storage, "notes/" + Date.now() + "_" + file.name);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  // Clean stickers (remove DOM)
  document.querySelectorAll(".note-form .note-sticker").forEach(s => s.remove());

  // Save note
  await addDoc(collection(db, "notes"), {
    title,
    author,
    content,
    imageUrl,
    stickers: pendingStickers,
    reactions: {}, // empty reaction object
    timestamp: Date.now()
  });

  pendingStickers = [];
  form.reset();
  typingOverlay.classList.add("hidden");
  loadNotes();
});

/* --------------------------------------------------
   LOAD NOTES
-------------------------------------------------- */
async function loadNotes() {
  notesList.innerHTML = "";
  loadingSpinner.classList.remove("hidden");

  const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  loadingSpinner.classList.add("hidden");

  snapshot.forEach((document) => {
    const data = document.data();
    const id = document.id;

    const wrapper = document.createElement("div");
    wrapper.className = "note-card";

    // Main card container
    const card = document.createElement("div");
    card.className = "note-card-inner";

    card.innerHTML = `
      <h3 class="note-title">${data.title}</h3>
      <div class="note-meta">By ${data.author} • ${new Date(data.timestamp).toLocaleString()}</div>
      <div class="note-content">${data.content}</div>
      ${data.imageUrl ? `<img class="note-img" src="${data.imageUrl}" />` : ""}
    `;

    /* ----------------------------------------------
       Stickers
    ---------------------------------------------- */
    if (Array.isArray(data.stickers)) {
      data.stickers.forEach((st) => {
        const el = document.createElement("div");
        el.className = "note-sticker";
        el.textContent = st.emoji;
        el.style.left = st.x + "px";
        el.style.top = st.y + "px";
        enableDragging(el);

        // Update Firestore on drag end
        el.addEventListener("pointerup", async () => {
          st.x = parseInt(el.style.left);
          st.y = parseInt(el.style.top);

          await updateDoc(doc(db, "notes", id), {
            stickers: data.stickers
          });
        });

        card.appendChild(el);
      });
    }

    /* ----------------------------------------------
       Reactions
    ---------------------------------------------- */
    const reactions = ["❤️", "😭", "😍", "👍", "🍆"];
    const reactionBar = document.createElement("div");
    reactionBar.className = "reaction-bar";

    reactionBar.innerHTML = reactions.map(r => `
      <div class="reaction-button" data-react="${r}">
        <span class="emoji">${r}</span>
        <span class="reaction-count">${data.reactions?.[r] ?? 0}</span>
      </div>
    `).join("");

    // Add floating reaction bubbles
    reactionBar.addEventListener("click", async (e) => {
      const btn = e.target.closest(".reaction-button");
      if (!btn) return;

      const emoji = btn.dataset.react;

      // Update counter
      if (!data.reactions) data.reactions = {};
      data.reactions[emoji] = (data.reactions[emoji] ?? 0) + 1;

      await updateDoc(doc(db, "notes", id), {
        reactions: data.reactions
      });

      // Update UI count
      btn.querySelector(".reaction-count").textContent = data.reactions[emoji];

      // Floating bubble
      const bubble = document.createElement("div");
      bubble.className = "reaction-float";
      bubble.textContent = emoji;
      bubble.style.left = "50%";
      bubble.style.top = "0";
      wrapper.appendChild(bubble);

      setTimeout(() => bubble.remove(), 1200);
    });

    card.appendChild(reactionBar);

    /* ----------------------------------------------
       Edit + Delete Buttons
    ---------------------------------------------- */
    const actions = document.createElement("div");
    actions.className = "note-actions";

    actions.innerHTML = `
      <button class="note-btn edit-btn" data-id="${id}" data-author="${data.author}">Edit</button>
      <button class="note-btn delete-btn" data-id="${id}" data-author="${data.author}">Delete</button>
    `;

    card.appendChild(actions);

    wrapper.appendChild(card);
    notesList.appendChild(wrapper);
  });
}

/* --------------------------------------------------
   EDIT / DELETE
-------------------------------------------------- */
document.addEventListener("click", async (e) => {
  const target = e.target;

  /* DELETE */
  if (target.classList.contains("delete-btn")) {
    const id = target.dataset.id;
    const note = doc(db, "notes", id);
    await deleteDoc(note);
    loadNotes();
  }

  /* EDIT MODE */
  if (target.classList.contains("edit-btn")) {
    const id = target.dataset.id;
    const card = target.closest(".note-card-inner");

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

  /* SAVE EDIT */
  if (target.classList.contains("save-btn")) {
    const id = target.dataset.id;
    const card = target.closest(".note-card-inner");

    const newTitle = card.querySelector(".edit-title").value.trim();
    const newContent = card.querySelector(".edit-content").value.trim();

    await updateDoc(doc(db, "notes", id), {
      title: newTitle,
      content: newContent
    });

    loadNotes();
  }
});

/* --------------------------------------------------
   INIT
-------------------------------------------------- */
loadNotes();
