import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "survey-react/survey.css";
import * as Survey from "survey-react";
import { Form } from "react-bootstrap";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import { Checkbox, FormGroup } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@material-ui/core/Button";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";
import QuizImage from "../Quiz/quizImage.png";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faFileAlt, faDownload } from "@fortawesome/free-solid-svg-icons";

// Styles
import "../../css/QuizPreview.scss";


class QuizPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizScheduleId: this.props?.location?.state?.id,
      lessonNumber: this.props?.location?.state?.courseLessonId?.lessonNumber,
      lessonName: this.props?.location?.state?.courseLessonId?.lessonName,
      courseName: this.props?.location?.state?.courseId?.name,
      questionCount: this?.props?.location?.state?.questions?.length,
      reviewAnswer: this.props?.location?.state?.reviewAnswer,
      scored: this?.props?.location?.state?.scored,
      role: "",
      isSubmit: false,
      reviewStatus: this?.props?.location?.state?.reviewStatus,
      question: this?.props?.location?.state?.questions,
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
    const role = localStorage.getItem("role");
    this.setState({ role: role });
  }

  render() {
    const { isLoading, lessonNumber, courseName, lessonName, questionCount, reviewStatus } = this.state;

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
            <hr className="heading-bottom" />
            {reviewStatus === "ReviewCompleted" ? (
              <Row>
                <Col xs={12} sm={12} md={7}>
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
                              <Form.Control as="textarea" disabled value={list?.answer} rows={3} />
                            </Form.Group>
                          </Form>
                        )}
                        {list.type === "radio" && (
                          <div className="option-list mt-3">
                            <FormControl>
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue=""
                                disabled
                                value={list?.answer}
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
                              <div className="d-flex justify-content-start mx-5 mb-4">
                                <Button
                                  variant="contained"
                                  className="Kharpi-save-btn"
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
                <Col xs={12} sm={12} md={5}>
                  <h5 className="d-flex justify-content-center mt-3">Quiz Result</h5>
                  <div className="result-container">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Questions</th>
                          <th>Answers</th>
                          <th>Comments</th>
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
                                  <FontAwesomeIcon icon={faCheck} size="md" color="green" className="mx-1" />
                                ) : (
                                  <FontAwesomeIcon icon={faTimes} size="md" color="#cf2b2be8" />
                                )}
                              </td>
                              <td>
                                {list.comment ? (
                                  <textarea className="textarea" disabled={true}>
                                    {list.comment}
                                  </textarea>
                                ) : (
                                  <p>-</p>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="score-container">
                    <p className="score-text-style">Scored : </p>
                    <p className="score-count-style">{this.state.scored} %</p>
                  </div>
                </Col>
              </Row>
            ) : (
              <div>
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
                            <Form.Control as="textarea" disabled value={list?.answer} rows={3} />
                          </Form.Group>
                        </Form>
                      )}
                      {list.type === "radio" && (
                        <div className="option-list mt-3">
                          <FormControl>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              value={list?.answer}
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
                            <div className="d-flex justify-content-start align-items-center mb-3 ps-3 file-upload-answer">
                              <FontAwesomeIcon icon={faFileAlt} size="2x" color="gray" className="me-2" />
                              <p className="mb-0">{list.answer}</p>
                            </div>
                            <div className="d-flex justify-content-start mx-5 mb-4">
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
                </div>{" "}
              </div>
            )}
          </Container>
        )}
      </div>
    );
  }
}

export default QuizPreview;
