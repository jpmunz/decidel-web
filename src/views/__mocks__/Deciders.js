import React from "react";

export const MockDeciders = jest.fn();

MockDeciders.mockReturnValue(<div>Mocked Deciders</div>);

const mock = jest.fn().mockImplementation(MockDeciders);

export default mock;
