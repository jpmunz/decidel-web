import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ListInput from "./ListInput";

const onChangeMock = jest.fn();

const renderComponent = function({
  numInitialOptions = null,
  disabled = false,
  addMessage = "add new"
}) {
  return render(
    <ListInput
      numInitialOptions={numInitialOptions}
      disabled={disabled}
      addMessage={addMessage}
      onChange={onChangeMock}
    />
  );
};

const renderTest = options =>
  expect(renderComponent(options).asFragment()).toMatchSnapshot();

test("Disabling input", () => renderTest({ disabled: true }));
test("Setting more initial options", () =>
  renderTest({ numInitialOptions: 2 }));

test("Adding and removing options", () => {
  const component = renderComponent({ numInitialOptions: 1 });

  fireEvent.change(component.getAllByTestId("list-input-option")[0], {
    target: { value: "Option 1" }
  });

  expect(onChangeMock.mock.calls).toEqual([[["Option 1"]]]);

  fireEvent.change(component.getByAltText("add-another"), {
    target: { value: "New Option" }
  });

  expect(onChangeMock.mock.calls).toEqual([
    [["Option 1"]],
    [["Option 1", "New Option"]]
  ]);

  fireEvent.click(component.getAllByAltText("remove")[0]);

  expect(onChangeMock.mock.calls).toEqual([
    [["Option 1"]],
    [["Option 1", "New Option"]],
    [["New Option"]]
  ]);
});
