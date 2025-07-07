// JS/authv.js for compat version (no imports)
document.getElementById("signup-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    alert("Signup successful!");
    window.location.href = "login.html";
  } catch (err) {
    alert("Signup Error: " + err.message);
  }
});

document.getElementById("login-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    alert("Login successful!");
    window.location.href = "provider-dashboard.html";
  } catch (err) {
    alert("Login Error: " + err.message);
  }
});
