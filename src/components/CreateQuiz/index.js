import React, { Component } from "react";
import * as SurveyJSCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import CourseSideMenu from "../CourseSideMenu";
import { toast } from "react-toastify";
import { Button } from "@material-ui/core";

// Api
import Api from "../../Api";

// Styles
import "../../css/createQuiz.scss";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

class CreateQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.location?.state?.courseId,
      lessonId: this.props?.location?.state?.lessonId,
      json: undefined,
      isSubmit: false,
      quizDetail: 0,
    };
  }

  // Log out
  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  lessonQuizDetail = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/quiz/lesson/detail", {
      params: {
        courseLessonId: this.state.lessonId,
        token: token,
      },
    })
      .then((response) => {
        const data = response.data.lessonData;
        this.setState({ quizDetail: data.length });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  componentDidMount() {
    this.lessonQuizDetail();
    const creatorOptions = {
      questionTypes: ["text", "checkbox", "radiogroup", "file", "boolean"],
    };
    this.surveyCreator = new SurveyJSCreator.SurveyCreator(null, creatorOptions);
    this.surveyCreator.showState = true;
    this.surveyCreator.showTestSurveyTab = false;
    this.surveyCreator.showJSONEditorTab = false;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    if (this.state.json !== undefined) {
      this.surveyCreator.json = this.state.json;
    }
    this.surveyCreator.render("surveyCreatorContainer");
  }

  saveMySurvey = (saveNo, callback) => {
    const token = localStorage.getItem("sessionId");
    this.setState({ isSubmit: true });
    if (this.surveyCreator.JSON?.pages[0]?.elements) {
      this.setState({ json: this.surveyCreator.JSON });
      const jsonData = this.surveyCreator.JSON;
      Api.post("api/v1/quiz/add", {
        courseId: this.state.courseId,
        courseLessonId: this.state.lessonId,
        questions: jsonData,
        token: token,
      })
        .then((response) => {
          if (response.status === 201) {
            toast.success("Questions Created Successfully!.");
            this.setState({ isSubmit: false });
            this.lessonQuizDetail();
          } else {
            toast.error(response.data.message);
            this.setState({ isSubmit: false });
            this.lessonQuizDetail();
          }
        })
        .catch((error) => {
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            this.logout();
            toast.error("Session Timeout");
          }
        });
    } else {
      toast.error("Please Create Questions Before Clicking on Save Survey");
    }
    callback(saveNo, true);
  };

  render() {
    return (
      <div>
        <CourseSideMenu lessonId={this.state.lessonId} courseId={this.state.courseId} />
        <div>
          <div className="pt-1">
            <h5 className="title">Create Quiz Questions</h5>
          </div>
          {this.state.quizDetail !== 0 && (
            <div className="d-flex justify-content-end my-3">
              <Button
                className="create-button-style py-1"
                variant="contained"
                color="primary"
                onClick={() =>
                  this.props.history.push({
                    pathname: "/quiz/edit",
                    state: {
                      lessonId: this.state.lessonId,
                      courseId: this.state.courseId,
                    },
                  })
                }
              >
                Edit Quiz <FontAwesomeIcon icon={faPen} size="lg" className="ms-3" />
              </Button>
            </div>
          )}
          <div id="surveyCreatorContainer" />
        </div>
      </div>
    );
  }
}

export default CreateQuiz;
