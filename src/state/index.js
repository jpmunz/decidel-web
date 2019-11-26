import { createAction, createSlice } from "@reduxjs/toolkit";
import v4 from "uuid/v4";
import { combineReducers } from "redux";
import { put, call, takeLatest, takeEvery, select } from "redux-saga/effects";
import { produce } from "immer";
import API from "src/api";
import ACTION_TYPES from "src/actionTypes";

const api = new API();

/*
REDUCERS
 */

const asyncRequest = function*(id, responseAction, apiMethod, ...apiArgs) {
  try {
    yield put(asyncRequestsSlice.actions.start({ id }));
    const response = yield call([api, apiMethod], ...apiArgs);
    yield put(responseAction({ response }));
    yield put(asyncRequestsSlice.actions.success({ id, response }));
  } catch (error) {
    yield put(
      asyncRequestsSlice.actions.error({ id, error: error.toString() })
    );
  }
};

const asyncRequestsSlice = createSlice({
  name: "asyncRequests",
  initialState: { items: {} },
  reducers: {
    start(state, action) {
      state.items[action.payload.id] = { inProgress: true };
    },
    error(state, action) {
      state.items[action.payload.id] = {
        error: action.payload.error
      };
    },
    success(state, action) {
      state.items[action.payload.id] = {
        success: true,
        response: action.payload.response
      };
    }
  }
});

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {},
  reducers: {
    loaded(state, action) {
      return {
        name: action.payload.response.name
      };
    }
  }
});

const decidelsSlice = createSlice({
  name: "decidels",
  initialState: { items: {} },
  reducers: {
    loaded(state, action) {
      const { response } = action.payload;
      state.items[response.id] = response;
    },
    addOption(state, action) {
      const { id, title, userName } = action.payload;
      const decidel = state.items[id];
      const undoId = v4();

      decidel.options.push({ title: title, undoId: undoId });
      decidel.history.push({
        userName: userName,
        action: ACTION_TYPES.ADDED,
        title: title,
        undoId: undoId
      });
    },
    removeOption(state, action) {
      const { id, optionIndex, userName } = action.payload;
      const decidel = state.items[id];
      const option = decidel.options[optionIndex];
      const undoId = v4();

      option.isRemoved = true;
      option.undoId = undoId;
      decidel.history.push({
        userName: userName,
        action: ACTION_TYPES.REMOVED,
        title: option.title,
        undoId: undoId
      });
    },
    undoOption(state, action) {
      const { id, undoId } = action.payload;
      const decidel = state.items[id];

      const optionIndex = decidel.options.findIndex(
        option => option.undoId === undoId
      );
      const option = decidel.options[optionIndex];
      if (option.isRemoved) {
        option.isRemoved = false;
        delete option.undoId;
      } else {
        decidel.options.splice(optionIndex, 1);
      }

      const historyIndex = decidel.history.findIndex(
        option => option.undoId === undoId
      );
      decidel.history.splice(historyIndex, 1);
    }
  }
});

export const { addOption, removeOption, undoOption } = decidelsSlice.actions;

export const rootReducer = combineReducers({
  decidels: decidelsSlice.reducer,
  currentUser: currentUserSlice.reducer,
  asyncRequests: asyncRequestsSlice.reducer
});

/*
SELECTORS
 */

function getDecidel(state, id) {
  return state.decidels.items[id] || {};
}

export function hasDecidel(state, id) {
  return state.decidels.items.hasOwnProperty(id);
}

export function getTitle(state, id) {
  return getDecidel(state, id).title;
}

export function getDeciders(state, id) {
  return getDecidel(state, id).deciders;
}

export function getOptions(state, id) {
  return getDecidel(state, id).options;
}

export function getCurrentDeciderName(state, id) {
  const deciders = getDecidel(state, id).deciders;
  return deciders[deciders.findIndex(decider => decider.isNext)].name;
}

export function isCurrentTurn(state, id) {
  return getCurrentUserName(state) === getCurrentDeciderName(state, id);
}

export function getCurrentRoundHistory(state, id) {
  const decidel = getDecidel(state, id);

  return decidel.history.filter(item => {
    return item.undoId;
  });
}

export function getPreviousRoundsHistory(state, id) {
  const decidel = getDecidel(state, id);

  return decidel.history.filter(item => {
    return !item.undoId;
  });
}

export function isPersistable(state, id) {
  return getCurrentRoundHistory(state, id).length > 0;
}

export function getFinalDecision(state, id) {
  const decidel = getDecidel(state, id);

  if (!decidel || !decidel.options) {
    return false;
  }

  const remaining = decidel.options.filter(
    option => option.undoId || !option.isRemoved
  );
  return remaining.length === 1 && remaining[0].title;
}

export function getCurrentUserName(state) {
  return state.currentUser.name;
}

export function getAsyncRequest(state, id) {
  return state.asyncRequests.items[id] || {};
}

/*
ASYNC SAGAS
 */

const fetchDecidel = function*(action) {
  const { id } = action.payload;
  const alreadyLoaded = yield select(state => hasDecidel(state, id));

  if (alreadyLoaded) {
    return;
  }

  yield asyncRequest(id, decidelsSlice.actions.loaded, "fetchDecidel", id);
};

const createDecidel = function*(action) {
  yield asyncRequest(
    action.payload.requestId,
    decidelsSlice.actions.loaded,
    "createDecidel",
    action.payload.decidel
  );
};

const persistCurrentRound = function*(action) {
  const { id } = action.payload;
  const exists = yield select(state => hasDecidel(state, id));

  if (!exists) {
    yield put(
      asyncRequestsSlice.actions.error({ id, error: "Invalid decidel" })
    );
    return;
  }

  const decidel = yield select(state => getDecidel(state, id));

  const updated = produce(decidel, draft => {
    const currentTurn = draft.deciders.findIndex(element => element.isNext);
    draft.deciders[currentTurn].isNext = false;
    draft.deciders[(currentTurn + 1) % draft.deciders.length].isNext = true;

    draft.options.forEach(item => {
      delete item.undoId;
    });

    draft.history.forEach(item => {
      delete item.undoId;
    });
  });

  yield asyncRequest(
    id,
    decidelsSlice.actions.loaded,
    "persistDecidel",
    updated
  );
};

const fetchCurrentUser = function*(action) {
  yield asyncRequest(
    "currentUser",
    currentUserSlice.actions.loaded,
    "fetchCurrentUser"
  );
};

const setCurrentUserName = function*(action) {
  yield asyncRequest(
    "currentUser",
    currentUserSlice.actions.loaded,
    "setCurrentUserName",
    action.payload.name
  );
};

export const fetchCurrentUserRequest = createAction("fetchCurrentUser");
export const setCurrentUserNameRequest = createAction("setCurrentUserName");
export const fetchDecidelRequest = createAction("fetchDecidel");
export const persistCurrentRoundRequest = createAction("persistCurrentRound");
export const createDecidelRequest = createAction("createDecidelRequest");

export const rootSaga = function*() {
  yield takeLatest(fetchCurrentUserRequest.type, fetchCurrentUser);
  yield takeLatest(setCurrentUserNameRequest.type, setCurrentUserName);
  yield takeEvery(fetchDecidelRequest.type, fetchDecidel);
  yield takeEvery(persistCurrentRoundRequest.type, persistCurrentRound);
  yield takeEvery(createDecidelRequest.type, createDecidel);
};
