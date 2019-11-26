import React from "react";
import { render } from "@testing-library/react";
import RoundHistory from "./RoundHistory";

test("Basic rendering", () => {
  expect(
    render(
      <RoundHistory
        history={[
          { userName: "Bob", action: "ADDED", title: "option1" },
          { userName: "Bob", action: "REMOVED", title: "option2" }
        ]}
      />
    ).asFragment()
  ).toMatchSnapshot();
});
