import React from "react";

export const MockHistory = jest.fn();

MockHistory.mockReturnValue(<div>Mocked History</div>);

const mock = jest.fn().mockImplementation(MockHistory);

export default mock;
