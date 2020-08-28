import { IAction, IParams } from "interfaces/common";

export const QUERY_LIST_USER_SUCCESS = 'QUERY_LIST_USER_SUCCESS';
export const QUERY_LIST_USER_FAILED = 'QUERY_LIST_USER_FAILED';

export function ListUsers(state: IParams | null = null, action: IAction<IParams>) {
  switch (action.type) {
    case QUERY_LIST_USER_SUCCESS:
      return action.payload;
    case QUERY_LIST_USER_FAILED:
      return null;
    default:
      return state;
  }
}