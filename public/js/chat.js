const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://chap-app-mgxm.onrender.com/api/auth/";

let user = null;
let socket = null;

// ? HTML References
const btnSend = document.getElementById("btn-send");
const userList = document.getElementById("user-list");
const logoutBtn = document.getElementById("logout-btn");
const currentUser = document.getElementById("current-user");
const messageTextarea = document.getElementById("message-textarea");
const conversationContainer = document.getElementById("conversation-container");

const main = async () => {
  await validateJWT();
};

// ? Auth Validation
const validateJWT = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location = "index.html";
    throw new Error("No token");
  }

  try {
    const res = await fetch(url, { headers: { "x-token": token } });

    if (res.status !== 200) {
      window.location = "index.html";
      throw new Error("Unathorized");
    }

    const { user: newUser, token: newToken } = await res.json();

    localStorage.setItem("token", newToken);
    user = newUser;
    document.title = user.name + " | Global Chat";
    await connectSocket();
  } catch (error) {
    window.location = "index.html";
    throw new Error(error);
  }
};

// ? Socket handler function
const connectSocket = async () => {
  socket = io({
    extraHeaders: { "x-token": localStorage.getItem("token") },
  });

  // ? Listen Events
  socket.on("message-received", drawMessages);

  socket.on("user-connected", drawUserList);

  socket.on("private-message", (payload) => {
    console.log({ private: payload });
  });
};

/**************************** Listeners *******************************/
messageTextarea.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    // Prevents the default behavior (new line)
    event.preventDefault();

    const message = messageTextarea.value.trim();
    if (message.length === 0) return;

    socket.emit("send-message", { /* uid: "", */ message });

    messageTextarea.value = "";

    resizeTextarea();
  }
});

btnSend.addEventListener("click", () => {
  const message = messageTextarea.value.trim();
  if (message.length === 0) return;

  socket.emit("send-message", { /* uid: "", */ message });

  messageTextarea.value = "";

  resizeTextarea();
});

logoutBtn.addEventListener("click", () => {
  if (user.google) {
    google.accounts.id.revoke(user.email);
  }

  localStorage.clear();
  location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  if (messageTextarea.value.trim().length === 0) {
    messageTextarea.value = "";
  }

  messageTextarea.addEventListener("input", resizeTextarea);

  resizeTextarea();
});

/*************************** Util Functions ***************************/
const drawUserList = (users = []) => {
  let currentUserHtml = "";
  let usersListhtml = "";

  users.forEach(({ uid, name, image }) => {
    if (uid === user.uid) {
      currentUserHtml = `
      <img
        src="${image}"
        alt="User Avatar"
        class="current-user-avatar rounded-circle me-md-2"
      />
      <strong class="d-none d-md-block text-truncate">${name}</strong>
      `;
    } else {
      usersListhtml += `
      <li class="w-100">
        <a 
          href="#"
          class="d-flex align-items-center nav-link py-3 py-md-2 border-bottom rounded-0 border-bottom-md-none link-body-emphasis"
        >
          <img
            src="${image}"
            alt="User Avatar"
            width="32"
            height="32"
            class="rounded-circle me-2"
          />
          <p class="d-none d-md-block m-0 text-truncate">${name}</p>
        </a>
      </li>
      `;
    }
  });

  currentUser.innerHTML = currentUserHtml;
  userList.innerHTML = usersListhtml;
};

const drawMessages = (messages = []) => {
  let messagesHtml = "";

  messages.forEach(({ uid, message }) => {
    if (uid === user.uid) {
      messagesHtml += `
      <div id="chat-message" class="d-flex justify-content-end">
        <span
          class="msg-badge-sent badge bg-primary-subtle border border-primary-subtle text-primary-emphasis"
        >
          ${message}
        </span>
      </div>
      `;
    } else {
      messagesHtml += `
      <div id="chat-message" class="d-flex justify-content-start">
        <span
          class="msg-badge-received badge bg-secondary-subtle border border-secondary-subtle text-secondary-emphasis"
        >
          ${message}
        </span>
      </div>
      `;
    }
  });

  conversationContainer.innerHTML = messagesHtml;

  scrollToBottom();
};

const resizeTextarea = () => {
  // Reset height to recalculate
  messageTextarea.style.height = "36px";
  let newHeight = messageTextarea.scrollHeight;

  // Limit the height to the maximum height defined in CSS
  const maxHeight = parseInt(
    window.getComputedStyle(messageTextarea).maxHeight
  );
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    // Show scrollbar if height exceeds maxHeight
    messageTextarea.style.overflowY = "scroll";
  } else {
    // Hide scrollbar if within maxHeight
    messageTextarea.style.overflowY = "hidden";
  }

  // Adjust the messageTextarea height
  messageTextarea.style.height = newHeight + "px";
};

const scrollToBottom = () => {
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
};

// ? Main Function
main();
