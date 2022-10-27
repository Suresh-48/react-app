import React, { Component } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Checkbox, FormGroup } from "@mui/material";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faFileAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

// Component
import Loader from "../../components/core/Loader";
import HomeWorkImage from "../HomeWork/HomeWorkImage.png";

// Styles
import "../../css/QuizPreview.scss";

class EditReviewedHomeWork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeworkScheduleId: this.props?.location?.state?.id,
      lessonNumber: this.props?.location?.state?.courseLessonId?.lessonNumber,
      lessonName: this.props?.location?.state?.courseLessonId?.lessonName,
      courseName: this.props?.location?.state?.courseId?.name,
      questionCount: this?.props?.location?.state?.questions?.length,
      isSubmit: false,
      question: this?.props?.location?.state?.questions,
      reviewAnswer: this.props?.location?.state?.reviewAnswer,
      scored: this?.props?.location?.state?.scored,
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
      comment1: "",
      comment2: "",
      comment3: "",
      comment4: "",
      comment5: "",
      comment6: "",
      comment7: "",
      comment8: "",
      comment9: "",
      comment10: "",
    };
  }
  //logout
  logout = () => {
   setTimeout(() => {
     localStorage.clear(this.props.history.push("/kharpi"));
     window.location.reload();
   }, 2000);
  };

  componentDidMount() {
    const { reviewAnswer, answer, comment } = this.props?.location?.state;
    reviewAnswer.forEach((res, index) => {
      const indexValue = index + 1;
      const questionNumber = "Q" + indexValue;
      const commentNumber = "comment" + indexValue;
      this.setState({
        [questionNumber]: res.answer,
        [commentNumber]: res.comment,
      });
    });
    this.setState({ reviewAnswer: reviewAnswer });
  }

  //Comment onChange
  commentChange = (text, index) => {
    const number = index + 1;
    const commentNumber = "comment" + number;
    this.setState({ [commentNumber]: text });
  };

  submitForm = (values) => {
    const token = localStorage.getItem("sessionId");
    this.setState({ isSubmit: true });
    const { homeworkScheduleId } = this.state;
    const mark = [];
    const markPerQuestion = 100 / this.state.questionCount;

    for (let i = 1; i <= this.state.questionCount; i++) {
      mark.push({
        answer: this.state["Q" + i],
        comment: this.state["comment" + i],
      });
    }

    const correctAnswer = mark.filter(function(mark) {
      return mark.answer === true;
    }).length;

    const markPercent = correctAnswer * markPerQuestion;
    const score = Math.round(markPercent);

    const validate = mark.filter(function(mark) {
      return mark.answer === "";
    }).length;

    if (validate === 0) {
      Api.patch("api/v1/homeworkSchedule/review/mark", {
        homeworkScheduleId: homeworkScheduleId,
        reviewAnswer: mark,
        scored: score,
        token: token,
      })
        .then((response) => {
          toast.success("Updated");
          this.setState({ isSubmit: false });
        })
        .catch((error) => {
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            this.logout();
            toast.error("Session Timeout");
          }
        });
    } else {
      toast.error("Please Ckeck You have Corrected All the Questions ");
      this.setState({ isSubmit: false });
    }
  };

  // Correct Answer
  correct = (index) => {
    const number = index + 1;
    const questionNo = "Q" + number;
    const questionValue = "QValue" + number;
    this.setState({ [questionNo]: true, [questionValue]: "marked" });
  };

  // Wrong Answer
  wrong = (index, e) => {
    const number = index + 1;
    const questionNo = "Q" + number;
    const questionValue = "QValue" + number;
    this.setState({ [questionNo]: false, [questionValue]: "marked" });
  };

  render() {
    const { isLoading, lessonNumber, courseName, lessonName } = this.state;

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Container>
            <Row>
              <Col xs={12} sm={5} className="d-flex justiy-content-center align-items-center">
                <img src={HomeWorkImage} alt="Snow" width={"18%"} height={"80%"} />
                <div>
                  <p className="mb-0 welcome-text">Welcome</p>
                  <h6>{`${"HomeWork for Lesson" + lessonNumber}`}</h6>
                </div>
              </Col>
              <Col xs={12} sm={7} className="quiz-heading ">
                <p className="coursename-text mb-0">{`${courseName + "-" + lessonName}`}</p>
              </Col>
            </Row>
            <hr className="heading-bottom" />
            <Row>
              <Col>
                <div>
                  {this.state.question.map((list, index) => (
                    <div className="px-2">
                      <div className="d-flex" key={index}>
                        <TextField
                          fullWidth
                          id="standard-basic"
                          variant="standard"
                          name="no"
                          disabled
                          value={`${index + 1 + "."}`}
                          className="mt-4"
                          style={{ width: "3%" }}
                        />
                        <TextField
                          fullWidth
                          className="mt-4"
                          multiline
                          name="question"
                          id="standard-basic"
                          disabled
                          value={list.question}
                          variant="standard"
                        />
                      </div>
                      {list.type === "text" && (
                        <Form>
                          <Form.Group className="mb-2 mx-4 my-4" controlId="exampleForm.ControlTextarea1">
                            <Form.Control as="textarea" disabled value={list.answer} rows={3} />
                          </Form.Group>
                        </Form>
                      )}
                      {list.type === "radio" && (
                        <div className="option-list mt-3">
                          <FormControl>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              value={list.answer}
                              disabled
                              name="radio-buttons-group"
                            >
                              <FormControlLabel
                                className="mb-2"
                                value={list.option1}
                                control={<Radio />}
                                label={list.option1}
                              />
                              <FormControlLabel
                                className="mb-2"
                                value={list.option2}
                                control={<Radio />}
                                label={list.option2}
                              />
                              <FormControlLabel
                                className="mb-2"
                                value={list.option3}
                                control={<Radio />}
                                label={list.option3}
                              />
                              <FormControlLabel
                                className="mb-2"
                                value={list.option4}
                                control={<Radio />}
                                label={list.option4}
                              />
                            </RadioGroup>
                          </FormControl>
                        </div>
                      )}
                      {list.type === "checkbox" && (
                        <div className="option-list mt-3">
                          <FormControl>
                            <FormGroup disabled>
                              <FormControlLabel
                                className="mb-2"
                                value={list.option1}
                                control={<Checkbox checked={list.answer.checkBox1} name="checkBox1" />}
                                label={list.checkBox1}
                              />
                              <FormControlLabel
                                className="mb-2"
                                value={list.option2}
                                control={<Checkbox checked={list.answer.checkBox2} name="checkBox2" />}
                                label={list.checkBox2}
                              />
                              <FormControlLabel
                                value={list.option3}
                                className="mb-2"
                                control={<Checkbox checked={list.answer.checkBox3} name="checkBox3" />}
                                label={list.checkBox3}
                              />
                              <FormControlLabel
                                value={list.option4}
                                className="mb-2"
                                control={<Checkbox checked={list.answer.checkBox4} name="checkBox4" />}
                                label={list.checkBox4}
                              />
                            </FormGroup>
                          </FormControl>
                        </div>
                      )}
                      {list.type === "fileUpload" &&
                        (list.answer ? (
                          <div className="mt-3 px-1">
                            <div className="d-flex justify-content-start align-items-center mb-3 file-upload-answer">
                              <FontAwesomeIcon icon={faFileAlt} size="2x" color="gray" className="me-2" />
                              <p className="mb-0">{list.answer}</p>
                            </div>
                            <div className="d-flex justify-content-start mx-5">
                              <Button
                                variant="contained"
                                color="primary"
                                rel="noopener noreferrer"
                                target="_blank"
                                onClick={() => window.open(list.answer, "_blank")}
                              >
                                <FontAwesomeIcon icon={faDownload} size="1x" color="primary" className="me-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="my-3 ps-5">
                            <h6>Not Answered</h6>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </Col>
              <Col>
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
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th style={{ marginLeft: "30px" }}>Questions</th>
                                      <th>Options</th>
                                      <th>Marks</th>
                                      <th>Comments</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {this.state.reviewAnswer?.map((list, index) => (
                                      <tr>
                                        <div className="d-flex justify-content-center ">
                                          <tr>Q-{index + 1}</tr>
                                        </div>
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
                                        <td style={{ textAlign: "center" }}>
                                          <div className="d-flex justify-content-center pt-1">
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
                                        <td>
                                          {list.comment ? (
                                            <textarea
                                              className="textarea"
                                              placeholder="Enter Your Comments..."
                                              onChange={(e) => this.commentChange(e.target.value, index)}
                                            >
                                              {list.comment}
                                            </textarea>
                                          ) : (
                                            <textarea
                                              className="textarea"
                                              placeholder="Enter Your Comments..."
                                              onChange={(e) => this.commentChange(e.target.value, index)}
                                            ></textarea>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="d-flex justify-content-end align-items-center">
                                <Button
                                  type="submit"
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                  style={{ width: "40%" }}
                                  disabled={this.state.isSubmit}
                                  onClick={() => this.submitForm()}
                                >
                                  Save Changes
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
          </Container>
        )}
      </div>
    );
  }
}

export default EditReviewedHomeWork;
