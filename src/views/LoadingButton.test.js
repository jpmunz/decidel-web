import React from "react";
import LoadingButton from "./LoadingButton";
import { render } from "@testing-library/react";

test("Render loading state", () => {
  expect(
    render(
      <LoadingButton loading={true} text="Action" variant="primary" />
    ).asFragment()
  ).toMatchSnapshot();
});

test("Render default state", () => {
  expect(
    render(
      <LoadingButton loading={false} text="Action" variant="primary" />
    ).asFragment()
  ).toMatchSnapshot();
});
