class Message {
  constructor(uid, userName, message) {
    this.uid = uid;
    this.userName = userName;
    this.message = message;
  }
}

export default class Chat {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  get allMessages() {
    return this.messages;
  }

  get lastTenMessages() {
    return this.messages.splice(0, 10);
  }

  get userArray() {
    return Object.values(this.users);
  }

  sendMessage(uid, userName, message) {
    this.messages.push(new Message(uid, userName, message));
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(uid) {
    delete this.users[uid];
  }
}
