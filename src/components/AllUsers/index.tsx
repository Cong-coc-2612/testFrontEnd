import React from 'react';
import { connect } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'pagination.css';
import UserOverview from 'components/UserOverview';
import Paging from 'components/Paging';
import { IBigRequest, IParams } from 'interfaces/common';
import { IState } from 'redux-saga/reducers';
import { searchUsers } from 'components/Header/actions';
import { queryListUsers } from './actions';
import './styles.css';

interface IAllUsersProps extends React.ClassAttributes<AllUsers> {
  listUsers: IParams | null;
  globalSearchString: string;

  queryListUsers(param: IBigRequest): void;
  searchUsers(param: IBigRequest): void;
}

interface IAllUsersState {
  activePage: number;
}

class AllUsers extends React.Component<IAllUsersProps, IAllUsersState> {
  constructor(props: IAllUsersProps) {
    super(props);
    this.state = {
      activePage: 1,
    };
  }

  shouldComponentUpdate(nextProps: IAllUsersProps, nextState: IAllUsersState) {
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
  
  private requestData = () => {
    const params = {
      path: '',
      param: {
        page: this.state.activePage,
        limit: 3,
        searchString: this.props.globalSearchString,
      },
      data: {},
    }
    this.props.queryListUsers(params);
  }

  private onChangeSelectedPage = (pageNumber: number) => {
    this.setState({ activePage: pageNumber }, () => {
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
        this.props.searchUsers(params);
      } else {
        this.requestData();
      }
    });
  }

  render() {
    return (
      <div className="AllUsers-container-container">
        <p className="AllUsers-header-text">Danh sách người dùng</p>
        {this.props.globalSearchString !== '' && <p className="AllUsers-search-text">Kết quả tìm kiếm cho: "{this.props.globalSearchString}"</p>}
        <div className="AllUsers-container">
          {this.props.listUsers && this.props.listUsers.Users ? ((this.props.listUsers.Users as unknown as IParams[]).length > 0 ? (this.props.listUsers.Users as unknown as IParams[]).map(
            (item, index) => <UserOverview info={item} index={index} key={index} />) : <p>Không tìm thấy kết quả nào!</p>) :
            <Skeleton />
          }
        </div>
        <Paging currentPage={this.state.activePage} totalPage={this.props.listUsers != null ? this.props.listUsers.TotalPage as number : 0} onChangeSelectedPage={this.onChangeSelectedPage} />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    listUsers: state.listUsers,
    globalSearchString: state.globalSearchString,
  };
};

export default connect(
  mapStateToProps,
  { queryListUsers, searchUsers }
)(AllUsers);