const expect = require("expect");
const { Users } = require("./users");

describe("Users class", () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "mike",
        room: "node course"
      },
      {
        id: "2",
        name: "jean",
        room: "react course"
      },
      {
        id: "3",
        name: "julie",
        room: "node course"
      }
    ];
  });
  it("Should add new user", () => {
    const users = new Users();
    const user = { id: "123", name: "ygor", room: "millionaire" };
    users.addUser(user.id, user.name, user.room);

    expect(users.users).toHaveLength(1);
    expect(users).toBeInstanceOf(Users);
    expect(users.users[0]).toStrictEqual(user);
  });
  it("Should remove a user", () => {
    const res = users.removeUser("1");
    expect(res).toEqual({
      id: "1",
      name: "mike",
      room: "node course"
    });
    expect(users.users).toHaveLength(2);
  });
  it("Should not remove user", () => {
    const res = users.removeUser("44");
    expect(res).toBeFalsy();
    expect(users.users).toHaveLength(3);
  });
  it("Should get a user", () => {
    const res = users.getUser("2");
    expect(res).toEqual(users.users[1]);
  });
  it("Should not get a user", () => {
    const res = users.getUser("44");
    expect(res).toBeFalsy();
  });
  it("Should return names for node course", () => {
    const res = users.getUserList("node course");
    expect(res).toHaveLength(2);
    expect(res).toContain("mike");
    expect(res).toContain("julie");
  });
  it("Should return names for react course", () => {
    const res = users.getUserList("react course");
    expect(res).toHaveLength(1);
    expect(res).toContain("jean");
  });
  it("Should return false if username already exist in the selected room", () => {
    const res = users.isUniqueUsername("node course", "mike");
    expect(res).toBeFalsy();
  });
  it("Should return true if username is unique in the selected room", () => {
    const res = users.isUniqueUsername("node course", "Ygor");
    expect(res).toBeTruthy();
  });
  it("Should return an array containing all the active groups", () => {
    const res = users.getRoomsList();
    expect(Array.isArray(res)).toBeTruthy();
    expect(res).toHaveLength(2);
    expect(res).toContain("node course");
    expect(res).toContain("react course");
  });
});
