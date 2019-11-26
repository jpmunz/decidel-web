import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Home.scss";
import cartoon from "src/assets/cartoon.png";
import step1 from "src/assets/step1.png";
import step2 from "src/assets/step2.png";
import step3 from "src/assets/step3.png";

class Home extends React.Component {
  render() {
    return (
      <div className="Home">
        <section name="top">
          <h3>Force your indecisive group of friends into making a choice!</h3>
          <Link to="/create">
            <Button className={"decide-btn"}>
              <h4>Decide Something</h4>
            </Button>
          </Link>
        </section>
        <section className="cartoon-section">
          <img className="cartoon" src={cartoon} alt="" />
          <div className="image-attribution">
            Image by{" "}
            <a href="https://pixabay.com/users/coffeebeanworks-558718/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2155431">
              Coffee Bean
            </a>{" "}
            from{" "}
            <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2155431">
              Pixabay
            </a>
            . Used with modification.
          </div>
        </section>
        <section>
          <h1>How It Works</h1>
          <ul>
            <li className="how-it-works-step">
              <div>
                <strong>1. </strong>Tell us what you're trying to decide
              </div>
              <img src={step1} alt="" />
            </li>
            <li className="how-it-works-step">
              <div>
                <strong>2. </strong>Invite your friends to narrow down the
                choices
              </div>
              <img src={step2} alt="" />
            </li>
            <li className="how-it-works-step">
              <div>
                <strong>3. </strong>Sweet decisiveness
              </div>
              <img src={step3} alt="" />
            </li>
          </ul>
        </section>
        <footer>
          <a href="#top">Back To Top</a>
        </footer>
      </div>
    );
  }
}

export default Home;
