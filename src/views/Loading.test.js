import React from "react";
import Loading from "./Loading";
import { render } from "@testing-library/react";

test("Basic rendering", () => {
  expect(() => render(<Loading />)).not.toThrow();
});
