import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-free/css/fontawesome.css";




class DefaultFooter extends Component {
  render() {
    return (
      <Container>
        <Row className="mt-3">
          <Col sm={4} className="mb-3">
            <h6 className="footer-title">Learning</h6>

            <li className="list-content-title">
              <a href="#!" className="no-underline">
                Explore Classes
              </a>
            </li>

            <li className="list-content-title">
              <a href="#!" className="no-underline">
                Organizations
              </a>
            </li>
            <li className="list-content-title">
              <a href="#!" className="no-underline">
                Courses
              </a>
            </li>
          </Col>
          <Col sm={4} className="mb-3">
            <h6 className="footer-title">About Us</h6>
            <li className="list-content-title">
              <a href="/about-us" className="no-underline">
                About Company
              </a>
            </li>
            <li className="list-content-title">
              <a href="#!" className="no-underline">
                Help
              </a>
            </li>
            <li className="list-content-title">
              <a href="#!" className="no-underline">
                Privacy
              </a>
            </li>
          </Col>
          <Col sm={4} className="mb-3">
            <h6 className="footer-title">Contact Us</h6>
            <li className="list-content-title">
              {/* <span>
                &copy; {getCurrentYear()} Aviar Technology Services. All Rights Reserved.<br></br>
                3801 Pamela Dr, Bloomington, IL 61704.
              </span> */}
            </li>
            <li className="list-content-title">
              <a href="https://www.youtube.com/c/jamesqquick" className="youtube social">
                <FontAwesomeIcon icon={faYoutube} size="2x" />
              </a>
              &nbsp; &nbsp; &nbsp;
              <a href="https://www.facebook.com/learnbuildteach/" className="facebook social">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              &nbsp; &nbsp; &nbsp;
              <a href="https://www.twitter.com/jamesqquick" className="twitter social">
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              &nbsp; &nbsp; &nbsp;
              <a href="https://www.instagram.com/learnbuildteach" className="instagram social">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
            </li>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DefaultFooter;
