import React, { Component } from "react";
import { Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

export default class TextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.courseId,
      lessonId: this.props?.lessonId,
      questionNumber: "",
      question: "",
      type: "text",
      isSubmit: false,
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
      type: this.state.type,
      token: token,
    })
      .then((response) => {
        toast.success("Created Successfully");
        this.setState({ questionNumber: "", question: "", isSubmit: false });
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
            <Form.Group className="mt-4">
              <Form.Control
                disabled
                as="textarea"
                rows={3}
                placeholder="Enter Your Answer"
                style={{ backgroundColor: "#F0F0F0" }}
              />
            </Form.Group>
          </Form>
          <div className="mt-3 d-flex justify-content-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                // this.state.questionNumber===""||
                this.state.question === "" || this.state.isSubmit
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
