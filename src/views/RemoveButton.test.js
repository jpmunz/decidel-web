import React from "react";
import RemoveButton from "./RemoveButton";
import { render } from "@testing-library/react";

test("Basic rendering", () => {
  expect(() => render(<RemoveButton variant="primary" />)).not.toThrow();
});
