import React, { Component } from "react";
import { Form, Row, Col } from "react-bootstrap";
import QuizImage from "../../components/QuizIntegration/quizImage.png";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";

class EditHomeWorkIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: "",
      lessonId: "",
      type: this.props?.location?.state?.type,
      homeworkId: this.props?.location?.state?.homeworkId,
      questionNumber: "",
      question: "",
      isSubmit: false,
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      checkBox1: "",
      checkBox2: "",
      checkBox3: "",
      checkBox4: "",
      isLoading: true,
    };
  }

  //logout
  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  handleSubmit = () => {
    const token = localStorage.getItem("sessionId");
    this.setState({ isSubmit: true });
    Api.patch(`api/v1/lessonHomework/lesson/update`, {
      lessonHomeworkId: this.state.homeworkId,
      courseId: this.state.courseId,
      courseLessonId: this.state.lessonId,
      question: this.state.question,
      questionNumber: this.state.questionNumber,
      type: this.state.type,
      option1: this.state.option1,
      option2: this.state.option2,
      option3: this.state.option3,
      option4: this.state.option4,
      checkBox1: this.state.checkBox1,
      checkBox2: this.state.checkBox2,
      checkBox3: this.state.checkBox3,
      checkBox4: this.state.checkBox4,
      token: token,
    })
      .then((response) => {
        toast.success("Updated");
        this.setState({
          questionNumber: "",
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          checkBox1: "",
          checkBox2: "",
          checkBox3: "",
          checkBox4: "",
          isSubmit: false,
        });
        this.props.history.goBack();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
          this.setState({ isSubmit: false, show: false });
        }

        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  componentDidMount() {
    this.questionList();
  }

  questionList = () => {
    const token = localStorage.getItem("sessionId");
    Api.get(`api/v1/lessonHomework/${this.props?.location?.state?.homeworkId}`, {
      params: {
        courseLessonId: this.state.lessonId,
        token: token,
      },
    })
      .then((res) => {
        const data = res.data.data.getOne;
        this.setState({
          questionNumber: data.questionNumber,
          question: data.question,
          option1: data?.option1,
          option2: data?.option2,
          option3: data?.option3,
          option4: data?.option4,
          checkBox1: data?.checkBox1,
          checkBox2: data?.checkBox2,
          checkBox3: data?.checkBox3,
          checkBox4: data?.checkBox4,
          courseId: data.courseId,
          lessonId: data.courseLessonId,
          isLoading: false,
        });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };
  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <div>
            <Row className="pb-2 d-flex justify-content-center align-items-center">
              <Col xs={12} sm={6}>
                <img src={QuizImage} alt="Snow" width={"18%"} height={80} />
                <h6 style={{ color: "#1C1364" }}>Edit Questions For Home Work</h6>
              </Col>
              <Col xs={12} sm={6}>
                <div className="d-flex justify-content-end">
                  <h6>Lesson 1 - </h6>
                  <p className="mb-0"> Introduction of Classical Music</p>
                </div>
              </Col>
            </Row>
            {this.state.type === "text" ? (
              <div className="input-style mt-3">
                <div className="px-4">
                  <h6>Input Type Question Format</h6>
                </div>
                <div className="px-2">
                  <div className="d-flex">
                    {/* <TextField
                      id="filled-basic"
                      label="No."
                      variant="filled"
                      name="questionNumber"
                      value={this.state.questionNumber}
                      className="mt-4"
                      onChange={(e) => {
                        this.setState({ questionNumber: e.target.value });
                      }}
                      style={{ width: "12%", marginRight: "1%" }}
                    /> */}
                    <TextField
                      fullWidth
                      className="mt-4"
                      multiline
                      name="question"
                      id="filled-basic"
                      value={this.state.question}
                      label="Enter Your Question"
                      onChange={(e) => {
                        this.setState({ question: e.target.value });
                      }}
                      variant="filled"
                    />
                  </div>
                  <Form>
                    <Form.Group className="mt-4 mx-2" controlId="exampleForm.ControlTextarea1">
                      <Form.Control
                        disabled
                        as="textarea"
                        rows={3}
                        placeholder="Enter Your Answer"
                        style={{ backgroundColor: "#F0F0F0" }}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>
            ) : this.state.type === "radio" ? (
              <div className="input-style mt-3">
                <div className="px-4">
                  <h6>Option Question Format</h6>
                </div>
                <div className="px-2">
                  <div className="d-flex">
                    {/* <TextField
                      id="filled-basic"
                      label="No."
                      variant="filled"
                      name="questionNumber"
                      value={this.state.questionNumber}
                      onChange={(e) => {
                        this.setState({ questionNumber: e.target.value });
                      }}
                      className="mt-4"
                      style={{ width: "12%", marginRight: "1%" }}
                    /> */}
                    <TextField
                      fullWidth
                      className="mt-4"
                      multiline
                      id="filled-basic"
                      label="Enter Your Question"
                      name="question"
                      value={this.state.question}
                      onChange={(e) => {
                        this.setState({ question: e.target.value });
                      }}
                      variant="filled"
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Radio value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option1"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.option1}
                      onChange={(e) => {
                        this.setState({ option1: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Radio value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option2"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.option2}
                      onChange={(e) => {
                        this.setState({ option2: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Radio value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option3"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.option3}
                      onChange={(e) => {
                        this.setState({ option3: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Radio value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option4"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.option4}
                      onChange={(e) => {
                        this.setState({ option4: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>
              </div>
            ) : this.state.type === "checkbox" ? (
              <div className="input-style mt-3">
                <div className="px-4">
                  <h6>Multiple Choice Question Format</h6>
                </div>

                <div className="px-2">
                  <div className="d-flex">
                    {/* <TextField
                      id="filled-basic"
                      label="No."
                      variant="filled"
                      name="questionNumber"
                      value={this.state.questionNumber}
                      onChange={(e) => {
                        this.setState({ questionNumber: e.target.value });
                      }}
                      className="mt-4"
                      style={{ width: "12%", marginRight: "1%" }}
                    /> */}
                    <TextField
                      fullWidth
                      className="mt-4"
                      multiline
                      id="filled-basic"
                      label="Enter Your Question"
                      name="question"
                      value={this.state.question}
                      onChange={(e) => {
                        this.setState({ question: e.target.value });
                      }}
                      variant="filled"
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Checkbox value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option1"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.checkBox1}
                      onChange={(e) => {
                        this.setState({ checkBox1: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Checkbox value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option2"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.checkBox2}
                      onChange={(e) => {
                        this.setState({ checkBox2: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Checkbox value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option3"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.checkBox3}
                      onChange={(e) => {
                        this.setState({ checkBox3: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                  <div className="d-flex mt-3 options">
                    <Checkbox value="" name="radio-buttons" className="radio-options" disabled />
                    <TextField
                      id="standard-basic"
                      label="Option4"
                      variant="standard"
                      name="option1"
                      multiline
                      fullWidth
                      value={this.state.checkBox4}
                      onChange={(e) => {
                        this.setState({ checkBox4: e.target.value });
                      }}
                      className="ms-3"
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              this.state.type === "fileUpload" && (
                <div className="input-style mt-3">
                  <div className="px-4">
                    <h6>File Upload Question Format</h6>
                  </div>
                  <div className="px-2">
                    <div className="d-flex">
                      {/* <TextField
                        id="filled-basic"
                        label="No."
                        variant="filled"
                        name="questionNumber"
                        value={this.state.questionNumber}
                        onChange={(e) => {
                          this.setState({ questionNumber: e.target.value });
                        }}
                        className="mt-4"
                        style={{ width: "12%", marginRight: "1%" }}
                      /> */}
                      <TextField
                        fullWidth
                        className="mt-4"
                        multiline
                        id="filled-basic"
                        value={this.state.question}
                        onChange={(e) => {
                          this.setState({ question: e.target.value });
                        }}
                        label="Enter Your Question"
                        variant="filled"
                      />
                    </div>
                    <Form.Group controlId="formFile" className="mt-4 mx-2">
                      <Form.Control disabled type="file" style={{ backgroundColor: "#F0F0F0" }} />
                    </Form.Group>
                  </div>
                </div>
              )
            )}
            <div className="mt-3 d-flex justify-content-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={this.state.questionNumber === "" || this.state.question === "" || this.state.isSubmit}
                onClick={() => this.handleSubmit()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default EditHomeWorkIntegration;
