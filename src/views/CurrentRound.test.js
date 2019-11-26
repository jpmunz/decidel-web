import React from "react";
import { CurrentRound } from "./CurrentRound";
import { render, fireEvent } from "@testing-library/react";

const persistMock = jest.fn();
const setUserNameMock = jest.fn();

const renderComponent = function({
  id = "22",
  finalDecision = false,
  isPersistable = true,
  isCurrentTurn = true,
  request = {},
  currentDeciderName = "Bob"
}) {
  return render(
    <CurrentRound
      id={id}
      finalDecision={finalDecision}
      isPersistable={isPersistable}
      isCurrentTurn={isCurrentTurn}
      request={request}
      currentDeciderName={currentDeciderName}
      persistCurrentRoundRequest={persistMock}
      setCurrentUserNameRequest={setUserNameMock}
    />
  );
};

const renderTest = options =>
  expect(renderComponent(options).asFragment()).toMatchSnapshot();

test("Current user's turn but current round is not persistable", () =>
  renderTest({ isCurrentTurn: true, isPersistable: false }));

test("Current round persisting in progress", () =>
  renderTest({ request: { inProgress: true } }));

test("Current round failed to persist", () =>
  renderTest({ request: { error: "failed" } }));

test("Another user's turn", () => renderTest({ isCurrentTurn: false }));

test("Final decision has been made", () =>
  renderTest({ finalDecision: "The Rock" }));

test("Trigger persisting the current round", () => {
  const component = renderComponent({
    id: "22",
    isPersistable: true,
    isCurrentTurn: true
  });

  expect(component.asFragment()).toMatchSnapshot();

  fireEvent.click(component.getByText("I'm Done"));
  expect(persistMock.mock.calls).toEqual([[{ id: "22" }]]);
});

test("Setting the current user", () => {
  const component = renderComponent({
    isCurrentTurn: false,
    currentDeciderName: "Phil"
  });
  fireEvent.click(component.getByText("That's Me!"));
  expect(setUserNameMock.mock.calls).toEqual([[{ name: "Phil" }]]);
});
