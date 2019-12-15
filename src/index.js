import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import createSagaMiddleware from "redux-saga";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { rootReducer, rootSaga } from "src/state";
import App from "src/views/App";

const sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware(), sagaMiddleware];

if (process.env.NODE_ENV !== "production") {
  const reduxLogger = require("redux-logger");
  middleware.push(reduxLogger.logger);
}

const store = configureStore({
  reducer: rootReducer,
  middleware: middleware
});

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
