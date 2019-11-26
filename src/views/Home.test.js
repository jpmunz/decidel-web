import React from "react";
import Home from "./Home";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

test("Basic rendering", () => {
  expect(() =>
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )
  ).not.toThrow();
});
