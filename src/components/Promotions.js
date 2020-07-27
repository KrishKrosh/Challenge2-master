import React from "react";
import { CircularProgress } from "@material-ui/core";
import Carousel from "react-bootstrap/Carousel";
import "./styles.css";

class Promotions extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      promotions: {},
      isLoading: true,
    };
  }
  componentDidMount() {
    this.getPromotions();
  }
  getPromotions() {
    fetch("https://api.youthcomputing.ca/shop/promotions")
      .then((response) => response.json())
      // ...then we update the users state
      .then((promotions) =>
        this.setState({
          promotions: promotions.promotions,
          isLoading: false,
        })
      )
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : (
          <Carousel interval={3000} className="carouselWidth">
            {this.shuffle(this.state.promotions).map((item, i) => (
              <Carousel.Item key={i}>
                <a href={item.event_url}>
                  <img
                    className={"d-block w-100 carouselImg "}
                    src={item.image_url}
                    alt="First slide"
                  />
                </a>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </React.Fragment>
    );
  }

  shuffle(insertArray) {
    let i = insertArray.length;
    var array = insertArray;
    while (i--) {
      const ri = Math.floor(Math.random() * (i + 1));
      [array[i], array[ri]] = [array[ri], array[i]];
    }
    return array;
  }
}

export default Promotions;
