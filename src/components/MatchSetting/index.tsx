import React from 'react';
import { connect } from 'react-redux';
import SheetData, { ISheetDataConfig } from 'components/SheetData';
import { IState } from 'redux-saga/reducers';
import { IParams, IBigRequest } from 'interfaces/common';
import { getMatchResult } from 'components/BracketMatch/actions';
import './styles.css';

interface IMatchSettingProps extends React.ClassAttributes<MatchSetting> {
  teamsInfo: IParams[];
  info: IParams;

  getMatchResult(params: IBigRequest): void;
}

interface IMatchSettingState {
  configSheetData: ISheetDataConfig;
  winner: boolean | null;
}

class MatchSetting extends React.Component<IMatchSettingProps, IMatchSettingState> {
  constructor(props: IMatchSettingProps) {
    super(props);
    this.state = {
      winner: null,
      configSheetData: {
        fixedColumnCount: 3,
        fixedRowCount: 1,
        rowHeight: 80,
        fetchCount: 2,
        header: [
          {
            label: 'Thứ tự',
            width: 70,
            style: { justifyContent: 'center' },
            element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
              <div style={style}>{rowIndex}</div>
            ),
          },
          {
            label: 'Tên đội',
            width: 140,
            style: { justifyContent: 'center' },
            element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
              <div style={style}>{rowData.team ? (rowData.team as IParams).shortName : ''}</div>
            ),
          },
          {
            label: 'Kết quả chung cuộc',
            width: 150,
            style: { justifyContent: 'center' },
            element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
              <div style={style}>{rowData.score}</div>
            ),
          },
          {
            label: 'Set',
            width: 100,
            style: { justifyContent: 'center' },
            element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
              <div style={style}>{rowData.score}</div>
            ),
          },
          // {
          //   label: 'Kết quả chung cuộc',
          //   width: 190,
          //   style: { justifyContent: 'center' },
          //   element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
          //     <div style={style}>{rowData.stockCode}</div>
          //   ),
          // },
          // {
          //   label: 'Kết quả chung cuộc',
          //   width: 190,
          //   style: { justifyContent: 'center' },
          //   element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
          //     <div style={style}>{rowData.stockCode}</div>
          //   ),
          // },
          // {
          //   label: 'Kết quả chung cuộc',
          //   width: 190,
          //   style: { justifyContent: 'center' },
          //   element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
          //     <div style={style}>{rowData.stockCode}</div>
          //   ),
          // },
          // {
          //   label: '',
          //   width: 90,
          //   style: { justifyContent: 'center' },
          //   element: (rowData: IParams, rowIndex: number, cellStyle?: React.CSSProperties) =>
          //     this.props.isShowOrderHistory !== true && (
          //       <div
          //         style={cellStyle}
          //         className={style.ButtonCancel}
          //         onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          //           e.stopPropagation();

          //           this.onClickCell({
          //             action: 'cancel',
          //             data: rowData,
          //             index: rowIndex,
          //           });
          //         }}
          //       >
          //         {this.props.t('Cancel')}
          //       </div>
          //     ),
          // },
        ],
      },
    };
  }

  private onAddASet = () => {
    this.setState({
      configSheetData: {
        ...this.state.configSheetData,
        header: [
          ...this.state.configSheetData.header,
          {
            label: 'Set',
            width: 100,
            style: { justifyContent: 'center' },
            element: (rowData: IParams, rowIndex: number, style?: React.CSSProperties) => (
              <div style={style}>{rowData.score}</div>
            ),
          }]
      }
    });
  }

  componentDidMount() {
    this.requestData();
  }

  private requestData = () => {
    const params = {
      path: '',
      param: {
        matchId: this.props.info.id,
      },
      data: {},
    };
    this.props.getMatchResult(params);
  }

  private onRemoveASet = () => {
    this.setState({
      configSheetData: {
        ...this.state.configSheetData,
        header: [
          ...this.state.configSheetData.header.slice(0, this.state.configSheetData.header.length - 1),
        ],
      }
    });
  }

  private team1Win = () => {
    if (this.state.winner === true) {
      this.setState({
        winner: null,
      });
    } else {
      this.setState({
        winner: true,
      });
    }
  }

  private team2Win = () => {
    if (this.state.winner === false) {
      this.setState({
        winner: null,
      });
    } else {
      this.setState({
        winner: false,
      });
    }
  }

  render() {
    return (
      <div
        className="MatchSetting-container"
      >
        <div className="MatchSetting-set-container">
          <p className="MatchSetting-set-text" onClick={this.onAddASet}>Thêm 1 set</p>
          {this.state.configSheetData.header.length > 3 && <p className="MatchSetting-set-text" onClick={this.onRemoveASet}>Bớt 1 set</p>}
        </div>
        <div className="MatchSetting-sheetData-container">
          <SheetData config={this.state.configSheetData} data={this.props.teamsInfo as IParams[]} />
        </div>
        <div className="MatchSetting-verify-winner-container">
          <p className="MatchSetting-verify-winner-header">Xác định người thắng cuộc</p>
          <div className="MatchSetting-verify-winner-text-container-container">
            <div className={`MatchSetting-verify-winner-text-container ${this.state.winner === true ? 'MatchSetting-verify-winner-isWinner' : ''}`} onClick={this.team1Win}>
              <p className="MatchSetting-verify-winner-text noselect">{(this.props.teamsInfo[0].team as IParams).shortName}</p>
            </div>
            <div className={`MatchSetting-verify-winner-text-container ${this.state.winner === false ? 'MatchSetting-verify-winner-isWinner' : ''}`} onClick={this.team2Win}>
              <p className="MatchSetting-verify-winner-text noselect">{(this.props.teamsInfo[1].team as IParams).shortName}</p>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  { getMatchResult, }
)(MatchSetting);