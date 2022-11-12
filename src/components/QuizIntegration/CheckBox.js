import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.courseId,
      lessonId: this.props?.lessonId,
      type: "checkbox",
      isSubmit: false,
      questionNumber: "",
      question: "",
      checkBox1: "",
      checkBox2: "",
      checkBox3: "",
      checkBox4: "",
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
    Api.post(`api/v1/lessonQuiz/add`, {
      courseId: this.state.courseId,
      courseLessonId: this.state.lessonId,
      question: this.state.question,
      questionNumber: this.state.questionNumber,
      checkBox1: this.state.checkBox1,
      checkBox2: this.state.checkBox2,
      checkBox3: this.state.checkBox3,
      checkBox4: this.state.checkBox4,
      type: this.state.type,
      token: token,
    })
      .then((response) => {
        toast.success("Created Successfully");
        this.setState({
          questionNumber: "",
          question: "",
          checkBox1: "",
          checkBox2: "",
          checkBox3: "",
          checkBox4: "",
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
            <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 1"
              variant="standard"
              name="checkBox1"
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
            <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 2"
              variant="standard"
              name="checkBox2"
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
            <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 3"
              variant="standard"
              name="checkBox3"
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
            <Checkbox value="" disabled name="radio-buttons" className="radio-options" />
            <TextField
              id="standard-basic"
              label="Option 4"
              variant="standard"
              name="checkBox4"
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
          <div className="mt-3 d-flex justify-content-end">
            <Button
              variant="contained"
              className="Kharpi-save-btn"
              color="primary"
              type="submit"
              disabled={
                // this.state.questionNumber === "" ||
                this.state.question === "" ||
                this.state.checkBox1 === "" ||
                this.state.checkBox2 === "" ||
                // this.state.checkBox3 === "" ||
                // this.state.checkBox4 === "" ||
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
