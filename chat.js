const chatBtn = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatBox");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendChatBtn");

let currentUserId = null;
let receiverRole = null; // "provider" or "physician"

// Toggle Chat UI
chatBtn.onclick = () => chatBox.classList.toggle("d-none");

// Auth Check
firebase.auth().onAuthStateChanged((user) => {
  if (!user) return;
  currentUserId = user.uid;
  receiverRole = chatBox.getAttribute("data-receiver");
  listenForMessages();
});

sendBtn.onclick = async () => {
  const text = chatInput.value.trim();
  if (!text) return;
  const msg = {
    text,
    from: currentUserId,
    toRole: receiverRole,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection("chat").add(msg);
  chatInput.value = "";
};

function listenForMessages() {
  db.collection("chat")
    .orderBy("timestamp", "asc")
    .onSnapshot((snapshot) => {
      chatMessages.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const isMe = data.from === currentUserId;
        const time = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString() : '';
        chatMessages.innerHTML += `
          <div class="text-${isMe ? 'end' : 'start'} mb-2">
            <span class="badge ${isMe ? 'bg-primary' : 'bg-secondary'}">${data.text} <span style="font-size: 0.7rem;">✔️ ${time}</span></span>
          </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    });
}
