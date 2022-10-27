import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import Radio from "@mui/material/Radio";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

export default class RadioButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.courseId,
      lessonId: this.props?.lessonId,
      type: "radio",
      isSubmit: false,
      questionNumber: "",
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
    };
  }

  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  handleSubmit = () => {
    const token = localStorage.getItem("sessionId");
    this.setState({ isSubmit: true });
    Api.post(`api/v1/lessonHomework/add`, {
      courseId: this.state.courseId,
      courseLessonId: this.state.lessonId,
      question: this.state.question,
      questionNumber: this.state.questionNumber,
      option1: this.state.option1,
      option2: this.state.option2,
      option3: this.state.option3,
      option4: this.state.option4,
      type: this.state.type,
      token: token,
    })
      .then((response) => {
        toast.success("Created Successfully");
        this.setState({
          questionNumber: "",
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          isSubmit: false,
        });
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

  render() {
    return (
      <div className="input-style mt-3">
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
            <Radio value="" name="radio-buttons" disabled className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 1"
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
            <Radio value="" name="radio-buttons" disabled className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 2"
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
            <Radio value="" name="radio-buttons" disabled className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 3"
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
            <Radio value="" name="radio-buttons" disabled className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 4"
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
          <div className="mt-3 d-flex justify-content-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                // this.state.questionNumber === "" ||
                this.state.question === "" ||
                this.state.option1 === "" ||
                this.state.option2 === "" ||
                this.state.option3 === "" ||
                this.state.option4 === "" ||
                this.state.isSubmit
              }
              onClick={() => this.handleSubmit()}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
