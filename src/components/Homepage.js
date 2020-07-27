import React, { Component } from "react";
import NavBar from "./NavBar.js";
import Promotions from "./Promotions.js";
import Store from "./Store.js";
import Footer from "./Footer.js";
import firebase from "../firebase.js";
import { CircularProgress } from "@material-ui/core";

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      search: "",
      user: null,
      userInfo: null,
      isLoading: true,
    };
  }

  getUserInfo(uid) {
    fetch("https://api.youthcomputing.ca/users/" + uid)
      .then((response) => response.json())
      // ...then we update the users state
      .then((info) =>
        this.setState({
          userInfo: info.userData,
          isLoading: false,
        })
      )
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  componentDidMount() {
    (async () => {
      try {
        var user = await firebase.isLoggedIn();
        if (user !== null) {
          this.setState({ user: user.uid });
          this.getUserInfo(user.uid);
        }
      } catch (error) {
        this.setState({ isLoading: false });
      }
    })();
  }

  render() {
    return (
      <div className="background">
        {this.state.isLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <NavBar
              onChange={(value) => this.setState({ search: value })}
              onLogout={() => this.setState({ user: null })}
              uid={this.state.user}
              userInfo={this.state.userInfo}
            />
            <Promotions />
            <Store
              searchTerm={this.state.search}
              isLoggedIn={this.state.user}
              userInfo={this.state.userInfo}
            />
            <Footer />
          </div>
        )}
      </div>
    );
  }
}

export default HomePage;
