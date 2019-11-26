import {
  getOptions,
  getCurrentRoundHistory,
  rootReducer,
  addOption,
  removeOption,
  undoOption
} from "./index";
import { produce } from "immer";

jest.mock("uuid/v4", () => ({
  __esModule: true,
  default: () => "v4id"
}));

const initialState = produce({}, () => ({
  currentUser: { name: "Jon" },
  decidels: {
    items: {
      a1: {
        title: "What movie to watch",
        deciders: [
          { name: "Jon", isNext: true },
          { name: "Bob", isNext: false }
        ],
        options: [
          { title: "The Rock" },
          { title: "Flash Gordon" },
          { title: "Memento", isRemoved: true, undoId: "1" },
          { title: "Big", undoId: "2" }
        ],
        history: [
          { userName: "Jon", action: "REMOVED", title: "Memento", undoId: "1" },
          { userName: "Jon", action: "ADDED", title: "Big", undoId: "2" }
        ]
      }
    }
  },
  asyncRequests: { items: { r1: { inProgress: true } } }
}));

test("addOption", () => {
  const updatedState = rootReducer(
    initialState,
    addOption({ id: "a1", userName: "Test", title: "New Option" })
  );

  expect(getOptions(updatedState, "a1")).toEqual([
    { title: "The Rock" },
    { title: "Flash Gordon" },
    { title: "Memento", isRemoved: true, undoId: "1" },
    { title: "Big", undoId: "2" },
    { title: "New Option", undoId: "v4id" }
  ]);

  expect(getCurrentRoundHistory(updatedState, "a1")).toEqual([
    { userName: "Jon", action: "REMOVED", title: "Memento", undoId: "1" },
    { userName: "Jon", action: "ADDED", title: "Big", undoId: "2" },
    { userName: "Test", action: "ADDED", title: "New Option", undoId: "v4id" }
  ]);
});

test("removeOption", () => {
  const updatedState = rootReducer(
    initialState,
    removeOption({ id: "a1", optionIndex: 1, userName: "Test" })
  );

  expect(getOptions(updatedState, "a1")).toEqual([
    { title: "The Rock" },
    { title: "Flash Gordon", isRemoved: true, undoId: "v4id" },
    { title: "Memento", isRemoved: true, undoId: "1" },
    { title: "Big", undoId: "2" }
  ]);

  expect(getCurrentRoundHistory(updatedState, "a1")).toEqual([
    { userName: "Jon", action: "REMOVED", title: "Memento", undoId: "1" },
    { userName: "Jon", action: "ADDED", title: "Big", undoId: "2" },
    {
      userName: "Test",
      action: "REMOVED",
      title: "Flash Gordon",
      undoId: "v4id"
    }
  ]);
});

test("undoOption", () => {
  let updatedState = rootReducer(
    initialState,
    undoOption({ id: "a1", undoId: "1" })
  );

  expect(getOptions(updatedState, "a1")).toEqual([
    { title: "The Rock" },
    { title: "Flash Gordon" },
    { title: "Memento", isRemoved: false },
    { title: "Big", undoId: "2" }
  ]);

  expect(getCurrentRoundHistory(updatedState, "a1")).toEqual([
    { userName: "Jon", action: "ADDED", title: "Big", undoId: "2" }
  ]);

  updatedState = rootReducer(
    updatedState,
    undoOption({ id: "a1", undoId: "2" })
  );

  expect(getOptions(updatedState, "a1")).toEqual([
    { title: "The Rock" },
    { title: "Flash Gordon" },
    { title: "Memento", isRemoved: false }
  ]);

  expect(getCurrentRoundHistory(updatedState, "a1")).toEqual([]);
});
