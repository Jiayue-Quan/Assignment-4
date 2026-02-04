const API = "http://localhost:3000";

const form = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerBtn");
const errorEl = document.getElementById("error");



form.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

registerBtn.addEventListener("click", () => {
  register();
});

async function login() {
  errorEl.textContent = "";

  const username = form.username.value;
  const password = form.password.value;

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    saveAuth(data);
    window.location.href = "index.html";
  } catch (err) {
    errorEl.textContent = err.message;
  }
}

async function register() {
  errorEl.textContent = "";

  const username = form.username.value;
  const password = form.password.value;

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    saveAuth(data);
    window.location.href = "index.html";
  } catch (err) {
    errorEl.textContent = err.message;
  }
}

function saveAuth(data) {
  document.cookie = `token=${data.token}; path=/`;
  document.cookie = `username=${data.username}; path=/`;
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);
}
