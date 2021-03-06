import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { IoMdAddCircleOutline } from 'react-icons/io';
import ReduxBlockUi from 'react-block-ui/redux';
import Select, { ValueType, OptionTypeBase } from 'react-select';
import { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { StaticContext } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import { Styles } from 'react-modal';
import { AiFillCamera } from 'react-icons/ai';
import BracketBoard from 'components/BracketBoard';
import CustomTab from 'components/CustomTab';
import CustomModal from 'components/CustomModal';
import BracketSchedule from 'components/BracketSchedule';
import BracketRank from 'components/BracketRank';
import TournamentListTeam from 'components/TournamentListTeam';
import TournamentSetting from 'components/TournamentSetting';
import CompetitionsSetting from 'components/CompetitionsSetting';
import Player from 'components/Player';
import TextInput from 'components/TextInput';
import { IBigRequest, IParams } from 'interfaces/common';
import { COOKIES_TYPE } from 'global';
import { IState } from 'redux-saga/reducers';
import { cookies } from 'utils/cookies';
import { formatDateToDisplay } from 'utils/datetime';
import config from 'config';
import { onEditBracketMode, deleteListSelectingTeam } from 'components/BracketTeam/actions';
import { queryAllCompetitionsByTournamentId } from 'components/CompetitionsSetting/actions';
import { updateBackgroundTournament, updateAvatarTournament, queryTournamentInfo, querySportsByTournament, finishTournament, queryCompetitionsBySportAndTournament, startTournament } from './actions';
import { START_TOURNAMENT, FINISH_TOURNAMENT } from 'redux-saga/actions';
import { START_TOURNAMENT_SUCCESS, START_TOURNAMENT_FAILED, FINISH_TOURNAMENT_SUCCESS, FINISH_TOURNAMENT_FAILED } from './reducers';
import './styles.css';

interface ITournamentInfoProps extends React.ClassAttributes<TournamentInfo> {
  routerInfo: RouteComponentProps<any, StaticContext, H.LocationState>;
  tournamentInfo: IParams | null;
  listSportsByTournament: IParams[] | null;
  listCompetitionsBySportAndTournament: IParams[] | null;
  allCompetitionByTournamentId: IParams[] | null;

  queryTournamentInfo(param: IBigRequest): void;
  querySportsByTournament(param: IBigRequest): void;
  queryCompetitionsBySportAndTournament(param: IBigRequest): void;
  startTournament(param: IBigRequest): void;
  finishTournament(param: IBigRequest): void;
  updateAvatarTournament(param: IBigRequest): void;
  updateBackgroundTournament(param: IBigRequest): void;
  onEditBracketMode(status: boolean): void;
  deleteListSelectingTeam(): void;
  queryAllCompetitionsByTournamentId(param: IBigRequest): void;
}

interface ITournamentInfoState {
  selectedCompetitionInForm: ValueType<OptionTypeBase>;
  selectedCompetitionInFormError: boolean;
  selectedCompetitionInFormErrorContent: string;
  showJoinModal: boolean;
  teamNameInForm: string;
  teamNameInFormError: boolean;
  teamNameInFormErrorContent: string;
  playerNameInForm: string;
  playerNameInFormError: boolean;
  playerNameInFormErrorContent: string;
  playerEmailInForm: string;
  playerEmailInFormError: boolean;
  playerEmailInFormErrorContent: string;
  playerAgeInForm: number;
  teamShortNameInForm: string;
  teamShortNameInFormError: boolean;
  teamShortNameInFormErrorContent: string;
  listPlayerInForm: IParams[];
  playerGenderInForm: ValueType<OptionTypeBase>;
}

let allCompetitionOptions: IParams[] = [
];

const customStyles: Styles = {
  content: {
    top: '5%',
    left: '15%',
    right: '15%',
    bottom: '5%',
    backgroundColor: '#2b303d',
    display: 'flex',
    flexDirection: 'column',
  },
  overlay: {
    zIndex: 100001,
  },
};

const genderOptions = [
  { value: true, label: 'Nam' },
  { value: false, label: 'Nữ' },
];

class TournamentInfo extends React.Component<ITournamentInfoProps, ITournamentInfoState> {
  private tabList: string[] = [];
  private componentList: ReactNode[] = [];

  constructor(props: ITournamentInfoProps) {
    super(props);
    this.state = {
      selectedCompetitionInForm: null,
      showJoinModal: false,
      teamNameInForm: '',
      playerEmailInForm: '',
      teamNameInFormError: false,
      teamNameInFormErrorContent: '',
      playerNameInForm: '',
      playerAgeInForm: 0,
      playerGenderInForm: { value: true, label: 'Nam' },
      selectedCompetitionInFormError: false,
      selectedCompetitionInFormErrorContent: '',
      playerEmailInFormError: false,
      playerEmailInFormErrorContent: '',
      playerNameInFormError: false,
      playerNameInFormErrorContent: '',
      teamShortNameInForm: '',
      teamShortNameInFormError: false,
      teamShortNameInFormErrorContent: '',
      listPlayerInForm: [
        {
          name: 'Phan Trọng Nhân',
          gender: 'Nam',
          age: 23,
          email: 'caulamgithelol.lmht@gmail.com',
        },
      ],
    };
  }

  shouldComponentUpdate(nextProps: ITournamentInfoProps, nextState: ITournamentInfoState) {
    if (this.props.tournamentInfo !== nextProps.tournamentInfo) {
      // if (nextProps.tournamentInfo == null || nextProps.tournamentInfo.Tournament == null) {
      //   this.tabList = [];
      //   this.componentList = [];
      // } else if (nextState.selectedCompetition != null) {
      //   if (nextProps.tournamentInfo != null && (nextProps.tournamentInfo as IParams).Config != null && ((nextProps.tournamentInfo as IParams).Config as IParams).canEdit === true) {
      //     this.tabList = ['Nhánh thi đấu', 'Lịch thi đấu', 'Bảng xếp hạng', 'Thông tin', 'Danh sách các đội', 'Cài đặt', 'Các cuộc thi trong giải'];
      //     this.componentList = [<BracketBoard competitionId={(nextState.selectedCompetition as IParams).value as number} />, <BracketSchedule competitionId={(nextState.selectedCompetition as IParams).value as number} />, <BracketRank />, <div />, <TournamentListTeam id={Number(this.props.routerInfo.match.params.tournamentId)} />, <TournamentSetting tournamentInfo={nextProps.tournamentInfo.Tournament as IParams} tournamentId={Number(this.props.routerInfo.match.params.tournamentId)} />, <CompetitionsSetting tournamentInfo={nextProps.tournamentInfo as IParams} tournamentId={Number(this.props.routerInfo.match.params.tournamentId)} onChangeCompetitionSetting={this.onChangeCompetitionSetting} />];
      //   } else {
      //     this.tabList = ['Nhánh thi đấu', 'Lịch thi đấu', 'Bảng xếp hạng', 'Thông tin', 'Danh sách các đội'];
      //     this.componentList = [<BracketBoard competitionId={(nextState.selectedCompetition as IParams).value as number} />, <BracketSchedule competitionId={(nextState.selectedCompetition as IParams).value as number} />, <BracketRank />, <div />, <TournamentListTeam id={Number(this.props.routerInfo.match.params.tournamentId)} />];
      //   }
      // } else {
      //   if (nextProps.tournamentInfo != null && (nextProps.tournamentInfo as IParams).Config != null && ((nextProps.tournamentInfo as IParams).Config as IParams).canEdit === true) {
      //     this.tabList = ['Cài đặt', 'Các cuộc thi trong giải'];
      //     this.componentList = [<TournamentSetting tournamentId={Number(this.props.routerInfo.match.params.tournamentId)} tournamentInfo={nextProps.tournamentInfo.Tournament as IParams} />, <CompetitionsSetting tournamentInfo={nextProps.tournamentInfo.Tournament as IParams} tournamentId={Number(this.props.routerInfo.match.params.tournamentId)} onChangeCompetitionSetting={this.onChangeCompetitionSetting} />];
      //   } else {
      //     this.tabList = [];
      //     this.componentList = [];
      //   }
      // }
      this.tabList = [];
      this.componentList = [];
      if (nextProps.tournamentInfo != null) {
        if ((nextProps.tournamentInfo as IParams).Config != null && ((nextProps.tournamentInfo as unknown as IParams).Config as unknown as IParams).canEdit === true) {
          this.tabList = [
            'Các cuộc thi trong giải',
            'Các đội tham gia giải',
            'Cài đặt'
          ];
          this.componentList = [
            <CompetitionsSetting tournamentInfo={nextProps.tournamentInfo.Tournament as unknown as IParams} tournamentId={Number(this.props.routerInfo.match.params.tournamentId)} onChangeCompetitionSetting={this.onChangeCompetitionSetting} />,
            <TournamentListTeam id={Number(this.props.routerInfo.match.params.tournamentId)} />,
            <TournamentSetting tournamentId={Number(this.props.routerInfo.match.params.tournamentId)} tournamentInfo={nextProps.tournamentInfo.Tournament as unknown as IParams} />
          ];
        } else {
          this.tabList = [
            'Các cuộc thi trong giải',
            'Các đội tham gia giải',
          ];
          this.componentList = [
            <CompetitionsSetting tournamentInfo={nextProps.tournamentInfo.Tournament as unknown as IParams} tournamentId={Number(this.props.routerInfo.match.params.tournamentId)} onChangeCompetitionSetting={this.onChangeCompetitionSetting} />,
            <TournamentListTeam id={Number(this.props.routerInfo.match.params.tournamentId)} />,
          ];
        }
      }
    }
    // if (this.state.selectedSport !== nextState.selectedSport || this.state.selectedCompetition !== nextState.selectedCompetition) {
    //   this.props.onEditBracketMode(false);
    //   this.props.deleteListSelectingTeam();
    // }
    // if (this.props.listSportsByTournament !== nextProps.listSportsByTournament) {
    //   sportOptions = [];
    //   if (nextProps.listSportsByTournament != null) {
    //     nextProps.listSportsByTournament.map((item, index) => sportOptions.push({ value: item.id, label: item.fullName }));
    //   }
    //   sportOptions.unshift({
    //     value: null, label: '(Tất cả)',
    //   });
    // }
    // if (this.props.listCompetitionsBySportAndTournament !== nextProps.listCompetitionsBySportAndTournament) {
    //   competitionOptions = [];
    //   if (nextProps.listCompetitionsBySportAndTournament != null) {
    //     nextProps.listCompetitionsBySportAndTournament.map((item, index) => competitionOptions.push({ value: item.id, label: item.name }));
    //   }
    // }
    if (this.props.allCompetitionByTournamentId !== nextProps.allCompetitionByTournamentId) {
      allCompetitionOptions = [];
      if (nextProps.allCompetitionByTournamentId != null) {
        nextProps.allCompetitionByTournamentId.map((item, index) => allCompetitionOptions.push({ value: item.id, label: item.name }));
      }
    }
    // if (this.state.selectedSport !== nextState.selectedSport && nextState.selectedSport != null) {
    //   competitionOptions = [];
    //   this.setState({
    //     selectedCompetition: null,
    //   });
    //   const params = {
    //     path: '',
    //     param: {
    //       tournamentId: Number(this.props.routerInfo.match.params.tournamentId),
    //       sportId: (nextState.selectedSport as IParams).value,
    //     },
    //     data: {},
    //   };
    //   this.props.queryCompetitionsBySportAndTournament(params);
    // }
    return true;
  }

  componentDidMount() {
    this.requestData();
  }

  private requestData = () => {
    let params: IBigRequest = {
      path: '',
      param: {
        id: Number(this.props.routerInfo.match.params.tournamentId),
      },
      data: {},
    };
    this.props.queryTournamentInfo(params);
    params = {
      path: '',
      param: {
        tournamentId: Number(this.props.routerInfo.match.params.tournamentId),
        limit: 99,
      },
      data: {},
    };
    this.props.queryAllCompetitionsByTournamentId(params);
  }

  private onChangeCompetitionSetting = () => {
    this.setState({
      selectedCompetitionInForm: null,
    });
  }

  private onChangeSelectedCompetitionInForm = (value: ValueType<OptionTypeBase>) => {
    this.setState({
      selectedCompetitionInForm: value,
    });
  }

  private updateBackground = (selectorFiles: FileList | null) => {
    if (selectorFiles !== null && selectorFiles.length > 0) {
      const params = {
        path: '',
        param: {
          id: Number(this.props.routerInfo.match.params.tournamentId),
          file: selectorFiles,
        },
        data: {
        },
      };

      this.props.updateBackgroundTournament(params);
    }
  };

  private updateAvatar = (selectorFiles: FileList | null) => {
    if (selectorFiles !== null && selectorFiles.length > 0) {
      const params = {
        path: '',
        param: {
          id: Number(this.props.routerInfo.match.params.tournamentId),
          file: selectorFiles,
        },
        data: {
        },
      };

      this.props.updateAvatarTournament(params);
    }
  };

  private handleStartTournament = () => {
    const confirm = window.confirm('Khi bắt đầu giải bạn sẽ không thể thay đổi thông tin các cuộc thi và các đội nữa, bạn có chắc chắn?')
    if (confirm === true) {
      const params = {
        path: '',
        param: {
          id: Number(this.props.routerInfo.match.params.tournamentId),
        },
        data: {
        },
      };

      this.props.startTournament(params);
    }
  };

  private handleJoinTournament = () => {
    this.setState({
      showJoinModal: true,
    });
  };

  private handleCloseModal = () => {
    const confirm = window.confirm('Bạn có chắc chắn muốn hủy form đăng ký?');
    if (confirm === true) {
      this.setState({
        showJoinModal: false,
      });
    }
  };

  private validateForm = () => {
    let selectedCompetitionInFormError = false;
    let selectedCompetitionInFormErrorContent = '';
    let teamNameInFormError = false;
    let teamNameInFormErrorContent = '';
    let teamShortNameInFormErrorContent = '';
    let teamShortNameInFormError = false;
    if (this.state.selectedCompetitionInForm == null) {
      selectedCompetitionInFormError = true;
      selectedCompetitionInFormErrorContent = 'Bạn phải chọn giải đấu muốn tham gia';
    }
    if (this.state.teamNameInForm.trim() === '') {
      teamNameInFormError = true;
      teamNameInFormErrorContent = 'Tên đội không được trống';
    }
    if (this.state.teamShortNameInForm.trim() === '') {
      teamShortNameInFormError = true;
      teamShortNameInFormErrorContent = 'Tên ngắn đội không được trống';
    }

    return {
      selectedCompetitionInFormError,
      selectedCompetitionInFormErrorContent,
      teamNameInFormError,
      teamNameInFormErrorContent,
      teamShortNameInFormError,
      teamShortNameInFormErrorContent
    };
  }

  private validateAddPlayer = () => {
    let playerEmailInFormErrorContent = '';
    let playerEmailInFormError = false;
    let playerNameInFormErrorContent = '';
    let playerNameInFormError = false;
    if (this.state.playerNameInForm.trim() === '') {
      playerNameInFormError = true;
      playerNameInFormErrorContent = 'Tên người chơi không được trống';
    }
    if (!config.regex.email.test(this.state.playerEmailInForm)) {
      playerEmailInFormError = true;
      playerEmailInFormErrorContent = 'Email không hợp lệ';
    }

    return {
      playerEmailInFormError,
      playerEmailInFormErrorContent,
      playerNameInFormErrorContent,
      playerNameInFormError,
    };
  }

  private handleConfirmModal = () => {
    const {
      selectedCompetitionInFormError,
      selectedCompetitionInFormErrorContent,
      teamNameInFormError,
      teamNameInFormErrorContent,
      teamShortNameInFormError,
      teamShortNameInFormErrorContent
    } = this.validateForm();
    this.setState({
      selectedCompetitionInFormError,
      selectedCompetitionInFormErrorContent,
      teamNameInFormError,
      teamNameInFormErrorContent,
      teamShortNameInFormError,
      teamShortNameInFormErrorContent
    });
    if (teamNameInFormError === true || selectedCompetitionInFormError === true || teamShortNameInFormError === true) {
      return;
    }
    const params = {
      path: '',
      param: {},
      data: {
        competitionId: (this.state.selectedCompetitionInForm as IParams).value,
        TeamDTO: {
          fullName: this.state.teamNameInForm,
          shortName: this.state.teamShortNameInForm,
        },
        ListPlayer: this.state.listPlayerInForm,
      },
    }
    // this.props.registTeam(params);
  };

  private handleFinishTournament = () => {
    const confirm = window.confirm('Khi Kết thúc giải đồng nghĩa với việc tất cả các cuộc thi cũng sẽ kết thúc, bạn có chắc chắn?')
    if (confirm === true) {
      const params = {
        path: '',
        param: {
          id: Number(this.props.routerInfo.match.params.tournamentId),
        },
        data: {
        },
      };

      this.props.finishTournament(params);
    }
  };

  private onChangeTeamNameInForm = (value: string) => {
    this.setState({
      teamNameInForm: value,
    });
  }

  private onChangeTeamShortNameInForm = (value: string) => {
    this.setState({
      teamShortNameInForm: value,
    });
  }

  private onDeletePlayer = (indexx: number) => {
    this.setState({
      listPlayerInForm: this.state.listPlayerInForm.filter((item, index) => index !== indexx),
    });
  }

  private onChangePlayerNameInForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      playerNameInForm: value.target.value,
    });
  }

  private onChangePlayerEmailInForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      playerEmailInForm: value.target.value,
    });
  }

  private onChangePlayerGenderInForm = (value: ValueType<OptionTypeBase>) => {
    this.setState({ playerGenderInForm: value, });
  }

  private addPlayer = () => {
    const {
      playerEmailInFormError,
      playerEmailInFormErrorContent,
      playerNameInFormErrorContent,
      playerNameInFormError,
    } = this.validateAddPlayer();
    this.setState({
      playerEmailInFormError,
      playerEmailInFormErrorContent,
      playerNameInFormErrorContent,
      playerNameInFormError,
    });
    if (playerNameInFormError === true || playerEmailInFormError === true) {
      return;
    }
    const listTemp = this.state.listPlayerInForm;
    listTemp.push({
      name: this.state.playerNameInForm,
      age: this.state.playerAgeInForm,
      email: this.state.playerEmailInForm,
      gender: (this.state.playerGenderInForm as IParams).label,
    });
    this.setState({
      listPlayerInForm: listTemp,
      playerNameInForm: '',
      playerAgeInForm: 0,
      playerEmailInForm: '',
      playerGenderInForm: { value: true, label: 'Nam' },
    });
  }

  private onChangePlayerAgeInForm = (value: React.ChangeEvent<HTMLInputElement>) => {
    let tempValue = 0;
    if (!isNaN(value.target.value as unknown as number)) {
      tempValue = Number(value.target.value);
    } else {
      tempValue = 0;
    }
    this.setState({
      playerAgeInForm: tempValue,
    });
  }

  render() {
    return (
      <ReduxBlockUi
        tag="div"
        block={START_TOURNAMENT}
        unblock={[START_TOURNAMENT_SUCCESS, START_TOURNAMENT_FAILED]}
      >
        <ReduxBlockUi
          tag="div"
          block={FINISH_TOURNAMENT}
          unblock={[FINISH_TOURNAMENT_SUCCESS, FINISH_TOURNAMENT_FAILED]}
        >
          <div className="TournamentInfo-Container">
            <div className="TournamentInfo-background-image-container">
              <img className={'TournamentInfo-background-image'} src={require('../../assets/38155584462_74d5f1cc1d_b.jpg')} alt={'logo'} />
              {this.props.tournamentInfo != null && (this.props.tournamentInfo as IParams).Config != null && ((this.props.tournamentInfo as unknown as IParams).Config as unknown as IParams).canEdit === true && <AiFillCamera className={'TournamentInfo-change-image-icon'} />}
              {this.props.tournamentInfo != null && (this.props.tournamentInfo as IParams).Config != null && ((this.props.tournamentInfo as unknown as IParams).Config as unknown as IParams).canEdit === true && <div className={'TournamentInfo-Overlay'}>
                <input type="file" onChange={(e) => this.updateBackground(e.target.files)} />
              </div>}
            </div>
            <div className="TournamentInfo-content-container">
              <div className="TournamentInfo-content-info-container">
                <div className="TournamentInfo-content-info-basic-info-container">
                  <div className="TournamentInfo-content-info-basic-info-container-container">
                    <div className="TournamentInfo-content-info-basic-info-container-singleRow">
                      <p className="TournamentInfo-name-text">{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? (this.props.tournamentInfo.Tournament as unknown as IParams).fullName : <Skeleton width={400} height={30} />}</p>
                    </div>
                    <div className="TournamentInfo-content-info-basic-info-container-singleRow">
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Tên ngắn: ${(this.props.tournamentInfo.Tournament as unknown as IParams).shortName}` : <Skeleton width={200} height={20} />}</p>
                      </div>
                    </div>
                    <div className="TournamentInfo-content-info-basic-info-container-singleRow">
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Nhà tài trợ: ${(this.props.tournamentInfo.Tournament as unknown as IParams).donor}` : <Skeleton width={250} height={20} />}</p>
                      </div>
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Trạng thái: ${((this.props.tournamentInfo.Tournament as unknown as IParams).status === 'processing' ? 'Đang diễn ra' : (this.props.tournamentInfo.status == null ? 'Chưa diễn ra' : 'Đã kết thúc'))}` : <Skeleton width={225} height={20} />}</p>
                      </div>
                    </div>
                    <div className="TournamentInfo-content-info-basic-info-container-singleRow">
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Ngày bắt đầu: ${formatDateToDisplay((this.props.tournamentInfo.Tournament as unknown as IParams).openingTime as string | undefined, 'dd/MM/yyyy', 'yyyy-MM-dd')}` : <Skeleton width={250} height={20} />}</p>
                      </div>
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Địa điểm khai mạc: ${(this.props.tournamentInfo.Tournament as unknown as IParams).openingLocation}` : <Skeleton width={275} height={20} />}</p>
                      </div>
                    </div>
                    <div className="TournamentInfo-content-info-basic-info-container-singleRow">
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Ngày kết thúc: ${formatDateToDisplay((this.props.tournamentInfo.Tournament as unknown as IParams).closingTime as string | undefined, 'dd/MM/yyyy', 'yyyy-MM-dd')}` : <Skeleton width={250} height={20} />}</p>
                      </div>
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Địa điểm bế mạc: ${(this.props.tournamentInfo.Tournament as unknown as IParams).closingLocation}` : <Skeleton width={275} height={20} />}</p>
                      </div>
                    </div>
                    <div className="TournamentInfo-content-info-basic-info-container-singleRow">
                      <div className="TournamentInfo-info-item">
                        <p>{this.props.tournamentInfo != null && this.props.tournamentInfo.Tournament ? `Mô tả: ${(this.props.tournamentInfo.Tournament as unknown as IParams).description}` : <Skeleton width={300} height={20} />}</p>
                      </div>
                    </div>
                  </div>
                  <img className={'TournamentInfo-avatar-image'} src={require('../../assets/7ab1b0125d485c8dd6a4e78832b0a4b2fbed3cf8.png')} alt={'logo'} />
                  {this.props.tournamentInfo != null && (this.props.tournamentInfo as IParams).Config != null && ((this.props.tournamentInfo as unknown as IParams).Config as unknown as IParams).canEdit === true && <AiFillCamera className={'TournamentInfo-change-avatar-icon'} />}
                  {this.props.tournamentInfo != null && (this.props.tournamentInfo as IParams).Config != null && ((this.props.tournamentInfo as unknown as IParams).Config as unknown as IParams).canEdit === true && <div className={'TournamentInfo-Overlay2'}>
                    <input type="file" onChange={(e) => this.updateAvatar(e.target.files)} />
                  </div>}
                </div>
                {this.props.tournamentInfo != null && this.props.tournamentInfo.Config != null && this.props.tournamentInfo.Tournament != null &&
                  ((this.props.tournamentInfo.Config as IParams).canEdit === true ?
                    ((this.props.tournamentInfo.Tournament as IParams).status === 'initializing' ?
                      <div className="TournamentInfo-login-container">
                        <div
                          className="TournamentInfo-login"
                          onClick={this.handleStartTournament}
                        >
                          <h4 className="TournamentInfo-login-text">Bắt đầu giải</h4>
                        </div>
                      </div> : ((this.props.tournamentInfo.Tournament as IParams).status === 'processing' ?
                        <div className="TournamentInfo-login-container">
                          <div
                            className="TournamentInfo-login"
                            onClick={this.handleFinishTournament}
                          >
                            <h4 className="TournamentInfo-login-text">Kết thúc giải</h4>
                          </div>
                        </div> : null)) : (cookies.get(COOKIES_TYPE.AUTH_TOKEN) != null && (this.props.tournamentInfo.Tournament as IParams).status === 'opening' && <div className="TournamentInfo-login-container">
                          <div
                            className="TournamentInfo-login"
                            onClick={this.handleJoinTournament}
                          >
                            <h4 className="TournamentInfo-login-text">Tham gia giải</h4>
                          </div>
                        </div>))
                }
                {/* {this.props.tournamentInfo != null && (this.props.tournamentInfo as IParams).Config != null &&
              (((this.props.tournamentInfo as unknown as IParams).Config as unknown as IParams).canEdit === true ?
                (this.props.tournamentInfo.Tournament != null && (
                  (this.props.tournamentInfo.Tournament as unknown as IParams).status === 'initializing' ?
                    <div className="TournamentInfo-login-container">
                      <div
                        className="TournamentInfo-login"
                        onClick={this.handleStartTournament}
                      >
                        <h4 className="TournamentInfo-login-text">Bắt đầu giải</h4>
                      </div>
                    </div> : ((this.props.tournamentInfo.Tournament as unknown as IParams).status === 'processing' ?
                      <div className="TournamentInfo-login-container">
                        <div
                          className="TournamentInfo-login"
                          onClick={this.handleFinishTournament}
                        >
                          <h4 className="TournamentInfo-login-text">Kết thúc giải</h4>
                        </div>
                      </div> : null))) :
                (cookies.get(COOKIES_TYPE.AUTH_TOKEN) != null && (this.props.tournamentInfo.Tournament as unknown as IParams).status === 'opening' &&
                (<div className="TournamentInfo-login-container">
                  <div
                    className="TournamentInfo-login"
                    onClick={this.handleJoinTournament}
                  >
                    <h4 className="TournamentInfo-login-text">Tham gia giải</h4>
                  </div>
                </div>)
              ))
            } */}
                {this.props.tournamentInfo != null &&
                  <div className="TournamentInfo-content-info-advanced-info-container">
                    <CustomTab tabList={this.tabList} componentList={this.componentList} selectedIndex={0}></CustomTab>
                  </div>
                }
              </div>
            </div>
            <CustomModal
              customStyles={customStyles}
              handleCloseModal={this.handleCloseModal}
              showModal={this.state.showJoinModal}
              handleConfirmModal={this.handleConfirmModal}
            >
              <div className={'TournamentInfo-join-tournament-form-competition-header'}>
                <h3>Form đăng ký dự thi</h3>
              </div>
              <div className={'TournamentInfo-join-tournament-form-competition-option'}>
                <p>Chọn cuộc thi</p>
                <Select
                  options={allCompetitionOptions}
                  className="Select"
                  defaultValue={this.state.selectedCompetitionInForm}
                  value={this.state.selectedCompetitionInForm}
                  onChange={this.onChangeSelectedCompetitionInForm}
                  maxMenuHeight={140}
                />
                {this.state.selectedCompetitionInFormError === true && <p style={{ color: 'red' }}>{this.state.selectedCompetitionInFormErrorContent}</p>}
              </div>
              <TextInput label={'Tên đội'} value={this.state.teamNameInForm} onChangeText={this.onChangeTeamNameInForm} error={this.state.teamNameInFormError} errorContent={this.state.teamNameInFormErrorContent} />
              <TextInput label={'Tên ngắn đội'} value={this.state.teamShortNameInForm} onChangeText={this.onChangeTeamShortNameInForm} error={this.state.teamShortNameInFormError} errorContent={this.state.teamShortNameInFormErrorContent} />
              <div className="TournamentInfo-join-tournament-container">
                <div className="TournamentInfo-join-tournament-item1">
                  <p>Tên</p>
                </div>
                <div className="TournamentInfo-join-tournament-item2">
                  <p>Giới tính</p>
                </div>
                <div className="TournamentInfo-join-tournament-item2">
                  <p>Tuổi</p>
                </div>
                <div className="TournamentInfo-join-tournament-item1">
                  <p>Email</p>
                </div>
                <div className="TournamentInfo-join-tournament-setting">
                </div>
              </div>
              {this.state.listPlayerInForm.map((item, index) => <Player onDelete={this.onDeletePlayer} info={item} freeToEdit={true} key={index} index={index} />)}
              <div className="TournamentInfo-join-tournament-container">
                <div className="TournamentInfo-join-tournament-item1">
                  <input type={'text'} onChange={this.onChangePlayerNameInForm} value={this.state.playerNameInForm} />
                </div>
                <div className="TournamentInfo-join-tournament-item2">
                  <Select
                    options={genderOptions}
                    className="Select"
                    defaultValue={this.state.playerGenderInForm}
                    value={this.state.playerGenderInForm}
                    onChange={this.onChangePlayerGenderInForm}
                  />
                </div>
                <div className="TournamentInfo-join-tournament-item2">
                  <input style={{ width: '70px' }} type={'text'} onChange={this.onChangePlayerAgeInForm} value={this.state.playerAgeInForm} />
                </div>
                <div className="TournamentInfo-join-tournament-item1">
                  <input type={'text'} onChange={this.onChangePlayerEmailInForm} value={this.state.playerEmailInForm} />
                </div>
                <div className="TournamentInfo-join-tournament-setting">
                  <IoMdAddCircleOutline color={'white'} size={25} style={{ marginLeft: '3px', marginRight: '3px' }} onClick={this.addPlayer} />
                </div>
              </div>
              {this.state.playerNameInFormError === true && <p style={{ color: 'red' }}>{this.state.playerNameInFormErrorContent}</p>}
              {this.state.playerEmailInFormError === true && <p style={{ color: 'red' }}>{this.state.playerEmailInFormErrorContent}</p>}
            </CustomModal>
          </div>
        </ReduxBlockUi>
      </ReduxBlockUi>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    tournamentInfo: state.tournamentInfo,
    listSportsByTournament: state.listSportsByTournament,
    listCompetitionsBySportAndTournament: state.listCompetitionsBySportAndTournament,
    allCompetitionByTournamentId: state.allCompetitionByTournamentId,
  };
};

export default connect(
  mapStateToProps,
  { queryAllCompetitionsByTournamentId, deleteListSelectingTeam, onEditBracketMode, updateBackgroundTournament, updateAvatarTournament, queryTournamentInfo, querySportsByTournament, queryCompetitionsBySportAndTournament, startTournament, finishTournament }
)(TournamentInfo);