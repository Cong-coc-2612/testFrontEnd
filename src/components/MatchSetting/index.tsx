import React from 'react';
import { connect } from 'react-redux';
import { IState } from 'redux-saga/reducers';
// import './styles.css';

interface IMatchSettingProps extends React.ClassAttributes<MatchSetting> {
}

interface IMatchSettingState {
}


class MatchSetting extends React.Component<IMatchSettingProps, IMatchSettingState> {
  constructor(props: IMatchSettingProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div
        className="MatchSetting-container"
      >
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
  null
)(MatchSetting);