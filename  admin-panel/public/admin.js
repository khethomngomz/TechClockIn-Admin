import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  doc,
  limit,
  startAfter,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjhrESUn4rapw_FITwI58ok_W1Qivph9c",
  authDomain: "technicianclockinapp.firebaseapp.com",
  databaseURL:
    "https://technicianclockinapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "technicianclockinapp",
  storageBucket: "technicianclockinapp.firebasestorage.app",
  messagingSenderId: "938895818704",
  appId: "1:938895818704:web:2d4d1c182897e31169c3d5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let lastVisible = null;
const logsPerPage = 5;

window.showAdminSignup = function () {
  document.getElementById("login").style.display = "none";
  document.getElementById("signup-section").style.display = "block";
};

window.showAdminLogin = function () {
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("login").style.display = "block";
};

window.adminLogin = function () {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Admin logged in:", userCredential.user.email);
      fetchLogs();
      document.getElementById("login").style.display = "none";
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("logs-table").style.display = "table";
    })
    .catch((error) => {
      alert("Invalid credentials or user does not exist.");
    });
};

window.adminSignup = function () {
  const email = document.getElementById("signup-admin-email").value;
  const password = document.getElementById("signup-admin-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      await setDoc(doc(db, "admins", user.uid), { email: user.email });
      alert("Admin account created successfully! Now log in.");
      showAdminLogin();
    })
    .catch((error) => {
      alert(error.message);
    });
};

async function fetchLogs() {
  const logsBody = document.getElementById("logs-body");
  logsBody.innerHTML = "";
  const logsQuery = query(
    collection(db, "logs"),
    orderBy("timestamp", "desc"),
    limit(logsPerPage)
  );

  const snapshot = await getDocs(logsQuery);
  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  snapshot.forEach((doc) => {
    appendLogToTable(doc.data());
  });

  document.getElementById("see-more-container").style.display =
    snapshot.docs.length < logsPerPage ? "none" : "block";
}

window.loadMoreLogs = async function () {
  if (!lastVisible) return;

  const logsQuery = query(
    collection(db, "logs"),
    orderBy("timestamp", "desc"),
    startAfter(lastVisible),
    limit(logsPerPage)
  );

  const snapshot = await getDocs(logsQuery);
  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  snapshot.forEach((doc) => {
    appendLogToTable(doc.data());
  });

  if (snapshot.docs.length < logsPerPage) {
    document.getElementById("see-more-container").style.display = "none";
  }
};

function appendLogToTable(log) {
  const logsBody = document.getElementById("logs-body");
  const timestamp = log.timestamp?.toDate().toLocaleString() || "N/A";
  logsBody.innerHTML += `
    <tr>
      <td>${log.userId}</td>
      <td>${log.type}</td>
      <td>${timestamp}</td>
      <td>${log.location.latitude}, ${log.location.longitude}</td>
    </tr>`;
}

// Function to scroll back to the top
window.scrollToTop = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Show or hide the scroll-to-top button based on scroll position
window.onscroll = function () {
  const scrollButton = document.getElementById("scroll-top-btn");
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollButton.style.display = "block";
  } else {
    scrollButton.style.display = "none";
  }
};
