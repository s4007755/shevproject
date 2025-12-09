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

// stickers waiting to be saved
let pendingStickers = [];

/* --------------------------------------------------
   User UUID (for persistent reactions)
-------------------------------------------------- */
function getUserId() {
  let id = localStorage.getItem("shev_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("shev_user_id", id);
  }
  return id;
}
const USER_ID = getUserId();

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
   Sticker Adding (no drag, cute cluster bottom-right)
-------------------------------------------------- */
stickerOptions.forEach(st => {
  st.addEventListener("click", () => {
    const emoji = st.dataset.sticker;
    addStickerPreview(emoji);
  });
});

function addStickerPreview(emoji) {
  const formArea = document.querySelector(".note-form");

  const s = document.createElement("div");
  s.className = "note-sticker";
  s.textContent = emoji;

  // Cute clustered bottom-right placement
  const baseX = formArea.clientWidth - 60;
  const baseY = formArea.clientHeight - 80;

  const offsetX = (Math.random() * 25) - 10;
  const offsetY = (Math.random() * 25) - 10;

  s.style.left = `${baseX + offsetX}px`;
  s.style.top = `${baseY + offsetY}px`;

  formArea.appendChild(s);

  pendingStickers.push({
    emoji,
    x: baseX + offsetX,
    y: baseY + offsetY
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

  if (file) {
    const storageRef = ref(storage, "notes/" + Date.now() + "_" + file.name);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  // clear preview stickers
  document.querySelectorAll(".note-form .note-sticker").forEach(s => s.remove());

  await addDoc(collection(db, "notes"), {
    title,
    author,
    content,
    imageUrl,
    stickers: pendingStickers,
    reactions: {}, 
    reactionUsers: {}, // { userId: {emoji:true} }
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

  snapshot.forEach((Document) => {
    const data = Document.data();
    const id = Document.id;

    const wrapper = document.createElement("div");
    wrapper.className = "note-card";

    const card = document.createElement("div");
    card.className = "note-card-inner";

    card.innerHTML = `
      <h3 class="note-title">${data.title}</h3>
      <div class="note-meta">By ${data.author} • ${new Date(data.timestamp).toLocaleString()}</div>
      <div class="note-content">${data.content}</div>
      ${data.imageUrl ? `<img class="note-img" src="${data.imageUrl}" />` : ""}
    `;

    /* ----------------------------------------------
       Stickers — static, cute clustered bottom-right
    ---------------------------------------------- */
    if (Array.isArray(data.stickers)) {
      data.stickers.forEach(st => {
        const el = document.createElement("div");
        el.className = "note-sticker";
        el.textContent = st.emoji;
        el.style.left = st.x + "px";
        el.style.top = st.y + "px";
        card.appendChild(el);
      });
    }

    /* ----------------------------------------------
       Reactions (Discord-style toggle)
    ---------------------------------------------- */
    const reactions = ["❤️", "😭", "😍", "👍", "🍆"];
    const bar = document.createElement("div");
    bar.className = "reaction-bar";

    // defaults
    if (!data.reactions) data.reactions = {};
    if (!data.reactionUsers) data.reactionUsers = {};

    bar.innerHTML = reactions
      .map(r => `
        <div class="reaction-button ${data.reactionUsers[USER_ID]?.[r] ? "reacted" : ""}" data-react="${r}">
          <span class="emoji">${r}</span>
          <span class="reaction-count">${data.reactions[r] ?? 0}</span>
        </div>
      `)
      .join("");

    bar.addEventListener("click", async (e) => {
      const btn = e.target.closest(".reaction-button");
      if (!btn) return;
      
      const emoji = btn.dataset.react;
      if (!data.reactions[emoji]) data.reactions[emoji] = 0;
      if (!data.reactionUsers[USER_ID]) data.reactionUsers[USER_ID] = {};

      const userHasReacted = data.reactionUsers[USER_ID][emoji] === true;

      // Toggle behavior
      if (userHasReacted) {
        // Remove reaction
        data.reactions[emoji] = Math.max(0, data.reactions[emoji] - 1);
        delete data.reactionUsers[USER_ID][emoji];
        btn.classList.remove("reacted");
      } else {
        // Add reaction
        data.reactions[emoji] += 1;
        data.reactionUsers[USER_ID][emoji] = true;
        btn.classList.add("reacted");

        // floating bubble
        const bubble = document.createElement("div");
        bubble.className = "reaction-float";
        bubble.textContent = emoji;
        bubble.style.left = "50%";
        bubble.style.top = "0";
        wrapper.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1100);
      }

      // Persist to Firestore
      await updateDoc(doc(db, "notes", id), {
        reactions: data.reactions,
        reactionUsers: data.reactionUsers
      });

      // Update UI count
      btn.querySelector(".reaction-count").textContent = data.reactions[emoji];
    });

    card.appendChild(bar);

    /* ----------------------------------------------
       Edit + Delete
    ---------------------------------------------- */
    const actions = document.createElement("div");
    actions.className = "note-actions";

    actions.innerHTML = `
      <button class="note-btn edit-btn" data-id="${id}">Edit</button>
      <button class="note-btn delete-btn" data-id="${id}">Delete</button>
    `;

    card.appendChild(actions);
    wrapper.appendChild(card);
    notesList.appendChild(wrapper);
  });
}

/* --------------------------------------------------
   EDIT / DELETE HANDLING
-------------------------------------------------- */
document.addEventListener("click", async (e) => {
  const t = e.target;

  if (t.classList.contains("delete-btn")) {
    await deleteDoc(doc(db, "notes", t.dataset.id));
    loadNotes();
  }

  if (t.classList.contains("edit-btn")) {
    const id = t.dataset.id;
    const card = t.closest(".note-card-inner");

    const titleEl = card.querySelector(".note-title");
    const contentEl = card.querySelector(".note-content");

    const oldTitle = titleEl.textContent;
    const oldContent = contentEl.textContent;

    titleEl.outerHTML = `<input class="edit-field edit-title" value="${oldTitle}">`;
    contentEl.outerHTML = `<textarea class="edit-field edit-content">${oldContent}</textarea>`;

    t.textContent = "Save";
    t.classList.add("save-btn");
    t.classList.remove("edit-btn");
  }

  if (t.classList.contains("save-btn")) {
    const id = t.dataset.id;
    const card = t.closest(".note-card-inner");

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
