import React from 'react';
import { connect } from 'react-redux';
import { IState } from 'redux-saga/reducers';
// import './styles.css';

interface IMatchDetailProps extends React.ClassAttributes<MatchDetail> {
}

interface IMatchDetailState {
}


class MatchDetail extends React.Component<IMatchDetailProps, IMatchDetailState> {
  constructor(props: IMatchDetailProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div
        className="MatchDetail-container"
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
)(MatchDetail);