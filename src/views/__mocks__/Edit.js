import React from "react";

export const MockEdit = jest.fn();

MockEdit.mockReturnValue(<div>Mocked Edit</div>);

const mock = jest.fn().mockImplementation(MockEdit);

export default mock;
