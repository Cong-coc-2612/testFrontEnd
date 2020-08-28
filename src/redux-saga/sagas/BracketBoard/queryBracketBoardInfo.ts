import { call, takeLatest, put } from 'redux-saga/effects';
import { query, METHOD } from 'utils/socketApi';
import { IRequest, IParams, IBigRequest, TypeAny } from 'interfaces/common';
import { GET_BRACKET_BOARD_INFO } from 'redux-saga/actions';

const queryBracketBoardInfo = (data: IParams, path: string | number, param: IParams) => {
  const uri = 'schedule';
  const datas = { ...data };
  const paths = path;
  const params = { ...param };
  return query(uri, METHOD.GET, datas, params, paths);
};

let listMatchesFull: IParams[] = [];
let listWinMatchesFull: IParams[] = [];
let listLoseMatchesFull: IParams[] = [];
let listRound: IParams[] = [];
let listRRRound: IParams[] = [];
let listTableRR: IParams[] = [];
let listTableSE: IParams[] = [];
let listWinRound: IParams[] = [];
let listLoseRound: IParams[] = [];

const DFS = (node: IParams, number: number, maxRound: number, fakeId?: number) => {
  if (node.left != null) {
    if (number === 3) {
      if ((node.degree as number) % 2 === 0) {
        DFS(node.left as unknown as IParams, number, maxRound, fakeId);
      } else {
        DFS(node.left as unknown as IParams, number, maxRound, fakeId! * 2);
      }
    } else {
      DFS(node.left as unknown as IParams, number, maxRound);
    }
  } else if (node.left == null && (((node.data as unknown as IParams).roundNo as number) >= 2 && ((node.data as unknown as IParams).roundNo as number) <= maxRound) && number !== 3) {
    node.left = {
      id: -1,
      data: {
        loser: null,
        matchNo: -1,
        name: '',
        roundNo: ((node.data as unknown as IParams).roundNo as number) - 1,
        status: null,
        team1: null,
        team1Description: null,
        team2: null,
        team2Description: null,
        winner: null,
      },
      degree: null,
      left: null,
      right: null,
    } as unknown as TypeAny;
    DFS(node.left as unknown as IParams, number, maxRound);
  }
  if (node.right != null) {
    if (number === 3) {
      if ((node.degree as number) % 2 === 0) {
        DFS(node.right as unknown as IParams, number, maxRound, fakeId);
      } else {
        DFS(node.right as unknown as IParams, number, maxRound, (fakeId! * 2) + 1);
      }
    } else {
      DFS(node.right as unknown as IParams, number, maxRound);
    }
  } else if (node.right == null && (((node.data as unknown as IParams).roundNo as number) >= 2 && ((node.data as unknown as IParams).roundNo as number) <= maxRound) && number !== 3) {
    node.right = {
      id: -1,
      data: {
        loser: null,
        matchNo: -1,
        name: '',
        roundNo: ((node.data as unknown as IParams).roundNo as number) - 1,
        status: null,
        team1: null,
        team1Description: null,
        team2: null,
        team2Description: null,
        winner: null,
      },
      degree: null,
      left: null,
      right: null,
    } as unknown as TypeAny;
    DFS(node.right as unknown as IParams, number, maxRound);
  }
  if (number === 1) {
    listMatchesFull.push(node);
  } else if (number === 2) {
    listWinMatchesFull.push(node);
  } else if (number === 3) {
    if (((node.data as unknown as IParams).name as string).includes('L')) {
      listLoseMatchesFull.push({ ...node, fakeId });
    }
  }
}

