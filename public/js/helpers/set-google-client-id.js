let url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/env/google-client-id"
  : "https://chap-app-mgxm.onrender.com/api/env/google-client-id";

const gIdOnload = document.getElementById("g_id_onload");

const setGoogleClientId = () =>
  new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        gIdOnload.setAttribute("data-client_id", data.GOOGLE_CLIENT_ID);
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

setGoogleClientId()
  .then(() => {
    const gsiScript = document.createElement("script");
    const authScript = document.createElement("script");

    gsiScript.src = "https://accounts.google.com/gsi/client";
    authScript.src = "./js/auth.js"
    
    document.body.appendChild(gsiScript);
    document.body.appendChild(authScript);
  })
  .catch((err) => console.log(err));
