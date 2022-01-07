import React, { Component } from "react";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import Api from "../../Api";
import "../../css/createQuiz.scss";
import { toast } from "react-toastify";

class EditHomeWork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.location?.state?.courseId,
      lessonId: this.props?.location?.state?.lessonId,
      json: "",
      isSubmit: false,
    };
  }

  componentDidMount() {
    this.createQuestion()
  }

  createQuestion = () => {
    Api.get("api/v1/homeWork/getLesson/",{
      params:{
        courseLessonId: this.state.lessonId,
      }
    }).then(response=>{
      const question = response.data.lessonData.questions;
      const creatorOptions = {
        questionTypes: ["text", "checkbox", "radiogroup", "file", "boolean"],
      };
      this.surveyCreator = new SurveyJSCreator.SurveyCreator(
        null,
        creatorOptions
      );
      this.surveyCreator.showState = true;
      this.surveyCreator.JSON = question;
      this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
      if (this.state.json !== undefined) {
        this.surveyCreator.json = this.state.json;
      }
      this.surveyCreator.render("surveyCreatorContainer");
    })
    
  };

  saveMySurvey = (saveNo, callback) => {
    this.setState({ isSubmit: true });
    this.setState({ json: this.surveyCreator.JSON });
   Api.patch("api/v1/homeWork/lesson/update", {
        courseId: this.state.courseId,
        courseLessonId: this.state.lessonId,
        questions: this.state.json,
      }).then((response) => {
        if (response.status === 201) {
          toast.success("Homework Updated!.");
          this.setState({ isSubmit: false });
          this.createQuestion()
        } else {
          toast.error(response.data.message);
          this.setState({ isSubmit: false });
          this.createQuestion()
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
      });
    callback(saveNo, true);
  };

  render() {

    return (
      <div>
        <div id="surveyCreatorContainer" />
      </div>
    );
  }
}

export default EditHomeWork;
