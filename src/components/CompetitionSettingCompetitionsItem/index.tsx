import React from 'react';
import { connect } from 'react-redux';
import { Styles } from 'react-modal';
import Select, { ValueType, OptionTypeBase } from 'react-select';
import { MdDelete } from 'react-icons/md';
import TextInput from 'components/TextInput';
import CustomModal from 'components/CustomModal';
import { IParams, IBigRequest } from 'interfaces/common';
import './styles.css';
import Teams from 'components/Teams';
import { Link } from 'react-router-dom';

interface ICompetitionSettingCompetitionsItemProps extends React.ClassAttributes<CompetitionSettingCompetitionsItem> {
  info: IParams;
  index: number;
  listCompetition: IParams[] | null;
  tournamentId: number;
  tournamentInfo: IParams | null;
}

interface ICompetitionSettingCompetitionsItemState {
  showModal: boolean;
  seeMoreInfo: boolean;
  selectedSport: ValueType<OptionTypeBase>;
  selectedCompetitionFormatPhase1: ValueType<OptionTypeBase>;
  selectedCompetitionFormatPhase2: ValueType<OptionTypeBase>;
  maxAmountOfTeam: number;
  maxAmountOfTeamError: boolean;
  maxAmountOfTeamErrorContent: string;
  competitionName: string;
  competitionNameError: boolean;
  competitionNameErrorContent: string;
  maxAmountMemberOfTeam: number;
  minAmountMemberOfTeam: number;
  minAmountMemberOfTeamError: boolean;
  maxAmountMemberOfTeamError: boolean;
  maxAmountMemberOfTeamErrorContent: string;
  minAmountMemberOfTeamErrorContent: string;
  maxAmountTeamOfGroup: number;
  maxAmountTeamOfGroupError: boolean;
  maxAmountTeamOfGroupErrorContent: string;
  limitAmountOfTeamchecked: boolean;
  onePhase: boolean;
  twoPhase: boolean;
  onEditMode: boolean;
  competitionFormatError: boolean;
  competitionFormatErrorContent: string;
  competitionSportError: boolean;
  competitionSportErrorContent: string;
}