function* doQueryBracketBoardInfo(request: IRequest<IBigRequest>) {
  try {
    const response = yield call(queryBracketBoardInfo, request.data.data, request.data.path, request.data.param);
    const data = response.data.result;
    let tempVar: IParams = {};
    let tempVar2: IParams = {};
    if (response.data.error.MessageCode === 0) {
      if (data.Schedule != null && data.Schedule.FinalStageSchedule != null) {
        if (data.Schedule.FinalStageSchedule.FormatName === 'Round Robin') {
          let listMatches: IParams[] = [];
          for (let i = 1; i <= data.Schedule.FinalStageSchedule.TotalRound; i++) {
            for (let j = 0; j < data.Schedule.FinalStageSchedule.Bracket.length; j++) {
              if (data.Schedule.FinalStageSchedule.Bracket[j].roundNo === i) {
                listMatches.push(data.Schedule.FinalStageSchedule.Bracket[j] as IParams);
              }
            }
            listRRRound.push({ listMatches } as unknown as IParams);
            listMatches = [];
          }
          tempVar = { finalStage: { listRRRound } };
          listRRRound = [];
        } else {
          if (data.Schedule.FinalStageSchedule.WinBranch == null) {
            yield call(DFS, data.Schedule.FinalStageSchedule.Bracket.root, 1, data.Schedule.FinalStageSchedule.Bracket.root.data.roundNo);
            let listMatches: IParams[] = [];
            for (let i = 1; i <= data.Schedule.FinalStageSchedule.Bracket.root.data.roundNo; i++) {
              for (let j = 0; j < listMatchesFull.length; j++) {
                if ((listMatchesFull[j].data as unknown as IParams).roundNo === i) {
                  listMatches.push(listMatchesFull[j] as IParams);
                }
              }
              listRound.push({ listMatches } as unknown as IParams);
              listMatches = [];
            }
            tempVar = { finalStage: { listRound } };
            listRound = [];
            listMatchesFull = [];
          } else {
            // 
            yield call(DFS, data.Schedule.FinalStageSchedule.WinBranch.root, 2, data.Schedule.FinalStageSchedule.WinBranch.root.data.roundNo);
            let listWinMatches = [];
            for (let i = 1; i <= data.Schedule.FinalStageSchedule.WinBranch.root.data.roundNo; i++) {
              for (let j = 0; j < listWinMatchesFull.length; j++) {
                if ((listWinMatchesFull[j].data as unknown as IParams).roundNo === i) {
                  listWinMatches.push(listWinMatchesFull[j]);
                }
              }
              listWinRound.push({ listWinMatches } as unknown as IParams);
              listWinMatches = [];
            }
            yield call(DFS, data.Schedule.FinalStageSchedule.LoseBranch.root, 3, data.Schedule.FinalStageSchedule.LoseBranch.root.data.roundNo, 1);
            let listLoseMatches = [];
            for (let i = 1; i <= data.Schedule.FinalStageSchedule.LoseBranch.root.data.roundNo; i++) {
              for (let j = 0; j < listLoseMatchesFull.length; j++) {
                if ((listLoseMatchesFull[j].data as unknown as IParams).roundNo === i) {
                  listLoseMatches.push(listLoseMatchesFull[j]);
                }
              }
              listLoseRound.push({ listLoseMatches } as unknown as IParams);
              listLoseMatches = [];
            }
            tempVar = { finalStage: { listWinRound, listLoseRound } };
            listWinRound = [];
            listWinMatchesFull = [];
            listLoseRound = [];
            listLoseMatchesFull = [];
            // 
          }
        }

      }
      if (data.Schedule != null && data.Schedule.GroupStageSchedule != null) {
        if (data.Schedule.GroupStageSchedule.FormatName === 'Round Robin') {
          for (let i = 0; i < data.Schedule.GroupStageSchedule.Tables.length; i++) {
            let listMatches: IParams[] = [];
            if (data.Schedule.GroupStageSchedule.Tables[i].TotalRound != null) {
              for (let j = 1; j <= data.Schedule.GroupStageSchedule.Tables[i].TotalRound; j++) {
                if (data.Schedule.GroupStageSchedule.Tables[i].Bracket != null) {
                  for (let k = 0; k < data.Schedule.GroupStageSchedule.Tables[i].Bracket.length; k++) {
                    if (data.Schedule.GroupStageSchedule.Tables[i].Bracket[k].roundNo === j) {
                      listMatches.push(data.Schedule.GroupStageSchedule.Tables[i].Bracket[k] as IParams);
                    }
                  }
                  listRRRound.push({ listMatches } as IParams);
                  listMatches = [];
                }
              }
            }
            listTableRR.push({ listRRRound, tableName: data.Schedule.GroupStageSchedule.Tables[i].Table } as IParams);
            listRRRound = [];
          }
          tempVar2 = { groupStage: { listTableRR } };
          listTableRR = [];
        } else {
          if (data.Schedule.GroupStageSchedule.WinBranch == null) {
            for (let k = 0; k < data.Schedule.GroupStageSchedule.Tables.length; k++) {
              if (data.Schedule.GroupStageSchedule.Tables[k].Bracket != null) {
                yield call(DFS, data.Schedule.GroupStageSchedule.Tables[k].Bracket.root, 1, data.Schedule.GroupStageSchedule.Tables[k].Bracket.root.data.roundNo);
                let listMatches: IParams[] = [];
                for (let i = 1; i <= data.Schedule.GroupStageSchedule.Tables[k].Bracket.root.data.roundNo; i++) {
                  for (let j = 0; j < listMatchesFull.length; j++) {
                    if ((listMatchesFull[j].data as IParams).roundNo === i) {
                      listMatches.push(listMatchesFull[j] as IParams);
                    }
                  }
                  listRound.push({ listMatches } as IParams);
                  listMatches = [];
                }
              }
              listTableSE.push({ listRound, tableName: data.Schedule.GroupStageSchedule.Tables[k].Table } as IParams);
              listRound = [];
              listMatchesFull = [];
            }
            tempVar2 = { groupStage: { listTableSE } };
            listTableSE = [];
          } else { }

        }
      }
      yield put({
        type: request.response.success,
        payload: {
          ...tempVar,
          ...tempVar2
        },
      });
    } else {
      throw new Error(response.data.error.Message);
    }
  } catch (error) {
    yield put({
      type: request.response.failed,
    });
  }
}

export default function* watchQueryBracketBoardInfo() {
  yield takeLatest(GET_BRACKET_BOARD_INFO, doQueryBracketBoardInfo);
}
