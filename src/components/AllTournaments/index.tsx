import React from 'react';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'pagination.css';
import TournamentOverview from 'components/TournamentOverview';
import Paging from 'components/Paging';
import { IBigRequest, IParams } from 'interfaces/common';
import { IState } from 'redux-saga/reducers';
import { searchTournaments } from 'components/Header/actions';
import { queryListTournament } from './actions';
import './styles.css';

interface IAllTournamentsProps extends React.ClassAttributes<AllTournaments> {
  listTournament: IParams | null;
  globalSearchString: string;

  queryListTournament(param: IBigRequest): void;
  searchTournaments(param: IBigRequest): void;
}

interface IAllTournamentsState {
  activePage: number;
}

class AllTournaments extends React.Component<IAllTournamentsProps, IAllTournamentsState> {
  constructor(props: IAllTournamentsProps) {
    super(props);
    this.state = {
      activePage: 1,
    };
  }

  shouldComponentUpdate(nextProps: IAllTournamentsProps, nextState: IAllTournamentsState) {
    if (this.props.globalSearchString !== nextProps.globalSearchString && nextProps.globalSearchString === '') {
      this.requestData();
    }
    return true;
  }

  componentDidMount() {
    if (this.props.globalSearchString === '') {
      this.requestData();
    }
  }

  private requestData = (page = 1) => {
    const params = {
      path: '',
      param: {
        page,
        limit: 3,
      },
      data: {},
    }
    this.props.queryListTournament(params);
  }

  private onChangeSelectedPage = (pageNumber: number) => {
    if (this.props.globalSearchString !== '') {
      const params = {
        path: '',
        param: {
          page: pageNumber,
          limit: 3,
          searchString: this.props.globalSearchString,
        },
        data: {},
      };
      this.props.searchTournaments(params);
    } else {
      this.requestData(pageNumber);
    }
    this.setState({ activePage: pageNumber });
  }

  render() {
    console.log('this.props.listTournament', this.props.listTournament);
    return (
      <div className="AllTournaments-container-container">
        <p className="AllTournaments-header-text">Tất cả các giải đấu</p>
        {this.props.globalSearchString !== '' && <p className="AllTournaments-search-text">Kết quả tìm kiếm cho: "{this.props.globalSearchString}"</p>}
        <div className="AllTournaments-container">
          {this.props.listTournament && this.props.listTournament.Tournaments ? ((this.props.listTournament.Tournaments as unknown as IParams[]).length > 0 ? (this.props.listTournament.Tournaments as unknown as IParams[]).map(
            (item, index) => <TournamentOverview info={item} index={index} key={index} />) : <p>Không tìm thấy kết quả nào!</p>) :
            <Skeleton />
          }
        </div>
        {/* <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={15}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          // onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          disabledClassName={'disabled'}
        /> */}
        <Paging currentPage={this.state.activePage} totalPage={this.props.listTournament != null ? this.props.listTournament.TotalPage as number : 0} onChangeSelectedPage={this.onChangeSelectedPage} />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    listTournament: state.listTournament,
    globalSearchString: state.globalSearchString,
  };
};

export default connect(
  mapStateToProps,
  { queryListTournament, searchTournaments }
)(AllTournaments);