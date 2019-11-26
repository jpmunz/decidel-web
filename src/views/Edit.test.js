import React from "react";
import { Edit } from "./Edit";
import { render } from "@testing-library/react";

jest.mock("./History");
jest.mock("./DecisionOptions");
jest.mock("./CurrentRound");

jest.mock("./Deciders");

const fetchDecidelMock = jest.fn();
const fetchCurrentUserMock = jest.fn();

const renderComponent = function({
  id = "22",
  title = "What movie to watch",
  finalDecision = false,
  request = {},
  currentUserName = "Bob",
  decidelLoaded = true
}) {
  return render(
    <Edit
      id={id}
      title={title}
      finalDecision={finalDecision}
      currentUserName={currentUserName}
      decidelLoaded={decidelLoaded}
      request={request}
      fetchDecidelRequest={fetchDecidelMock}
      fetchCurrentUserRequest={fetchCurrentUserMock}
    />
  );
};

const renderTest = options =>
  expect(renderComponent(options).asFragment()).toMatchSnapshot();

test("Initial mount", () => renderTest({ decidelLoaded: false }));
test("Fetching in progress", () =>
  renderTest({ request: { inProgress: true } }));
test("Decision finalized", () => renderTest({ finalDecision: "The Rock" }));
test("Fetch failed", () => renderTest({ request: { error: "failed" } }));

test("Fetches are made on mount", () => {
  renderComponent({});

  expect(fetchDecidelMock.mock.calls).toEqual([[{ id: "22" }]]);
  expect(fetchCurrentUserMock.mock.calls).toEqual([[]]);
});
