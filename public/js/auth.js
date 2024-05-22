url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://chat-app.onrender.com/api/auth/";

const signInform = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const validateJWT = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const res = await fetch(url, { headers: { "x-token": token } });

      if (res.status === 200) {
        window.location = "chat.html";
      }
    } catch (error) {
      throw new Error(error);
    }
  }
};

validateJWT();

signInform.addEventListener("submit", (event) => {
  event.preventDefault();

  if (emailInput.value.length < 1 || passwordInput.value.length < 1) return;

  const userCredentials = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  fetch(url + "login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userCredentials),
  })
    .then((res) => res.json())
    .then(({ token, msg }) => {
      if (msg) {
        return console.error(msg);
      }

      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(console.error);
});

function handleCredentialResponse(response) {
  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(console.warn);
}
