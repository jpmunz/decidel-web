import React from "react";

export const MockHome = jest.fn();

MockHome.mockReturnValue(<div>Mocked Home</div>);

const mock = jest.fn().mockImplementation(MockHome);

export default mock;
