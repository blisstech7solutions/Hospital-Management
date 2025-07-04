
// js/authv.js

// Sign up
function signUp(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Signup successful:", userCredential.user);
      alert("Signup successful!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Signup error:", error.message);
      alert("Error: " + error.message);
    });
}

// Login
function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Login successful:", userCredential.user);
      alert("Login successful!");
      window.location.href = "admin-dashboard.html";
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      alert("Error: " + error.message);
    });
}

// Logout
function logout() {
  auth.signOut()
    .then(() => {
      console.log("Logged out");
      alert("Logged out!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout error:", error.message);
      alert("Error: " + error.message);
    });
}

// Auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    // Optionally update UI here (e.g., show user info)
  } else {
    console.log("No user logged in");
    // Optionally redirect if necessary
  }
});
