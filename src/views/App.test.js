import React from "react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { MockCreate } from "./Create";
import { MockEdit } from "./Edit";

jest.mock("./Home");
jest.mock("./Create");
jest.mock("./Edit");

jest.mock("uuid/v4", () => ({
  __esModule: true,
  default: () => "v4id"
}));

const renderComponent = function(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
};

test("Default route", () => {
  expect(renderComponent("/")).toMatchSnapshot();
});

test("Create route", () => {
  expect(renderComponent("/create")).toMatchSnapshot();
  expect(MockCreate.mock.calls).toEqual([[{ requestId: "v4id" }, {}]]);
});

test("Edit route", () => {
  expect(renderComponent("/view/23")).toMatchSnapshot();
  expect(MockEdit.mock.calls).toEqual([[{ id: "23" }, {}]]);
});
