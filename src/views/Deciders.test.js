import React from "react";
import { Deciders } from "./Deciders";
import { render } from "@testing-library/react";

const renderComponent = function({
  id = "22",
  deciders = [],
  currentUserName = "Bob"
}) {
  return render(
    <Deciders id={id} currentUserName={currentUserName} deciders={deciders} />
  );
};

const renderTest = options =>
  expect(renderComponent(options).asFragment()).toMatchSnapshot();

test("Current user is next", () =>
  renderTest({
    currentUserName: "Jon",
    deciders: [
      { name: "Bob", isNext: false },
      { name: "Jon", isNext: true }
    ]
  }));
test("Another user is next", () =>
  renderTest({
    currentUserName: "Bob",
    deciders: [
      { name: "Bob", isNext: false },
      { name: "Jon", isNext: true }
    ]
  }));
