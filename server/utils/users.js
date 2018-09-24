class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const removedUser = this.users.find(user => user.id === id);
    if (removedUser) {
      this.users = this.users.filter(user => user.id !== id);
    }
    return removedUser;
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }
  getUserList(room) {
    const users = this.users.filter(user => user.room === room);
    const namesArr = users.map(user => user.name);
    return namesArr;
  }

  isUniqueUsername(room, name) {
    const usersList = this.getUserList(room);
    if (usersList.length > 0) {
      const userNameCaseInsensitive = name.toUpperCase();
      const usernames = usersList.map(username => username.toUpperCase());
      const isUnique = usernames.find(
        username => userNameCaseInsensitive === username
      );
      if (isUnique) {
        return false;
      }
      return true;
    }
    return true;
  }
  getRoomsList() {
    const rooms = [];
    this.users.forEach(user => {
      if (!rooms.includes(user.room)) {
        rooms.push(user.room);
      }
    });
    return rooms;
  }
}

module.exports = { Users };
