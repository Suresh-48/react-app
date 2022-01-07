import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "survey-react/survey.css";
import * as Survey from "survey-react";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";
import QuizImage from "../Quiz/quizImage.png";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

// Styles
import "../../css/QuizPreview.scss";

class QuizPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizScheduleId: this.props?.location?.state?.id,
      quizId: this.props?.location?.state?.quizId,
      lessonNumber: this.props?.location?.state?.courseLessonId?.lessonNumber,
      lessonName: this.props?.location?.state?.courseLessonId?.lessonName,
      courseName: this.props?.location?.state?.courseId?.name,
      questionCount: "",
      reviewAnswer: [],
      isLoading: true,
      isComplete: false,
      question: {},
      answer: {},
      role: "",
      isSubmit: false,
      data: [],
      reviewStatus: "",
    };
  }

  getAnswer = () => {
    const { quizScheduleId } = this.state;
    Api.get(`api/v1/quizSchedule/schedule/get`, {
      params: {
        quizScheduleId: quizScheduleId,
      },
    }).then((response) => {
      const questions = response.data.getOne.quizId.questions;
      const answer = response.data.getOne.answers;
      const reviewAnswer = response.data.getOne.reviewAnswer;
      const questionCount = questions.pages[0].elements.length;
      const data = response.data.getOne;
      const reviewStatus = response.data.getOne.reviewStatus;
      this.setState({
        question: questions,
        answer: answer,
        isLoading: false,
        reviewAnswer: reviewAnswer,
        questionCount: questionCount,
        data: data,
        reviewStatus: reviewStatus,
      });
    });
  };

  componentDidMount() {
    const role = localStorage.getItem("role");
    this.setState({ role: role });
    this.getAnswer();
  }

  submitForm = (values) => {
    const { quizScheduleId } = this.state;
    this.setState({ isSubmit: true });
    Api.patch(`api/v1/quizSchedule/remark/${quizScheduleId}`, {
      scored: values.score,
      remark: values.remark,
    }).then((response) => {});
  };

  render() {
    const {
      isLoading,
      question,
      lessonNumber,
      courseName,
      lessonName,
      questionCount,
      data,
      reviewStatus,
    } = this.state;
    const survey = new Survey.Model(question);
    survey.data = this.state.answer;
    survey.mode = "display";

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Container>
            <Row>
              <Col
                xs={12}
                sm={5}
                className="d-flex justiy-content-center align-items-center"
              >
                <img src={QuizImage} alt="Snow" width={"18%"} height={"80%"} />
                <div>
                  <p className="mb-0 welcome-text">Welcome</p>
                  <h6>{`${"Quiz for Lesson" + lessonNumber}`}</h6>
                </div>
              </Col>
              <Col xs={12} sm={7} className="quiz-heading ">
                <p className="coursename-text mb-0">{`${
                  courseName + "-" + lessonName
                }`}</p>
              </Col>
            </Row>
            <hr className="heading-bottom" />
            {reviewStatus === "ReviewCompleted" ? (
              <Row>
                <Col xs={12} sm={8}>
                  <Survey.Survey model={survey} />
                </Col>
                <Col xs={12} sm={4}>
                  <h5 className="d-flex justify-content-center mt-3">
                    Quiz Result
                  </h5>
                  <div className="result-container">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th style={{ marginLeft: "30px" }}>Questions</th>
                          <th>Answers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(questionCount)].length > 0 &&
                          this.state.reviewAnswer?.map((list, index) => (
                            <tr>
                              <div className="d-flex justify-content-center ">
                                <tr>Q-{index + 1}</tr>
                              </div>
                              <td style={{ textAlign: "center" }}>
                                {list.answer ? (
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    size="md"
                                    color="green"
                                    className="mx-1"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faTimes}
                                    size="md"
                                    color="#cf2b2be8"
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="score-container">
                    <p className="score-text-style">Scored : </p>
                    <p className="score-count-style">{data.scored}</p>
                  </div>
                </Col>
              </Row>
            ) : (
              <div>
                <Survey.Survey model={survey} />
              </div>
            )}
          </Container>
        )}
      </div>
    );
  }
}

export default QuizPreview;
