import React from "react";
import { DecisionOptions } from "./DecisionOptions";
import { render, fireEvent } from "@testing-library/react";

const removeMock = jest.fn();
const addMock = jest.fn();
const undoMock = jest.fn();

const renderComponent = function({
  id = "22",
  options = [{ title: "option1" }, { title: "option2" }],
  finalDecision = false,
  isCurrentTurn = true,
  currentUserName = "Bob"
}) {
  return render(
    <DecisionOptions
      id={id}
      options={options}
      finalDecision={finalDecision}
      isCurrentTurn={isCurrentTurn}
      currentUserName={currentUserName}
      removeOption={removeMock}
      addOption={addMock}
      undoOption={undoMock}
    />
  );
};

const renderTest = options =>
  expect(renderComponent(options).asFragment()).toMatchSnapshot();

test("Another user's turn", () => renderTest({ isCurrentTurn: false }));
test("Decision is finalized", () =>
  renderTest({ finalDecision: "Picked Option" }));
test("Disallowing remove on the last option", () =>
  renderTest({ options: [{ title: "option1" }] }));

test("Adding options", () => {
  const component = renderComponent({});

  fireEvent.change(component.getByTestId("add-option"), {
    target: { value: "new option" }
  });
  fireEvent.click(component.getByAltText("add"));

  expect(addMock.mock.calls).toEqual([
    [
      {
        id: "22",
        title: "new option",
        userName: "Bob"
      }
    ]
  ]);
});

test("Removing options", () => {
  const component = renderComponent({
    options: [{ title: "option1" }, { title: "option2" }]
  });

  fireEvent.click(component.getAllByAltText("remove")[0]);
  expect(removeMock.mock.calls).toEqual([
    [
      {
        id: "22",
        optionIndex: 0,
        userName: "Bob"
      }
    ]
  ]);
});

test("Undoing changes", () => {
  const component = renderComponent({
    options: [
      { title: "option1" },
      { title: "option2", isRemoved: true, undoId: "a" },
      { title: "option3", undoId: "b" }
    ]
  });

  fireEvent.click(component.getAllByAltText("undo")[0]);
  fireEvent.click(component.getAllByAltText("undo")[1]);
  expect(undoMock.mock.calls).toEqual([
    [
      {
        id: "22",
        undoId: "a",
        userName: "Bob"
      }
    ],
    [
      {
        id: "22",
        undoId: "b",
        userName: "Bob"
      }
    ]
  ]);
});
