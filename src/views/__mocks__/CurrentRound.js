import React from "react";

export const MockCurrentRound = jest.fn();

MockCurrentRound.mockReturnValue(<div>Mocked CurrentRound</div>);

const mock = jest.fn().mockImplementation(MockCurrentRound);

export default mock;