const sportOptions = [
  { value: 1, label: 'Bóng đá' },
  { value: 2, label: 'Bóng chuyền' },
  { value: 3, label: 'Bóng bàn' },
  { value: 4, label: 'Bóng rổ' },
  { value: 5, label: 'Cờ vua' },
  { value: 6, label: 'Cờ vây' },
  { value: 7, label: 'Cờ tướng' },
  { value: 8, label: 'Cầu lông' },
  { value: 9, label: 'Quần vợt' },
  { value: 10, label: 'Vovinam' },
  { value: 11, label: 'Taekwondo' },
  { value: 12, label: 'Karatedo' },
  { value: 13, label: 'Pencak silat' },
  { value: 14, label: 'Wushu' },
  { value: 15, label: 'Judo' },
  { value: 16, label: 'E-Sport' },
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

const competitionFormatOptions1 = [
  { value: 1, label: 'Đấu loại' },
  { value: 2, label: 'Đấu vòng tròn tính điểm' },
];

const competitionFormatOptions2 = [
  { value: 1, label: 'Đấu loại' },
];

class CompetitionSettingCompetitionsItem extends React.Component<ICompetitionSettingCompetitionsItemProps, ICompetitionSettingCompetitionsItemState> {
  constructor(props: ICompetitionSettingCompetitionsItemProps) {
    super(props);
    this.state = {
      showModal: false,
      competitionFormatError: false,
      competitionFormatErrorContent: '',
      competitionSportError: false,
      competitionSportErrorContent: '',
      competitionName: this.props.info.name as string,
      competitionNameError: false,
      competitionNameErrorContent: '',
      maxAmountTeamOfGroup: 0,
      maxAmountTeamOfGroupError: false,
      maxAmountTeamOfGroupErrorContent: '',
      seeMoreInfo: false,
      maxAmountOfTeamError: false,
      maxAmountOfTeamErrorContent: '',
      maxAmountMemberOfTeamError: false,
      maxAmountMemberOfTeamErrorContent: '',
      minAmountMemberOfTeamError: false,
      minAmountMemberOfTeamErrorContent: '',
      selectedSport: sportOptions.find(element => element.value === this.props.info.sportId),
      selectedCompetitionFormatPhase1:
        this.props.info.groupStage === false ?
          (competitionFormatOptions1.find(element => element.value === this.props.info.mainFormatId) != null ?
            competitionFormatOptions1.find(element => element.value === this.props.info.mainFormatId) :
            null) :
          (competitionFormatOptions1.find(element => element.value === this.props.info.groupStageFormatId) !== null ?
            competitionFormatOptions1.find(element => element.value === this.props.info.groupStageFormatId) :
            null),
      selectedCompetitionFormatPhase2:
        this.props.info.groupStage === true ?
          (competitionFormatOptions2.find(element => element.value === this.props.info.mainFormatId) != null ?
            competitionFormatOptions2.find(element => element.value === this.props.info.mainFormatId) :
            null) :
          null,
      maxAmountOfTeam: 0,
      maxAmountMemberOfTeam: 0,
      minAmountMemberOfTeam: 0,
      limitAmountOfTeamchecked: false,
      onePhase: this.props.info.groupStage === false,
      twoPhase: this.props.info.groupStage === true,
      onEditMode: false,
    };
  }

  shouldComponentUpdate(nextProps: ICompetitionSettingCompetitionsItemProps, nextState: ICompetitionSettingCompetitionsItemState) {
    if (this.props.info !== nextProps.info) {
      this.setState({
        onEditMode: false,
      });
    }
    return true;
  }

  private handleSeeMore = () => {
    if (this.state.onEditMode === true) {
      return;
    }
    this.setState({
      seeMoreInfo: !this.state.seeMoreInfo,
    });
  }

  private onChangeLimitAmountOfTeam = () => {
    this.setState({
      limitAmountOfTeamchecked: !this.state.limitAmountOfTeamchecked,
    });
  };

  private onChangeSport = (value: ValueType<OptionTypeBase>) => {
    this.setState({
      selectedSport: value,
    });
  }

  private onChangeCompetitionName = (value: string) => {
    this.setState({
      competitionName: value,
    });
  }

  private startEditMode = () => {
    this.setState({
      onEditMode: true,
    });
  }

  private handleConfirmModal = () => {
  }

  private validate = () => {
    let competitionNameError = false;
    let competitionNameErrorContent = '';
    let competitionFormatError = false;
    let competitionFormatErrorContent = '';
    let competitionSportError = false;
    let competitionSportErrorContent = '';
    if (this.state.competitionName.trim() === '') {
      competitionNameError = true;
      competitionNameErrorContent = 'Tên cuộc thi không được trống';
    }
    if (this.props.listCompetition!.filter((item) => item !== this.props.info).find(element => element.name === this.state.competitionName)) {
      competitionNameError = true;
      competitionNameErrorContent = 'Tên cuộc thi này đã tồn tại';
    }
    if (this.state.selectedCompetitionFormatPhase1 == null || (this.state.twoPhase && this.state.selectedCompetitionFormatPhase2 == null)) {
      competitionFormatError = true;
      competitionFormatErrorContent = 'Thể thức không được trống';
    }
    if (this.state.selectedSport == null) {
      competitionSportError = true;
      competitionSportErrorContent = 'Thể thức không được trống';
    }

    return { competitionNameError, competitionNameErrorContent, competitionFormatError, competitionFormatErrorContent, competitionSportError, competitionSportErrorContent };
  }

  private handleCloseModal = () => {
    this.setState({
      showModal: false,
    });
  }

  // private handleSaveChange = () => {
  //   const { competitionNameError, competitionNameErrorContent, competitionFormatError, competitionFormatErrorContent, competitionSportError, competitionSportErrorContent } = this.validate();
  //   this.setState({
  //     competitionNameError,
  //     competitionNameErrorContent,
  //     competitionFormatError,
  //     competitionFormatErrorContent,
  //     competitionSportError,
  //     competitionSportErrorContent
  //   });
  //   if (competitionNameError === true || competitionFormatError === true) {
  //     return;
  //   }
  //   const params = {
  //     path: '',
  //     param: {
  //       id: this.props.info.id,
  //     },
  //     data: {
  //       name: this.state.competitionName,
  //       tournamentId: this.props.tournamentId,
  //       sportId: (this.state.selectedSport as IParams).value,
  //       description: '',
  //       mainFormatId: this.state.onePhase === true ? (this.state.selectedCompetitionFormatPhase1 as IParams).value : (this.state.selectedCompetitionFormatPhase2 as IParams).value,
  //       groupStageFormatId: this.state.onePhase === true ? null : (this.state.selectedCompetitionFormatPhase1 as IParams).value,
  //       groupStage: this.state.twoPhase === true,
  //       status: 'dit me thang hieu',
  //       url: 'dit cu thang hieu',
  //       indexOfEdit: this.props.index,
  //     },
  //   };

  //   this.props.editCompetitionInfo(params);
  // }

  private onChangeCompetitionFormatPhase1 = (value: ValueType<OptionTypeBase>) => {
    this.setState({
      selectedCompetitionFormatPhase1: value,
    });
  }

  private onChangeCompetitionFormatPhase2 = (value: ValueType<OptionTypeBase>) => {
    this.setState({
      selectedCompetitionFormatPhase2: value,
    });
  }

  private OnChoose1 = () => {
    this.setState({
      onePhase: true,
      twoPhase: false,
    });
  }

  private OnChoose2 = () => {
    this.setState({
      onePhase: false,
      twoPhase: true,
    });
  }

  private onChangeMaxAmountOfTeam = (value: string) => {
    let tempValue = 0;
    if (!isNaN(value as unknown as number)) {
      tempValue = Number(value);
    } else {
      tempValue = 0;
    }
    this.setState({ maxAmountOfTeam: tempValue, });
  }

  private onChangeMaxAmountMemberOfTeam = (value: string) => {
    let tempValue = 0;
    if (!isNaN(value as unknown as number)) {
      tempValue = Number(value);
    } else {
      tempValue = 0;
    }
    this.setState({ maxAmountMemberOfTeam: tempValue, });
  }

  private onChangeMinAmountMemberOfTeam = (value: string) => {
    let tempValue = 0;
    if (!isNaN(value as unknown as number)) {
      tempValue = Number(value);
    } else {
      tempValue = 0;
    }
    this.setState({ minAmountMemberOfTeam: tempValue, });
  }

  private onChangeMaxAmountTeamOfGroup = (value: string) => {
    let tempValue = 0;
    if (!isNaN(value as unknown as number)) {
      tempValue = Number(value);
    } else {
      tempValue = 0;
    }
    this.setState({ maxAmountTeamOfGroup: tempValue, });
  }

  private handleOpenModal = () => {
    this.setState({
      showModal: true,
    });
  }

  render() {
    return (
      // <ReduxBlockUi
      //   tag="div"
      //   block={EDIT_COMPETITION_INFO}
      //   unblock={[EDIT_COMPETITION_INFO_SUCCESS, EDIT_COMPETITION_INFO_FAILED]}
      // >
        <div className="CompetitionSettingCompetitionsItem-info-container">
          <div className="CompetitionSettingCompetitionsItem-container">
          <Link to={`/competition/${this.props.info.id}`} style={{ textDecoration: 'none', color: 'white' }} target={'_blank'} >
            <div className="CompetitionSettingCompetitionsItem-container-container">
              <div className="CompetitionSettingCompetitionsItem-order-number-container">
                <div className="CompetitionSettingCompetitionsItem-order-number-box">
                  <p>{this.props.index + 1}</p>
                </div>
              </div>
              <div className={`CompetitionSettingCompetitionsItem-team-name-container ${this.state.onEditMode === true && 'CompetitionSettingCompetitionsItem-team-name-container-paddingTop'}`}>
                {this.state.onEditMode === false ? <p>{this.state.competitionName}</p> :
                  <TextInput value={this.state.competitionName} label={`Nhập tên cuộc thi`} onChangeText={this.onChangeCompetitionName} error={this.state.competitionNameError} errorContent={this.state.competitionNameErrorContent} />}
              </div>
              <div className="CompetitionSettingCompetitionsItem-team-setting-container">
                <div className="CompetitionSettingCompetitionsItem-team-setting-container-container">
                  <MdDelete className="CompetitionSettingCompetitionsItem-team-setting-icon" />
                </div>
              </div>
            </div>
          </Link>
          </div>
          {/* {this.state.seeMoreInfo === true &&
            <div className="CompetitionSettingCompetitionsItem-moreInfo-container">
              <div className="CompetitionSettingCompetitionsItem-moreInfo-normalInfo-container">
                <div className="TournamentInfo-info-item">
                  <p className="TournamentInfo-text">Bộ môn: {this.state.onEditMode === false && (this.state.selectedSport as IParams).label}</p>
                  {this.state.onEditMode === true && <Select
                    options={sportOptions}
                    className="Select"
                    defaultValue={this.state.selectedSport}
                    value={this.state.selectedSport}
                    onChange={this.onChangeSport}
                    menuPlacement={'top'}
                  />}
                </div>
                {this.state.competitionSportError === true && <div className="TournamentInfo-info-item">
                  <p className={'TextInput-error-text'}>{this.state.competitionSportErrorContent}</p>
                </div>}
                {this.state.onEditMode === true ? <div className="TournamentInfo-info-item">
                  <p className="TournamentInfo-text">Cách tổ chức giải:</p>
                  <input type="radio" name="competitionType" onClick={this.OnChoose1} checked={this.state.onePhase} readOnly />
                  <label onClick={this.OnChoose1}>1 giai đoạn</label>
                  <input type="radio" name="competitionType" onClick={this.OnChoose2} checked={this.state.twoPhase} readOnly />
                  <label onClick={this.OnChoose2}>2 giai đoạn</label>
                </div> :
                  <div className="TournamentInfo-info-item">
                    <p className="TournamentInfo-text">Cách tổ chức giải: {this.state.onePhase ? '1 giai đoạn' : '2 giai đoạn'}</p>
                  </div>}
                {this.state.onEditMode !== true ? <div className="TournamentInfo-info-item">
                  <p className="TournamentInfo-text">{`Thể thức${this.state.onePhase === true ? ': ' : ' giai đoạn 1: '}${this.state.selectedCompetitionFormatPhase1 != null ? (this.state.selectedCompetitionFormatPhase1 as IParams).label : '(Chưa có)'}`}</p>
                  {this.state.twoPhase === true && <p className="TournamentInfo-text">{`Thể thức giai đoạn 2: ${this.state.selectedCompetitionFormatPhase2 != null ? (this.state.selectedCompetitionFormatPhase2 as IParams).label : '(Chưa có)'}`}</p>}
                </div> :
                  <div className="TournamentInfo-info-item">
                    <p className="TournamentInfo-text">{`Thể thức${this.state.onePhase === true ? '' : ' giai đoạn 1'}`}</p>
                    <Select
                      options={competitionFormatOptions1}
                      className="Select"
                      defaultValue={this.state.selectedCompetitionFormatPhase1}
                      value={this.state.selectedCompetitionFormatPhase1}
                      onChange={this.onChangeCompetitionFormatPhase1}
                      menuPlacement={'top'}
                    />
                    {this.state.twoPhase === true && <p className="TournamentInfo-text">Thể thức giai đoạn 2</p>}
                    {this.state.twoPhase === true && <Select
                      options={competitionFormatOptions2}
                      className="Select"
                      defaultValue={this.state.selectedCompetitionFormatPhase2}
                      value={this.state.selectedCompetitionFormatPhase2}
                      onChange={this.onChangeCompetitionFormatPhase2}
                      menuPlacement={'top'}
                    />}
                  </div>}
                {this.state.competitionFormatError === true && <div className="TournamentInfo-info-item">
                  <p className={'TextInput-error-text'}>{this.state.competitionFormatErrorContent}</p>
                </div>}
                {this.state.selectedCompetitionFormatPhase1 && (this.state.selectedCompetitionFormatPhase1 as IParams).value === 2 && (this.state.onEditMode === true ? <div className="TournamentInfo-info-item">
                  <TextInput value={this.state.maxAmountTeamOfGroup as unknown as string} label={`Giới hạn số lượng đội trong 1 bảng${this.state.twoPhase ? ' của giai đoạn 1' : ''}`} onChangeText={this.onChangeMaxAmountTeamOfGroup} error={this.state.maxAmountTeamOfGroupError} errorContent={this.state.maxAmountTeamOfGroupErrorContent} />
                </div> :
                  <div className="TournamentInfo-info-item">
                    <p>{`Giới hạn số lượng đội trong 1 bảng${this.state.twoPhase ? ' của giai đoạn 1: ' : ': '}${this.state.maxAmountTeamOfGroup}`}</p>
                  </div>)}
                {this.state.onEditMode === true && <div className="TournamentInfo-info-item">
                  <div className="CompetitionSettingCompetitionsItem-option-container-item">
                    <label className="Checkbox-label">
                      <input
                        type="checkbox"
                        checked={this.state.limitAmountOfTeamchecked}
                        onChange={this.onChangeLimitAmountOfTeam}
                      />
            Giới hạn số đội tối đa
          </label>
                  </div>
                </div>}
                {
                  this.state.limitAmountOfTeamchecked === true ?
                    (this.state.onEditMode === true ? <TextInput value={this.state.maxAmountOfTeam as unknown as string} label={'Số lượng đội tối đa'} onChangeText={this.onChangeMaxAmountOfTeam} error={this.state.maxAmountOfTeamError} errorContent={this.state.maxAmountOfTeamErrorContent} /> : <p>Số lượng đội tối đa: {this.state.maxAmountOfTeam}</p>)
                    : (this.state.onEditMode === true ? null : <p>Không giới hạn số lượng đội tối đa</p>)
                }
                <div className="CompetitionSettingCompetitionsItem-button-container2">
                  <div className="CompetitionSettingCompetitionsItem-button" onClick={this.handleOpenModal}>
                    <h4 className="CompetitionSettingCompetitionsItem-button-text2">Xem các đội tham gia</h4>
                  </div>
                </div>
                {this.state.onEditMode === true ? <div className="CompetitionSettingCompetitionsItem-button-container">
                  <div className="CompetitionSettingCompetitionsItem-button" onClick={this.handleSaveChange}>
                    <h4 className="CompetitionSettingCompetitionsItem-button-text">Lưu</h4>
                  </div>
                </div> :
                  <div className="CompetitionSettingCompetitionsItem-button-container">
                    <div className="CompetitionSettingCompetitionsItem-button" onClick={this.startEditMode}>
                      <h4 className="CompetitionSettingCompetitionsItem-button-text">Chỉnh sửa</h4>
                    </div>
                  </div>}
              </div>
            </div>
          } */}
        <CustomModal
          customStyles={customStyles}
          handleCloseModal={this.handleCloseModal}
          showModal={this.state.showModal}
          handleConfirmModal={this.handleConfirmModal}
          confirmButtonVisible={false}
        >
          <Teams competitionInfo={this.props.info} tournamentInfo={this.props.tournamentInfo} id={this.props.info.id as number} type={'competition'} />
        </CustomModal>
        </div>
      // </ReduxBlockUi>
    );
  }
}

export default connect(
  null,
  null
)(CompetitionSettingCompetitionsItem);