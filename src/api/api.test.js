import API from "./index";
import Cookies from "js-cookie";

jest.mock("js-cookie");

const api = new API();

test("Fetching a decidel", async () => {
  const decidel = { data: "decidel" };

  fetch.once(JSON.stringify(decidel));
  const result = await api.fetchDecidel("a1");

  expect(result).toEqual(decidel);
  expect(fetch.mock.calls).toEqual([
    [
      "https://api.test/v1/decidels/a1",
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    ]
  ]);
});

test("Creating a decidel", async () => {
  const decidel = { data: "decidel" };

  fetch.once(JSON.stringify(decidel));
  const result = await api.createDecidel(decidel);

  expect(result).toEqual(decidel);
  expect(fetch.mock.calls).toEqual([
    [
      "https://api.test/v1/decidels/",
      {
        method: "POST",
        body: JSON.stringify(decidel),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ]
  ]);
});

test("Persisting a decidel", async () => {
  const decidel = { id: "a1", data: "decidel" };

  fetch.once(JSON.stringify(decidel));
  const result = await api.persistDecidel(decidel);

  expect(result).toEqual(decidel);
  expect(fetch.mock.calls).toEqual([
    [
      "https://api.test/v1/decidels/a1",
      {
        method: "PUT",
        body: JSON.stringify(decidel),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ]
  ]);
});

test("Fetching the current user", async () => {
  Cookies.get.mockReturnValue("Jon");

  const user = await api.fetchCurrentUser();

  expect(user).toEqual({ name: "Jon" });
});

test("Setting current user name", async () => {
  const user = await api.setCurrentUserName("Bob");

  expect(user).toEqual({ name: "Bob" });
  expect(Cookies.set.mock.calls).toEqual([["currentUserName", "Bob"]]);
});
