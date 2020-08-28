import { IBigRequest } from "interfaces/common";
import { QUERY_LIST_TOURNAMENT } from "redux-saga/actions";
import { QUERY_LIST_TOURNAMENT_SUCCESS, QUERY_LIST_TOURNAMENT_FAILED } from "./reducers";

export const queryListTournament = (data: IBigRequest) => ({
  type: QUERY_LIST_TOURNAMENT,
  response: {
    success: QUERY_LIST_TOURNAMENT_SUCCESS,
    failed: QUERY_LIST_TOURNAMENT_FAILED,
  },
  data: {
    path: data.path,
    param: data.param,
    data: data.data,
  },
});