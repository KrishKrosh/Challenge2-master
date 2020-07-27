import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Typography } from "@material-ui/core";

import "./styles.css";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class MediaCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      confirm: false,
      response: { error: false },
    };
  }

  redeemPrize() {
    fetch("https://api.youthcomputing.ca/shop/redeem/prize", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({
        userId: this.props.isLoggedIn,
        prizeId: this.props.prizeID,
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

  pointsNeeded() {
    return parseInt(this.props.points) - parseInt(this.props.userPoints.points);
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
            You need {this.pointsNeeded()} more points
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
  createCard() {
    if (this.props.isLoggedIn !== null) {
      return (
        <div>
          <Card className="card" id={this.props.id}>
            <CardActionArea
              className="cardHover"
              onClick={() => this.setState({ open: true })}
            >
              <CardContent>
                <CardMedia component="img" image={this.props.image} />
                <br />
                <Typography gutterBottom className="cardName">
                  {this.props.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {this.props.category}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {this.props.points}
                </Typography>
                <Typography variant="body1" component="h6" className="redeem">
                  Redeem Now
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Dialog
            open={this.state.open}
            onClose={() => this.setState({ open: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to redeem this prize?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ open: false })}
                color="primary"
              >
                No
              </Button>
              <Button
                onClick={() => this.redeemPrize()}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.confirm}
            onClose={() => this.setState({ confirm: false })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to redeem this prize?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ confirm: false })}
                color="primary"
              >
                No
              </Button>
              <Button
                onClick={() => this.setState({ confirm: false })}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
          {this.successDialog()}
        </div>
      );
    } else {
      return (
        <Link
          to={"/login"}
          component={RouterLink}
          style={{ textDecoration: "none" }}
        >
          <Card className="card" id={this.props.id}>
            <CardActionArea
              className="cardHover"
              onClick={() => this.setState({ open: true })}
            >
              <CardContent>
                <CardMedia component="img" image={this.props.image} />
                <br />
                <Typography gutterBottom className="cardName">
                  {this.props.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {this.props.category}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {this.props.points}
                </Typography>
                <Typography variant="body1" component="h6" className="redeem">
                  Redeem Now
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      );
    }
  }
  render() {
    return <div>{this.createCard()}</div>;
  }
}

export default MediaCard;
