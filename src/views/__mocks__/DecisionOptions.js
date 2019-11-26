import React from "react";

export const MockDecisionOptions = jest.fn();

MockDecisionOptions.mockReturnValue(<div>Mocked DecisionOptions</div>);

const mock = jest.fn().mockImplementation(MockDecisionOptions);

export default mock;
