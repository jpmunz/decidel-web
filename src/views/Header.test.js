import React from "react";
import Header from "./Header";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

test("Basic rendering", () => {
  expect(() =>
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
  ).not.toThrow();
});
