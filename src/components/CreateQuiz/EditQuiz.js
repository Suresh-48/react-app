import React, { Component } from "react";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import Api from "../../Api";
import "../../css/createQuiz.scss";
import { toast } from "react-toastify";

// Component
import Loader from "../core/Loader";

class EditQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.location?.state?.courseId,
      lessonId: this.props?.location?.state?.lessonId,
      json: "",
      isSubmit: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.createQuestion();
  }

  createQuestion = (question) => {
    const token = localStorage.getItem("sessionId");
    Api.get("/api/v1/quiz/getLesson/", {
      params: {
        courseLessonId: this.state.lessonId,
        token: token,
      },
    })
      .then((response) => {
        this.setState({ isLoading: false });
        const question = response.data.lessonData.questions;
        const creatorOptions = {
          questionTypes: ["text", "checkbox", "radiogroup", "file", "boolean"],
        };
        this.surveyCreator = new SurveyJSCreator.SurveyCreator(null, creatorOptions);
        this.surveyCreator.showState = true;
        this.surveyCreator.JSON = question;
        this.surveyCreator.showTestSurveyTab = false;
        this.surveyCreator.showJSONEditorTab = false;
        this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
        if (this.state.json !== undefined) {
          this.surveyCreator.json = this.state.json;
        }
        this.surveyCreator.render("surveyCreatorContainer");
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Log out
  logout = () => {
   setTimeout(() => {
      localStorage.clear(this.props.history.push("/kharpi"));
      window.location.reload();
   }, 2000);
  };

  saveMySurvey = (saveNo, callback) => {
    this.setState({ isSubmit: true });
    this.setState({ json: this.surveyCreator.JSON });
    Api.patch("/api/v1/quiz/lesson/update", {
      courseId: this.state.courseId,
      courseLessonId: this.state.lessonId,
      questions: this.state.json,
      token: token,
    })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Quiz Updated!.");
          this.setState({ isSubmit: false });
          this.createQuestion();
        } else {
          toast.error(response.data.message);
          this.setState({ isSubmit: false });
          this.createQuestion();
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
    callback(saveNo, true);
  };

  render() {
    return <div className="pt-4">{this.state.isLoading ? <Loader /> : <div id="surveyCreatorContainer" />}</div>;
  }
}

export default EditQuiz;
