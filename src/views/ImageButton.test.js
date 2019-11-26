import React from "react";
import ImageButton from "./ImageButton";
import { render } from "@testing-library/react";

test("Basic rendering", () => {
  expect(() =>
    render(<ImageButton src="example.com" alt="alt-text" variant="primary" />)
  ).not.toThrow();
});
