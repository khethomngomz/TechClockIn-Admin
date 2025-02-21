// ✅ Firebase Modules
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
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBjhrESUn4rapw_FITwI58ok_W1Qivph9c",
  authDomain: "technicianclockinapp.firebaseapp.com",
  projectId: "technicianclockinapp",
  storageBucket: "technicianclockinapp.firebasestorage.app",
  messagingSenderId: "938895818704",
  appId: "1:938895818704:web:2d4d1c182897e31169c3d5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Show Sign-Up Form
window.showAdminSignup = function () {
  document.getElementById("login").style.display = "none";
  document.getElementById("signup-section").style.display = "block";
};

// ✅ Show Login Form
window.showAdminLogin = function () {
  document.getElementById("signup-section").style.display = "none";
  document.getElementById("login").style.display = "block";
};

// ✅ Admin Login
window.adminLogin = function () {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Login successful
      console.log("Admin logged in:", userCredential.user.email);
      fetchLogs(); // Start fetching logs
      document.getElementById("login").style.display = "none";
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("logs-table").style.display = "table"; // Show logs table
    })
    .catch((error) => {
      console.error("Login failed:", error.message);
      alert("Invalid credentials or user does not exist.");
    });
};

// ✅ Admin Signup
window.adminSignup = function () {
  const email = document.getElementById("signup-admin-email").value;
  const password = document.getElementById("signup-admin-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Optionally store admin details in Firestore (for future reference)
      await setDoc(doc(db, "admins", user.uid), { email: user.email });

      alert("Admin account created successfully! Now log in.");
      showAdminLogin(); // Redirect back to login page
    })
    .catch((error) => {
      console.error("Error signing up:", error.message);
      alert(error.message);
    });
};

// ✅ Fetch Logs from Firestore
function fetchLogs() {
  const logsBody = document.getElementById("logs-body");
  logsBody.innerHTML = ""; // Clear table before inserting new data

  const logsQuery = query(collection(db, "logs"), orderBy("timestamp", "desc"));

  onSnapshot(logsQuery, (snapshot) => {
    logsBody.innerHTML = ""; // Clear and update table

    snapshot.forEach((doc) => {
      const log = doc.data();
      const timestamp = log.timestamp?.toDate().toLocaleString() || "N/A";

      // ✅ Add a row to the logs table
      logsBody.innerHTML += `
        <tr>
          <td>${log.userId}</td>
          <td>${log.type}</td>
          <td>${timestamp}</td>
          <td>${log.location.latitude}, ${log.location.longitude}</td>
        </tr>
      `;
    });
  });
}
