import {
  hasDecidel,
  getTitle,
  getDeciders,
  getOptions,
  getCurrentDeciderName,
  isCurrentTurn,
  getCurrentRoundHistory,
  getPreviousRoundsHistory,
  isPersistable,
  getCurrentUserName,
  getFinalDecision,
  getAsyncRequest
} from "./index";
import { produce } from "immer";

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
          { title: "Memento" },
          { title: "Flash Gordon", isRemoved: true },
          { title: "Big", undoId: "1" },
          { title: "The French Connection", isRemoved: true, undoId: "2" }
        ],
        history: [
          { userName: "Bob", action: "REMOVED", title: "Flash Gordon" },
          {
            userName: "Jon",
            action: "REMOVED",
            title: "The French Connection",
            undoId: "2"
          },
          { userName: "Jon", action: "ADDED", title: "Big", undoId: "1" }
        ]
      }
    }
  },
  asyncRequests: { items: { r1: { inProgress: true } } }
}));

test("hasDecidel true", () => {
  expect(hasDecidel(initialState, "a1")).toBe(true);
});

test("hasDecidel false", () => {
  expect(hasDecidel(initialState, "a2")).toBe(false);
});

test("getTitle", () => {
  expect(getTitle(initialState, "a1")).toBe("What movie to watch");
});

test("getDeciders ", () => {
  expect(getDeciders(initialState, "a1")).toEqual([
    { name: "Jon", isNext: true },
    { name: "Bob", isNext: false }
  ]);
});

test("getOptions", () => {
  expect(getOptions(initialState, "a1")).toEqual([
    { title: "The Rock" },
    { title: "Memento" },
    { title: "Flash Gordon", isRemoved: true },
    { title: "Big", undoId: "1" },
    { title: "The French Connection", isRemoved: true, undoId: "2" }
  ]);
});

test("getCurrentRoundHistory", () => {
  expect(getCurrentRoundHistory(initialState, "a1")).toEqual([
    {
      userName: "Jon",
      action: "REMOVED",
      title: "The French Connection",
      undoId: "2"
    },
    { userName: "Jon", action: "ADDED", title: "Big", undoId: "1" }
  ]);
});

test("getPreviousRoundsHistory", () => {
  expect(getPreviousRoundsHistory(initialState, "a1")).toEqual([
    { userName: "Bob", action: "REMOVED", title: "Flash Gordon" }
  ]);
});

test("getCurrentDeciderName", () => {
  expect(getCurrentDeciderName(initialState, "a1")).toBe("Jon");
});

test("getCurrentUserName", () => {
  expect(getCurrentUserName(initialState)).toBe("Jon");
});

test("getAsyncRequest", () => {
  expect(getAsyncRequest(initialState, "r1")).toEqual({ inProgress: true });
});

test("isCurrentTurn true", () => {
  expect(isCurrentTurn(initialState, "a1")).toBe(true);
});

test("isCurrentTurn false", () => {
  const state = produce(initialState, draft => {
    draft.currentUser = { name: "Bob" };
  });
  expect(isCurrentTurn(state, "a1")).toBe(false);
});

test("isPersistable true", () => {
  expect(isPersistable(initialState, "a1")).toBe(true);
});

test("isPersistable false", () => {
  const state = produce(initialState, draft => {
    draft.decidels.items.a1.history = [
      { userName: "Bob", action: "REMOVED", title: "Flash Gordon" }
    ];
  });
  expect(isPersistable(state, "a1")).toBe(false);
});

test("getFinalDecision", () => {
  const state = produce(initialState, draft => {
    draft.decidels.items.a1.options = [
      { title: "The Rock" },
      { title: "Memento", isRemoved: true },
      { title: "Flash Gordon", isRemoved: true }
    ];
  });

  expect(getFinalDecision(state, "a1")).toBe("The Rock");
});

test("getFinalDecision not finalized", () => {
  expect(getFinalDecision(initialState, "a1")).toBe(false);
});
