import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "survey-react/survey.css";
import * as Survey from "survey-react";

// Api
import Api from "../../Api";

// Component
import Loader from "../../components/core/Loader";
import QuizImage from "./quizImage.png";

// Styles
import "../../css/Quiz.scss";

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizScheduleId: this.props?.location?.state?.id,
      quizId: this.props?.location?.state?.quizId?._id,
      lessonNumber: this.props?.location?.state?.courseLessonId?.lessonNumber,
      lessonName: this.props?.location?.state?.courseLessonId?.lessonName,
      courseName: this.props?.location?.state?.courseId?.name,
      isLoading: true,
      isComplete: false,
      question: {},
    };
    this.onCompleteComponent = this.onCompleteComponent.bind(this);
  }

  onCompleteComponent = (data) => {
    this.setState({ isComplete: true });
    const { quizScheduleId } = this.state;
    // const dataValue = JSON.stringify(data.data);
    Api.patch("api/v1/quizSchedule/quiz/answer", {
      quizScheduleId: quizScheduleId,
      answer: data.data,
    }).then((response) => {
      this.props.history.goBack();
      this.setState({ isComplete: false });
    });
  };

  getQuizQuestion = () => {
    const { quizId } = this.state;
    Api.get(`api/v1/quiz/${quizId}`).then((response) => {
      const data = response.data.data.getOne.questions;
      this.setState({
        question: data,
        isLoading: false,
      });
    });
  };

  componentDidMount() {
    this.getQuizQuestion();
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
                <img src={QuizImage} alt="Snow" width={"18%"} height={"80%"} />
                <div>
                  <p className="mb-0 welcome-text">Welcome</p>
                  <h6>{`${"Quiz for Lesson" + lessonNumber}`}</h6>
                </div>
              </Col>
              <Col xs={12} sm={7} className="quiz-heading ">
                <p className="coursename-text mb-0">{`${courseName + "-" + lessonName}`}</p>
              </Col>
            </Row>
            <hr  className="heading-bottom" />
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
                  <h5>Successfully Submitted Your Test!.</h5>
                </p>
              </div>
            )}
          </Container>
        )}
      </div>
    );
  }
}

export default Quiz;
