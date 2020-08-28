import React from 'react';
import { connect } from 'react-redux';
import './styles.css';

interface IBracketRankProps extends React.ClassAttributes<BracketRank> {
}

interface IBracketRankState {
}

class BracketRank extends React.Component<IBracketRankProps, IBracketRankState> {
  constructor(props: IBracketRankProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="BracketRank-container">
        <div className="BracketRank-item-container BracketRank-menuItem-container">
          <div className="BracketRank-item-orderNumber-container">
            <p>Hạng</p>
          </div>
          <div className="BracketRank-item-teamName-container">
            <p>Tên đội</p>
          </div>
          <div className="BracketRank-item-managerName-container">
            <p>Tên Người quản lý đội</p>
          </div>
          <div className="BracketRank-item-matchHistory-container">
            <p>Lịch sử đấu</p>
          </div>
          <div className="BracketRank-item-score-container">
            <p>Điểm</p>
          </div>
        </div>
        <div className="BracketRank-item-container">
          <div className="BracketRank-item-orderNumber-container">
            <p>1</p>
          </div>
          <div className="BracketRank-item-teamName-container">
            <p>Đội A</p>
          </div>
          <div className="BracketRank-item-managerName-container">
            <p>Phạm Minh Hiếu</p>
          </div>
          <div className="BracketRank-item-matchHistory-container">
            <p>WLWL</p>
          </div>
          <div className="BracketRank-item-score-container">
            <p>4</p>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  null
)(BracketRank);