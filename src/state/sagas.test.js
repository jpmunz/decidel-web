import {
  createDecidelRequest,
  persistCurrentRoundRequest,
  fetchDecidelRequest,
  fetchCurrentUserRequest,
  setCurrentUserNameRequest,
  getAsyncRequest,
  getTitle,
  rootReducer,
  rootSaga,
  getCurrentDeciderName,
  getCurrentUserName
} from "./index";
import SagaTester from "redux-saga-tester";
import {
  mockFetchDecidel,
  mockCreateDecidel,
  mockPersistDecidel,
  mockFetchCurrentUser,
  mockSetCurrentUserName
} from "src/api";
import { produce } from "immer";

jest.mock("src/api");

const startTest = (action, initialState) => {
  const sagaTester = new SagaTester({
    initialState,
    reducers: rootReducer
  });

  sagaTester.start(rootSaga);
  sagaTester.dispatch(action);

  return sagaTester;
};

test("fetchDecidelRequest success", async () => {
  const fetchedDecidel = { id: "a1", title: "What to eat" };
  mockFetchDecidel.mockResolvedValue(fetchedDecidel);

  const sagaTester = startTest(fetchDecidelRequest({ id: "a1" }));
  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/success");

  expect(getTitle(sagaTester.getState(), "a1")).toBe("What to eat");
  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    success: true,
    response: fetchedDecidel
  });
});

test("fetchDecidelRequest error", async () => {
  mockFetchDecidel.mockRejectedValue("failed");

  const sagaTester = startTest(fetchDecidelRequest({ id: "a1" }));
  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/error");

  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    error: "failed"
  });
});

test("fetchDecidelRequest cached", async () => {
  const sagaTester = startTest(fetchDecidelRequest({ id: "a1" }), {
    decidels: {
      items: {
        a1: "cached"
      }
    }
  });

  expect(sagaTester.wasCalled("asyncRequests/start")).toBe(false);
});

test("createDecidelRequest success", async () => {
  const createdDecidel = { id: "a1", title: "What to eat" };
  mockCreateDecidel.mockImplementationOnce(body => Promise.resolve(body));

  const sagaTester = startTest(
    createDecidelRequest({ requestId: "22", decidel: createdDecidel })
  );
  expect(getAsyncRequest(sagaTester.getState(), "22")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/success");

  expect(getTitle(sagaTester.getState(), "a1")).toBe("What to eat");
  expect(getAsyncRequest(sagaTester.getState(), "22")).toEqual({
    success: true,
    response: createdDecidel
  });
});

test("createDecidelRequest error", async () => {
  mockCreateDecidel.mockRejectedValue("failed");

  const sagaTester = startTest(
    createDecidelRequest({ requestId: "a1", decidel: {} })
  );
  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/error");

  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    error: "failed"
  });
});

const sampleDecidel = produce({}, () => ({
  id: "a1",
  title: "What to eat",
  deciders: [
    { name: "Jon", isNext: true },
    { name: "Bob", isNext: false }
  ],
  options: [
    { title: "a", isRemoved: false },
    { title: "b", isRemoved: false },
    { title: "c", isRemoved: true, undoId: "1" }
  ],
  history: [{ userName: "Jon", undoId: "1", action: "REMOVED", option: "c" }]
}));

test("persistCurrentRound success", async () => {
  mockPersistDecidel.mockImplementationOnce(body => Promise.resolve(body));

  const sagaTester = startTest(persistCurrentRoundRequest({ id: "a1" }), {
    decidels: {
      items: {
        a1: sampleDecidel
      }
    }
  });

  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/success");

  const expectedAfterPersist = produce(sampleDecidel, draft => {
    delete draft.options[2].undoId;
    delete draft.history[0].undoId;
    draft.deciders = [
      { name: "Jon", isNext: false },
      { name: "Bob", isNext: true }
    ];
  });

  expect(getCurrentDeciderName(sagaTester.getState(), "a1")).toBe("Bob");
  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    success: true,
    response: expectedAfterPersist
  });
});

test("persistCurrentRound error", async () => {
  mockPersistDecidel.mockRejectedValue("failed");

  const sagaTester = startTest(persistCurrentRoundRequest({ id: "a1" }), {
    decidels: {
      items: {
        a1: sampleDecidel
      }
    }
  });

  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/error");

  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    error: "failed"
  });
});

test("persistCurrentRound invalid decidel", async () => {
  const sagaTester = startTest(persistCurrentRoundRequest({ id: "a1" }));

  expect(getAsyncRequest(sagaTester.getState(), "a1")).toEqual({
    error: "Invalid decidel"
  });
});

test("fetchCurrentUserRequest success", async () => {
  const response = { name: "Jon" };
  mockFetchCurrentUser.mockResolvedValue(response);

  const sagaTester = startTest(fetchCurrentUserRequest());
  expect(getAsyncRequest(sagaTester.getState(), "currentUser")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/success");

  expect(getCurrentUserName(sagaTester.getState())).toBe("Jon");
  expect(getAsyncRequest(sagaTester.getState(), "currentUser")).toEqual({
    success: true,
    response
  });
});

test("fetchCurrentUserRequest error", async () => {
  mockFetchCurrentUser.mockRejectedValue("failed");

  const sagaTester = startTest(fetchCurrentUserRequest());
  expect(getAsyncRequest(sagaTester.getState(), "currentUser")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/error");

  expect(getCurrentUserName(sagaTester.getState())).toBeFalsy();
  expect(getAsyncRequest(sagaTester.getState(), "currentUser")).toEqual({
    error: "failed"
  });
});

test("setCurrentUserNameRequest success", async () => {
  mockSetCurrentUserName.mockImplementationOnce(name =>
    Promise.resolve({ name: name })
  );

  const sagaTester = startTest(setCurrentUserNameRequest({ name: "Jon" }));
  expect(getAsyncRequest(sagaTester.getState(), "currentUser")).toEqual({
    inProgress: true
  });

  await sagaTester.waitFor("asyncRequests/success");

  expect(getCurrentUserName(sagaTester.getState())).toBe("Jon");
  expect(getAsyncRequest(sagaTester.getState(), "currentUser")).toEqual({
    success: true,
    response: { name: "Jon" }
  });
});

test("setCurrentUserNameRequest error", async () => {
  mockSetCurrentUserName.mockRejectedValue("failed");

  const sagaTester = startTest(setCurrentUserNameRequest({ name: "Bob" }));
  expect(getAsyncRequest(sagaTester.getState(), "currentUser")).toEqual({
    inProgress: true
  });
});
