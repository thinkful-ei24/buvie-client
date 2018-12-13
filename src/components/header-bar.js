import React from 'react';
import { connect } from 'react-redux';
import { clearAuth } from '../actions/auth';
import { resetUser } from '../actions/users';
import { resetMovies } from '../actions/movies-action';
import { clearAuthToken } from '../local-storage';
import styled from 'styled-components';
import logoName from '../images/buvielogoname.svg';
import DropDown from './dropdown';

const StyledHeaderBar = styled.div`

  display: grid;
  grid-template-columns: 8fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "logo menu" "logout logout" "notifications notifications";

  .menu-button {
    display: block;
    grid-area: menu;
    font-size: 80%;
    padding: 0.1rem .3rem;
    cursor: pointer;
    text-decoration: none;
    line-height: 1;
    border: 1px solid transparent;
    border-radius: .25rem;
  }

  .nav-logo {
    grid-area: logo;
    width: 8rem;
    position: relative;
    left: 0.5rem;
    top: 0.5rem;
  }

  .nav-logout-btn {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    grid-area: logout;
    background-color: #a33944;
    color: #000;
    justify-self: right;
    width: 100%;
    height: 3rem;
    border: none;
    cursor: pointer;
  }

  .notifications {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    color: #fff;
    font-size: 1.6rem;
    position: relative;
    right: 3rem;
    grid-area: notifications;
    }

  .welcome-message {
    display: none;
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 0.2fr 0.2fr 0.1fr;
    grid-template-areas: "logo notifications profile logout";
    text-align: center;

    .welcome-message {
      display: block;
      color: #fff;
      font-size: 1.6rem;
      position: relative;
      right: 1rem;
    }

    .notifications {
      display: block;
      color: #fff;
      font-size: 1.6rem;
      position: relative;
      right: 3rem;
      grid-area: notifications;
    }

    .nav-logout-btn {
      display: block;
      grid-area: logout;
      background-color: #a33944;
      color: #000;
      justify-self: center;
      width: 10rem;
      height: 3rem;
      margin-right: 2rem;
      border: none;
      cursor: pointer;
    }

    .menu-button {
      display: none;
    }

  }
`;

export class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true
    };
  }

  logOut() {
    this.props.dispatch(clearAuth());
    this.props.dispatch(resetMovies());
    this.props.dispatch(resetUser());
    clearAuthToken();
  }

  toggleMenu() {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    });
  }

  render() {
    let logOutButton;
    if (this.props.loggedIn) {
      logOutButton = (
        <button className="nav-logout-btn" onClick={() => this.logOut()}>
          Log out
        </button>
      );
    }
    let notifications;
    if (this.props.loggedIn) {
      notifications = (
        <DropDown
          className='notifications'
          isCollapsed={this.state.isCollapsed}
          title='Notifications'
          listArr={this.props.notifications}
        />
      );
    }
    return (
      <StyledHeaderBar className="header-bar" isCollapsed={this.state.isCollapsed}>
        <img src={logoName} alt="buvie logo" className="nav-logo" />
        {this.props.loggedIn ?
          <h2 className="welcome-message">Welcome, {this.props.user.username}!</h2>
          :
          <div></div>
        }
        <button className="menu-button" onClick={() => this.toggleMenu()}>
          <i className="material-icons">menu</i>
        </button>
        {notifications}
        {logOutButton}
      </StyledHeaderBar>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null,
  user: state.auth.currentUser,
  notifications: state.user.notifications
});

export default connect(mapStateToProps)(HeaderBar);
