import {
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SearchIcon from "@material-ui/icons/Search";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import firebase from "../firebase.js";

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      anchorEl: null,
      open: false,
      confirm: false,
      value: "",
      response: { error: true },
      reload: false,
    };
  }

  redeemEvent() {
    fetch("https://api.youthcomputing.ca/shop/redeem/event", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({
        userId: this.props.uid,
        eventCode: this.state.value,
      }),
    })
      .then((response) => response.json())
      // ...then we update the users state
      .then(
        (obj) =>
          this.setState({
            response: obj,
          }),
        console.log(this.state.response)
      )
      .catch((error) => {
        console.error("There was an error!", error);
      });
    this.setState({ open: false, confirm: true });
  }

  successDialog() {
    if (!this.state.response.error) {
      return (
        <Dialog
          open={this.state.confirm}
          onClose={() => this.setState({ confirm: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Success!</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => window.location.reload(false)}
              color="primary"
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      );
    } else {
      return (
        <Dialog
          open={this.state.confirm}
          onClose={() => this.setState({ confirm: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.response.message}
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => this.setState({ confirm: false })}
              color="primary"
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }
  createNavbar() {
    if (this.props.uid !== null) {
      return (
        <React.Fragment>
          <Paper elevation={0.5} className="navbarPaper">
            <Typography component="h5" variant="h4">
              YC Store
            </Typography>
            <TextField
              className="navbarSearch"
              onChange={(e) => this.props.onChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <div className="loggedInNavBar">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className="loggedInNavBarItem"
                onClick={() => this.setState({ open: true })}
              >
                Redeem Event
              </Button>
              <Dialog
                open={this.state.open}
                onClose={() => this.setState({ open: false })}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Redeem Event</DialogTitle>
                <DialogContent>
                  <DialogContentText>Enter your code.</DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Redeem Code"
                    type="code"
                    fullWidth
                    onChange={(event) => {
                      this.setState({
                        value: event.target.value,
                      });
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => this.setState({ open: false })}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    // onClick={() => this.setState({ confirm: true })}
                    onClick={() => this.redeemEvent()}
                    color="primary"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              {this.successDialog()}
              <Avatar className="loggedInNavBarItem3">
                {this.props.userInfo.points}
              </Avatar>
              <h5
                className="loggedInNavBarItem2"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(event) =>
                  this.setState({ anchorEl: event.currentTarget })
                }
              >
                {this.props.userInfo.name}
              </h5>{" "}
            </div>
            <Menu
              id="simple-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={() => this.setState({ anchorEl: null })}
            >
              <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
            </Menu>
          </Paper>
        </React.Fragment>
      );
    } else {
      return (
        <Paper elevation={0.5} className="navbarPaper">
          <Typography component="h5" variant="h4">
            YC Store
          </Typography>
          <TextField
            className="navbarSearch"
            onChange={(e) => this.props.onChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            component={Link}
            to="/login"
            className="navbarItem"
          >
            Sign In
          </Button>
        </Paper>
      );
    }
  }

  render() {
    return <React.Fragment>{this.createNavbar()}</React.Fragment>;
  }

  logout() {
    firebase.logout();
    this.props.onLogout();
    this.setState({ anchorEl: null });
  }
}

export default NavBar;
