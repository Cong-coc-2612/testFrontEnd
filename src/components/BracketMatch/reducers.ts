import { IAction, IParams } from "interfaces/common";

export const GET_MATCH_RESULT_SUCCESS = 'GET_MATCH_RESULT_SUCCESS';
export const GET_MATCH_RESULT_FAILED = 'GET_MATCH_RESULT_FAILED';

export function MatchResult(state: IParams | null = null, action: IAction<IParams | null>) {
  switch (action.type) {
    case GET_MATCH_RESULT_SUCCESS:
      return action.payload;
    case GET_MATCH_RESULT_FAILED:
      return null;
    default:
      return state;
  }
}