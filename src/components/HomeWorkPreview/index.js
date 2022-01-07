import React, { Component } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "survey-react/survey.css";
import * as Survey from "survey-react";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import { toast } from "react-toastify";

// Image
import HomeWorkImage from "../HomeWork/HomeWorkImage.png";

// Api
import Api from "../../Api";

//Component
import Loader from "../../components/core/Loader";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

class HomeWorkPreview extends Component {
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
      questionCount: 0,
      role: "",
      answer: {},
      isSubmit: false,
      Q1: "",
      Q2: "",
      Q3: "",
      Q4: "",
      Q5: "",
      Q6: "",
      Q7: "",
      Q8: "",
      Q9: "",
      Q10: "",
    };
  }

  getAnswer = () => {
    const { homeworkScheduleId } = this.state;
    Api.get(`api/v1/homeworkSchedule/schedule/get`, {
      params: {
        homeworkScheduleId: homeworkScheduleId,
      },
    }).then((response) => {
      const questions = response.data.getOne.homeworkId.questions;
      const answer = response.data.getOne.answers;
      const questionCount = questions.pages[0].elements.length;
      this.setState({
        question: questions,
        answer: answer,
        isLoading: false,
        questionCount: questionCount,
      });
    });
  };

  componentDidMount() {
    const role = localStorage.getItem("role");
    this.setState({ role: role });
    this.getAnswer();
  }

  submitForm = (values) => {
    this.setState({ isSubmit: true });
    const { homeworkScheduleId } = this.state;
    const mark = [];

    for (let i = 1; i <= this.state.questionCount; i++) {
      mark.push({ answer: this.state["Q" + i] });
    }

    const validate = mark.filter(function (mark) {
      return mark.answer === "";
    }).length;

    if (validate === 0) {
      Api.patch("api/v1/homeworkSchedule/review/mark", {
        homeworkScheduleId: homeworkScheduleId,
        remark: values.remark,
        reviewAnswer: mark,
      }).then((response) => {
        this.props.history.goBack();
        this.setState({ isSubmit: false });
      });
    } else {
      toast.error("Please Ckeck You have Corrected All the Questions ");
      this.setState({ isSubmit: false });
    }
  };

  correct = (index) => {
    const number = index + 1;
    const questionNo = "Q" + number;
    this.setState({ [questionNo]: true });
  };

  wrong = (index, e) => {
    const number = index + 1;
    const questionNo = "Q" + number;
    this.setState({ [questionNo]: false });
  };

  render() {
    const { isLoading, question, lessonNumber, courseName, lessonName, role, questionCount } = this.state;
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
            {role === "teacher" ? (
              <Row>
                <Col sm={8} md={8}>
                  <div>
                    <Survey.Survey model={survey} />
                  </div>
                </Col>
                <Col sm={4} md={4}>
                  <div className="col-sm-12">
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        remark: "",
                      }}
                      onSubmit={(values) => this.submitForm(values)}
                    >
                      {(formik) => {
                        const { handleSubmit, isValid } = formik;
                        return (
                          <Row>
                            <Form onSubmit={handleSubmit}>
                              <Row>
                                <div>
                                  <table class="table table-bordered">
                                    <thead>
                                      <tr>
                                        <th style={{ marginLeft: "30px" }}>Questions</th>
                                        <th>Options</th>
                                        <th>Marks</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[...Array(questionCount)].map((list, index) => (
                                        <tr>
                                          <div className="d-flex justify-content-center ">Q-{index + 1}</div>
                                          <td style={{ textAlign: "center" }}>
                                            <div className="row" key={index}>
                                              <Col>
                                                <FontAwesomeIcon
                                                  icon={faCheck}
                                                  size="md"
                                                  color="green"
                                                  className="position-relative"
                                                  onClick={(list) => this.correct(index)}
                                                />
                                              </Col>
                                              <Col>
                                                <FontAwesomeIcon
                                                  icon={faTimes}
                                                  size="md"
                                                  color="#cf2b2be8"
                                                  className="position-relative"
                                                  onClick={(list) => this.wrong(index)}
                                                />
                                              </Col>
                                            </div>
                                          </td>
                                          <td>
                                            <div className="d-flex justify-content-center ">
                                              {this.state["Q" + (index + 1)] === "" ? (
                                                <div></div>
                                              ) : this.state["Q" + (index + 1)] === true ? (
                                                <FontAwesomeIcon
                                                  icon={faCheck}
                                                  size="md"
                                                  color="green"
                                                  className="mx-1"
                                                />
                                              ) : (
                                                <FontAwesomeIcon icon={faTimes} size="md" color="#cf2b2be8" />
                                              )}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="d-flex justify-content-end align-items-center mb-4  ">
                                  <Button
                                    type="submit"
                                    disabled={!isValid || this.state.isSubmit}
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={{ width: "40%" }}
                                  >
                                    Submit
                                  </Button>
                                </div>
                              </Row>
                            </Form>
                          </Row>
                        );
                      }}
                    </Formik>
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
export default HomeWorkPreview;
