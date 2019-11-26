import React from "react";
import { History } from "./History";
import { render } from "@testing-library/react";

const renderComponent = function({
  id = "22",
  currentRoundHistory = [],
  previousRoundsHistory = [],
  currentUserName = "Bob"
}) {
  return render(
    <History
      id={id}
      currentRoundHistory={currentRoundHistory}
      previousRoundsHistory={previousRoundsHistory}
      currentUserName={currentUserName}
    />
  );
};

const renderTest = options =>
  expect(renderComponent(options).asFragment()).toMatchSnapshot();

test("No history available", () => renderTest({}));

test("Current round history only", () =>
  renderTest({
    currentRoundHistory: [
      { userName: "Bob", action: "ADDED", title: "option1" },
      { userName: "Bob", action: "REMOVED", title: "option2" }
    ]
  }));
test("Previous rounds history only", () =>
  renderTest({
    previousRoundsHistory: [
      { userName: "Bob", action: "ADDED", title: "option4" },
      { userName: "Jon", action: "REMOVED", title: "option5" }
    ]
  }));

test("Full history available", () =>
  renderTest({
    currentRoundHistory: [
      { userName: "Bob", action: "ADDED", title: "option1" },
      { userName: "Bob", action: "REMOVED", title: "option2" }
    ],
    previousRoundsHistory: [
      { userName: "Bob", action: "ADDED", title: "option4" },
      { userName: "Jon", action: "REMOVED", title: "option5" }
    ]
  }));
