/* ================= CHAT SYSTEM ================= */

var chatBtn = document.getElementById("chatToggle");
var chatBox = document.getElementById("chatBox");
var chatMessages = document.getElementById("chatMessages");
var chatInput = document.getElementById("chatInput");
var sendBtn = document.getElementById("sendChatBtn");
var statusLabel = document.getElementById("chatTargetStatus");

var currentUserId = null;
var receiverRole = null;
/* Toggle chat window */

if (chatBtn && chatBox) {
chatBtn.onclick = function () {
chatBox.classList.toggle("d-none");
};
}

/* ================= AUTH ================= */

firebase.auth().onAuthStateChanged(async function(user){

if(!user) return;

currentUserId = user.uid;

if(chatBox){
receiverRole = chatBox.dataset.receiver || null;
}

try{

var userDoc = await db.collection("users").doc(user.uid).get();

if(!userDoc.exists) return;

hospitalId = userDoc.data().hospitalId || null;

/* Set user online */

await db.collection("users").doc(user.uid).update({
online:true,
lastSeen:firebase.firestore.FieldValue.serverTimestamp()
});

/* Start listeners */

listenForMessages();
listenUserStatus();

}catch(e){
console.error(e);
}

});

/* ================= SEND MESSAGE ================= */

if(sendBtn){

sendBtn.onclick = async function(){

if(!chatInput || !hospitalId || !currentUserId) return;

var text = chatInput.value.trim();
if(text === "") return;

var msg = {
text:text,
from:currentUserId,
role: chatBox && chatBox.dataset.role ? chatBox.dataset.role : "",
timestamp:firebase.firestore.FieldValue.serverTimestamp()
};

try{

await db.collection("hospitals")
.doc(hospitalId)
.collection("chat")
.add(msg);

chatInput.value="";

}catch(e){
console.error(e);
}

};

}

/* ================= LISTEN MESSAGES ================= */

function listenForMessages(){

if(!hospitalId || !chatMessages) return;
db.collection("hospitals")
.doc(hospitalId)
.collection("chat")
.orderBy("timestamp","asc")
.onSnapshot(function(snapshot){

chatMessages.innerHTML="";

snapshot.forEach(function(doc){

var data = doc.data();
var isMe = data.from === currentUserId;

var time="";
if(data.timestamp && data.timestamp.toDate){
time = new Date(data.timestamp.toDate()).toLocaleTimeString();
}

var wrapper = document.createElement("div");
wrapper.className = "text-" + (isMe ? "end":"start") + " mb-2";

var badge = document.createElement("span");
badge.className = "badge " + (isMe ? "bg-primary":"bg-secondary");

badge.innerHTML =
(data.text || "") +
"<span style='font-size:0.7rem'> " + time + "</span>";

wrapper.appendChild(badge);
chatMessages.appendChild(wrapper);

});

chatMessages.scrollTop = chatMessages.scrollHeight;

});

}

/* ================= ONLINE STATUS ================= */

function listenUserStatus(){

if(!receiverRole || !statusLabel) return;

db.collection("users")
.where("role","==",receiverRole)
.limit(1)
.onSnapshot(function(snapshot){

if(snapshot.empty) return;

var user = snapshot.docs[0].data();

if(user.online){
statusLabel.innerText="Online";
statusLabel.className="badge bg-success";
}else{
statusLabel.innerText="Offline";
statusLabel.className="badge bg-secondary";
}

});

}

/* ================= OFFLINE WHEN TAB CLOSE ================= */

window.addEventListener("beforeunload",function(){

if(!currentUserId) return;

db.collection("users")
.doc(currentUserId)
.update({
online:false,
lastSeen:firebase.firestore.FieldValue.serverTimestamp()
});

});
