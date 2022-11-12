import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
// Style
import "../../css/QuizIntegration.scss";
// Component
import TextBox from "./TextBox";
import CheckBox from "./CheckBox";
import RadioButton from "./RadioButton";
import FileUpload from "./FileUpload";
import QuestionsList from "./QuestionsList";
import HomeWorkImage from "./HomeWorkImage.png";
import CourseSideMenu from "../CourseSideMenu";
import Loader from "../core/Loader";
// Api
import Api from "../../Api";
import { toast } from "react-toastify";

export default class HomeWorkIntegration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.location?.state?.courseId,
      lessonId: this.props?.location?.state?.lessonId,
      textBox: false,
      radioButton: false,
      fileUpload: false,
      checkBox: false,
      questionList: false,
      questionListLength: 0,
      isLoading: true,
      lessonData: [],
    };
  }
  componentDidMount() {
    this.questionList();
    this.lessonDetails();
  }

  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  questionList = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/lessonHomework/list", {
      params: {
        courseLessonId: this.state.lessonId,
        token: token,
      },
    })
      .then((res) => {
        const data = res.data.homeworkData;
        const questionListLength = data.length;
        this.setState({
          questionListLength: questionListLength,
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

  lessonDetails = () => {
    const token = localStorage.getItem("sessionId");
    Api.get(`api/v1/courseLesson/get/one/${this.state.lessonId}`, { headers: { token: token } })
      .then((res) => {
        const lessonData = res.data.lessonList;
        this.setState({ lessonData: lessonData });
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
    const {
      textBox,
      radioButton,
      fileUpload,
      checkBox,
      questionList,
      questionListLength,
      isLoading,
      lessonData,
    } = this.state;
    return (
      <div className="mx-3 mt-1">
        <CourseSideMenu lessonId={this.state.lessonId} courseId={this.state.courseId} />
        <div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="main">
              <Row className="mx-3 mt-3 d-flex justify-content-start align-items-center">
                <Col xs={12} sm={12} md={12} lg={6} className="mt-1">
                  <div className="d-flex lesson-name">
                    <p className="mb-0 pl-3 fw-bold">
                      {lessonData?.courseId?.category?.name} - {lessonData?.courseId?.name} -
                      {this.state.lessonData.lessonName}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="pb-2 d-flex justify-content-center align-items-center">
                <Col xs={12} sm={12} md={12} lg={6} className="mt-4">
                  <img src={HomeWorkImage} alt="Snow" width={"18%"} height={70} />
                  <h6 style={{ color: "#1C1364" }}>Create Questions For Home Work</h6>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}></Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12} sm={12} md={2} className="question-type">
                  <p
                    className="px-4 textbox-style"
                    onClick={() => {
                      this.setState({ textBox: true });
                      this.setState({
                        radioButton: false,
                        fileUpload: false,
                        questionList: false,
                      });
                    }}
                  >
                    Text Input
                  </p>
                </Col>
                <Col xs={12} sm={12} md={2} className="question-type">
                  <p
                    className="px-4 textbox-style"
                    onClick={() => {
                      this.setState({
                        checkBox: false,
                        textBox: false,
                        fileUpload: false,
                        questionList: false,
                      });
                      this.setState({ radioButton: true });
                    }}
                  >
                    Options
                  </p>
                </Col>
                <Col xs={12} sm={12} md={2} className="question-type">
                  <p
                    className="px-4 textbox-style"
                    onClick={() => {
                      this.setState({
                        radioButton: false,
                        textBox: false,
                        fileUpload: false,
                        questionList: false,
                      });
                      this.setState({ checkBox: true });
                    }}
                  >
                    Multiple Choice
                  </p>
                </Col>
                <Col xs={12} sm={12} md={2} className="question-type">
                  <p
                    className="px-4 textbox-style"
                    onClick={() => {
                      this.setState({
                        checkBox: false,
                        textBox: false,
                        radioButton: false,
                        questionList: false,
                      });
                      this.setState({ fileUpload: true });
                    }}
                  >
                    File Upload
                  </p>
                </Col>
                <Col xs={12} sm={12} md={4} className="question-list">
                  <p
                    className="px-4 textbox-style"
                    onClick={() => {
                      this.setState({
                        checkBox: false,
                        textBox: false,
                        radioButton: false,
                        fileUpload: false,
                      });
                      this.setState({ questionList: true });
                    }}
                  >
                    Created Questions
                  </p>
                </Col>
              </Row>
              <hr className="end-line" />
              {questionListLength > 0 ? (
                <div>
                  {textBox ? (
                    <TextBox courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : radioButton ? (
                    <RadioButton courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : checkBox ? (
                    <CheckBox courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : fileUpload ? (
                    <FileUpload courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : questionList ? (
                    <div className="justify-content-center mt-1">
                      <QuestionsList courseId={this.state.courseId} lessonId={this.state.lessonId} />
                    </div>
                  ) : (
                    <div className="justify-content-center mt-1">
                      <QuestionsList courseId={this.state.courseId} lessonId={this.state.lessonId} />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {textBox ? (
                    <TextBox courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : radioButton ? (
                    <RadioButton courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : checkBox ? (
                    <CheckBox courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : fileUpload ? (
                    <FileUpload courseId={this.state.courseId} lessonId={this.state.lessonId} />
                  ) : questionList ? (
                    <div className="justify-content-center mt-1">
                      <QuestionsList courseId={this.state.courseId} lessonId={this.state.lessonId} />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center mt-5">
                      <h6>Please Select Question Type For Creating Questions !!!...</h6>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
