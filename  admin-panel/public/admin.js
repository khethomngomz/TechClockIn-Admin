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

function fetchLogs() {
  const logsBody = document.getElementById("logs-body");
  logsBody.innerHTML = "";
  const logsQuery = query(collection(db, "logs"), orderBy("timestamp", "desc"));

  onSnapshot(logsQuery, (snapshot) => {
    logsBody.innerHTML = "";
    snapshot.forEach((doc) => {
      const log = doc.data();
      const timestamp = log.timestamp?.toDate().toLocaleString() || "N/A";
      logsBody.innerHTML += `
        <tr>
          <td>${log.userId}</td>
          <td>${log.type}</td>
          <td>${timestamp}</td>
          <td>${log.location.latitude}, ${log.location.longitude}</td>
        </tr>`;
    });
  });
}
