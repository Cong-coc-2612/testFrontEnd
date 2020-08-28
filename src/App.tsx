import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-block-ui/style.css';
import history from "utils/history";
import Login from 'screens/Login';
import SignUp from 'screens/SignUp';
import ForgotPassword from 'screens/ForgotPassword';
import Home from 'screens/Home';
import TournamentInfo from 'screens/TournamentInfo';
import Header from 'components/Header';
import Content from 'components/Content';
import UserInfo from 'screens/UserInfo';
import ChangePassword from 'screens/ChangePassword';
import AllTournaments from 'components/AllTournaments';
import CreateNewTournament from 'screens/CreateNewTournament';
import ActiveAccount from 'screens/ActiveAccount';
import CompetitionInfo from 'screens/CompetitionInfo';
import AllUsers from 'components/AllUsers';
import { setGlobalSearchString } from 'redux-saga/global-actions/SetGlobalSearchString-actions';
import { IState } from 'redux-saga/reducers';
import './App.css';
import { cookies } from 'utils/cookies';
import { COOKIES_TYPE } from 'global';

interface IAppProps extends React.ClassAttributes<App> {
  setGlobalSearchString(params: string): void;
}

interface IAppState {
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <div className="Container">
        <CookiesProvider>
          <Router history={history}>
            <Switch>
              <Route exact path={["/", "/home"]} render={() => <Header currentPage={'home'} />} />
              <Route path="/tournament/:tournamentId" render={() => <Header currentPage={'tournamentInfo'} />} />
              <Route path="/signUp" render={() => <Header currentPage={'signUp'} />} />
              <Route path="/user/:userId" render={() => <Header currentPage={'userInfo'} />} />
              <Route path="/users" render={() => <Header currentPage={'users'} />} />
              <Route path="/tournaments" render={() => <Header currentPage={'tournaments'} />} />
              <Route path="/login" render={() => <Header currentPage={'login'} />} />
              <Route path="/forgotPassword" render={() => <Header currentPage={'forgotPassword'} />} />
              <Route path="/newTournament" render={() => <Header currentPage={'newTournament'} />} />
              <Route path="/changePassword" render={() => <Header currentPage={'changePassword'} />} />
              <Route path="/active/:tokenVerify" render={() => <Header currentPage={'active'} />} />
              <Route path="/competition/:competitionId" render={() => <Header currentPage={'competitionInfo'} />} />
            </Switch>
            <Content transparent={false}>
              <Switch>
                <Route exact path={["/", "/home"]} render={() => <Home />} />
                <Route path="/tournament/:tournamentId" render={(info) => <TournamentInfo routerInfo={info} />} />
                <Route path="/tournaments" render={() => <AllTournaments />} />
                <Route path="/signUp" render={() => { return cookies.get(COOKIES_TYPE.AUTH_TOKEN) != null ? <Redirect to="/" /> : <SignUp />; }} />
                <Route path="/forgotPassword" render={() => <ForgotPassword />} />
                <Route path="/login" render={() => { return cookies.get(COOKIES_TYPE.AUTH_TOKEN) != null ? <Redirect to="/" /> : <Login />; }} />
                <Route path="/user/:userId" render={(info) => <UserInfo routerInfo={info} />} />
                <Route path="/users" render={() => <AllUsers />} />
                <Route path="/newTournament" render={() => { return cookies.get(COOKIES_TYPE.AUTH_TOKEN) == null ? <Redirect to="/login" /> : <CreateNewTournament />; }} />
                <Route path="/changePassword" render={() => { return cookies.get(COOKIES_TYPE.AUTH_TOKEN) == null ? <Redirect to="/login" /> : <ChangePassword />; }} />
                <Route path="/active/:tokenVerify" render={(info) => <ActiveAccount routerInfo={info} />} />
                <Route path="/competition/:competitionId" render={(info) => <CompetitionInfo routerInfo={info} />} />
                <Route render={() => <Redirect to="/" />} />
              </Switch>
              <ToastContainer />
            </Content>
          </Router>
        </CookiesProvider>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    currentPage: state.currentPage,
  };
};

export default connect(
  mapStateToProps,
  { setGlobalSearchString }
)(App);