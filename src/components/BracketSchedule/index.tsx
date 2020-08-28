import React from 'react';
import { connect } from 'react-redux';
import { IParams, IBigRequest } from 'interfaces/common';
import { IState } from 'redux-saga/reducers';
import { queryBracketBoardInfo } from 'components/BracketBoard/actions';
import './styles.css';

interface IBracketScheduleProps extends React.ClassAttributes<BracketSchedule> {
  bracketBoardInfo: IParams | null;
  competitionId: number;

  queryBracketBoardInfo(params: IBigRequest): void;
}

interface IBracketScheduleState {
}

class BracketSchedule extends React.Component<IBracketScheduleProps, IBracketScheduleState> {
  constructor(props: IBracketScheduleProps) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.requestData();
  }

  private requestData = () => {
    const params = {
      path: '',
      param: {
        competitionId: this.props.competitionId,
      },
      data: {},
    };
    this.props.queryBracketBoardInfo(params);
  }

  render() {
    console.log('bracketBoardInfo', this.props.bracketBoardInfo);
    return (
      <div className="BracketSchedule-container">
        {this.props.bracketBoardInfo != null ? (this.props.bracketBoardInfo.listRound != null &&
          (this.props.bracketBoardInfo.listRound as unknown as IParams[]).map((item, index) =>
            <div className="BracketSchedule-round-container">
              <div className="BracketSchedule-roundName-container">
                <p>{`${(this.props.bracketBoardInfo!.listRound as unknown as IParams[]).length - index > 3 ? 'Vòng' : ''}`} {`${(this.props.bracketBoardInfo!.listRound as unknown as IParams[]).length - index === 1 ? 'Chung kết' : ((this.props.bracketBoardInfo!.listRound as unknown as IParams[]).length - index === 2 ? 'Bán kết' : ((this.props.bracketBoardInfo!.listRound as unknown as IParams[]).length - index === 3 ? 'Tứ kết' : index + 1))}`}</p>
              </div>
              {item.listMatches != null && (item.listMatches as unknown as IParams[]).map((item, index) => {
                if (item.id !== -1) {
                  return (<div className="BracketSchedule-roundMatch-container">
                    <div className="BracketSchedule-roundMatch-orderNumber-container">
                      <p>{(item.data as unknown as IParams).name}</p>
                    </div>
                    <div className="BracketSchedule-roundMatch-time-container">
                      <p>{(item.data as unknown as IParams).time}</p>
                      <p>{(item.data as unknown as IParams).location}</p>
                    </div>
                    <div className="BracketSchedule-roundMatch-name-container">
                      <p>
                        {(item.data as unknown as IParams).team1 != null ? ((item.data as unknown as IParams).team1 as unknown as IParams).name : ((item.data as unknown as IParams).team1Description != null ? (item.data as unknown as IParams).team1Description : '')}
                      </p>
                    </div>
                    <div className="BracketSchedule-roundMatch-consequent-container BracketSchedule-roundMatch-consequent1-container">
                      <p className="BracketSchedule-roundMatch-result-text BracketSchedule-roundMatch-result1-text">1</p>
                    </div>
                    <div className="BracketSchedule-roundMatch-consequentMiddle-container">
                      <p>-</p>
                    </div>
                    <div className="BracketSchedule-roundMatch-consequent-container BracketSchedule-roundMatch-consequent2-container">
                      <p className="BracketSchedule-roundMatch-result-text BracketSchedule-roundMatch-result2-text">0</p>
                    </div>
                    <div className="BracketSchedule-roundMatch-name-container">
                      <p>{(item.data as unknown as IParams).team2 != null ?
                        ((item.data as unknown as IParams).team2 as unknown as IParams).name :
                        (
                          (item.data as unknown as IParams).team2Description != null ?
                            (item.data as unknown as IParams).team2Description :
                            '')
                      }</p>
                    </div>
                  </div>)
                } else {
                  return <div></div>
                }
              })}
            </div>)) : <p>Cuộc thi chưa đủ số đội để lập lịch, vui lòng tạo thêm đội</p>}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    bracketBoardInfo: state.bracketBoardInfo,
  };
};

export default connect(
  mapStateToProps,
  { queryBracketBoardInfo }
)(BracketSchedule);