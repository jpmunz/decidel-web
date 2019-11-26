import React from "react";
import { Create } from "./Create";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

const createMock = jest.fn();

const renderComponent = function({ requestId = "22", request = {} }) {
  return render(
    <BrowserRouter>
      <Create
        requestId={requestId}
        request={request}
        createDecidelRequest={createMock}
      />
    </BrowserRouter>
  );
};

const renderTest = options =>
  expect(renderComponent(options).asFragment()).toMatchSnapshot();

test("Create form submission", () => {
  const component = renderComponent({ requestId: "22" });

  fireEvent.change(component.getByLabelText("What's your name?"), {
    target: { value: "Jon" }
  });
  fireEvent.change(component.getByLabelText("What are you trying to decide?"), {
    target: { value: "What to Eat" }
  });

  const listInputs = component.getAllByTestId("list-input-option");
  fireEvent.change(listInputs[0], { target: { value: "Fish" } });
  fireEvent.change(listInputs[1], { target: { value: "Veggies" } });
  fireEvent.change(listInputs[2], { target: { value: "Bob" } });

  fireEvent.click(component.getByText("Create"));

  expect(createMock.mock.calls).toEqual([
    [
      {
        decidel: {
          title: "What to Eat",
          deciders: [{ name: "Jon" }, { name: "Bob", isNext: true }],
          history: [],
          options: [{ title: "Fish" }, { title: "Veggies" }]
        },
        requestId: "22"
      }
    ]
  ]);
});

test("Blank create form", () => renderTest({}));
test("Create form submitting", () =>
  renderTest({ request: { inProgress: true } }));
test("Create form submission success", () =>
  renderTest({ request: { success: true, response: { id: "a1" } } }));
test("Create form submission error", () =>
  renderTest({ request: { error: "failed" } }));
