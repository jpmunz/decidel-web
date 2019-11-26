export const mockFetchDecidel = jest.fn();
export const mockCreateDecidel = jest.fn();
export const mockPersistDecidel = jest.fn();
export const mockFetchCurrentUser = jest.fn();
export const mockSetCurrentUserName = jest.fn();

const mock = jest.fn().mockImplementation(() => ({
  fetchDecidel: mockFetchDecidel,
  createDecidel: mockCreateDecidel,
  persistDecidel: mockPersistDecidel,
  fetchCurrentUser: mockFetchCurrentUser,
  setCurrentUserName: mockSetCurrentUserName
}));

export default mock;
