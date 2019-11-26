import React from "react";

export const MockCreate = jest.fn();

MockCreate.mockReturnValue(<div>Mocked Create</div>);

const mock = jest.fn().mockImplementation(MockCreate);

export default mock;
