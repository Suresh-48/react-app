import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "survey-react/survey.css";
import * as Survey from "survey-react";
import HomeWorkImage from "./HomeWorkImage.png";
// Api
import Api from "../../Api";
import Loader from "../../components/core/Loader";

class HomeWork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      homeworkScheduleId: this.props?.location?.state?.id,
      homeworkId: this.props?.location?.state?.homeworkId,
      lessonNumber: this.props?.location?.state?.courseLessonId?.lessonNumber,
      lessonName: this.props?.location?.state?.courseLessonId?.lessonName,
      courseName: this.props?.location?.state?.courseId?.name,
      question: {},
      isComplete: false,
    };
    this.onCompleteComponent = this.onCompleteComponent.bind(this);
  }

  onCompleteComponent = (data) => {
    this.setState({ isComplete: true });
    const { homeworkScheduleId } = this.state;
    // const dataValue = JSON.stringify(data.data);
    Api.patch("api/v1/homeworkSchedule/homework/answer", {
      homeworkScheduleId: homeworkScheduleId,
      answer: data.data,
    }).then((response) => {
      this.props.history.goBack();
      this.setState({ isComplete: true });
    });
  };

  getHomeWorkData = () => {
    const { homeworkId } = this.state;
    Api.get(`api/v1/homework/${homeworkId}`).then((response) => {
      const data = response.data.data.getOne.questions;
      this.setState({
        question: data,
        isLoading: false,
      });
    });
  };

  componentDidMount() {
    this.getHomeWorkData();
  }
  render() {
    const { isLoading, question, lessonNumber, courseName, lessonName, isComplete } = this.state;
    const survey = new Survey.Model(question);
    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Container>
            <Row>
              <Col xs={12} sm={5} className="d-flex justiy-content-center align-items-center">
                <img src={HomeWorkImage} alt="Snow" width={"17%"} height={"100%"} />
                <div>
                  <p className="mb-0 welcome-text">Welcome</p>
                  <h6>{`${"HomeWork   for Lesson" + lessonNumber}`}</h6>
                </div>
              </Col>
              <Col xs={12} sm={7} className="quiz-heading ">
                <p className="coursename-text mb-0">{`${courseName + "-" + lessonName}`}</p>
              </Col>
            </Row>
            <hr className="heading-bottom" />
            {!isComplete ? (
              <div>
                <Survey.Survey
                  model={survey}
                  showCompletedPage={false}
                  onComplete={(data) => this.onCompleteComponent(data)}
                />
              </div>
            ) : (
              <div className="d-flex position-absolute top-50 start-50 translate-middle">
                <p>
                  <h5>Successfully Submitted Your Home Work!.</h5>
                </p>
              </div>
            )}
          </Container>
        )}
      </div>
    );
  }
}
export default HomeWork;
