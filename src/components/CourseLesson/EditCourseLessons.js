import React, { Component } from "react";
import { Container, Row, Col, FormControl, Form, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import Button from "@material-ui/core/Button";
import * as Yup from "yup";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, convertFromRaw } from "draft-js";

// Api
import Api from "../../Api";

// Component
import { toast } from "react-toastify";
import Loader from "../core/Loader";
import Label from "../../components/core/Label";
import CourseSideMenu from "../CourseSideMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
const token = localStorage.getItem("sessionId");

// Validation
const createLessonSchema = Yup.object().shape({
  lessonNumber: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Lesson Number"
    )
    .required("Lesson Number Is Required"),

  lessonName: Yup.string().required("Lesson Name Is Required"),
  lessonActualAmount: Yup.string().required("Lesson Actual Amount Is Required"),
  lessonDiscountAmount: Yup.string().required("Lesson Discount Amount Is Required"),
});

export default class EditCourseLessons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseID: this.props?.location?.state?.courseId,
      lesson: [],
      lessonId: this.props?.match?.params?.id,
      duration: "",
      durationId: "",
      courseName: this.props?.location?.state?.courseId?.name,
      courseId: this.props?.location?.state?.courseId?._id,
      isSubmit: false,
      isLoading: true,
      description: EditorState.createEmpty(),
      descriptionValue: "",
      quizListLength: "",
      homeworkListLength: "",
    };
  }

  componentDidMount() {
    this.getLessonDetail();
    this.getQuizkDetails();
    this.getHomeWorkDetails();
  }

  // Log out
  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  // Get lesson details
  getLessonDetail = () => {
    const { lessonId } = this.state;
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/courseLesson/" + lessonId, { headers: { token: token } })
      .then((res) => {
        const data = res.data.data.getOne;
        const contentState = convertFromRaw(JSON.parse(data.description));
        const editorState = EditorState.createWithContent(contentState);
        const editedText = convertToRaw(editorState.getCurrentContent());
        this.setState({
          lesson: data,
          duration: { value: data.duration, label: data.duration },
          durationId: data.duration,
          isLoading: false,
          description: editorState,
          descriptionValue: editedText.blocks[0].text,
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

  getQuizkDetails = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/lessonQuiz/list", {
      params: {
        courseLessonId: this.state.lessonId,
        token: token,
      },
    })
      .then((res) => {
        const data = res.data.quizData;
        const quizData = data.length;
        this.setState({
          quizListLength: quizData,
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

  getHomeWorkDetails = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/lessonHomework/list", {
      params: {
        courseLessonId: this.state.lessonId,
        token: token,
      },
    })
      .then((res) => {
        const data = res.data.homeworkData;
        const homeworkData = data.length;
        this.setState({
          homeworkListLength: homeworkData,
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
  onChangeDescription = (e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    this.setState({ descriptionValue: editedText.blocks[0].text });
  };

  // Submit form
  submitForm = (value) => {
    const convertedData = JSON.stringify(convertToRaw(this.state.description.getCurrentContent()));
    const { lessonId } = this.state;
    const quizCount = this.state.quizListLength;
    const homeWorkCount = this.state.homeworkListLength;
    const actualAmount = parseInt(value.lessonActualAmount);
    const discountAmount = parseInt(value.lessonDiscountAmount);
    const token = localStorage.getItem("sessionId");

    if (discountAmount > actualAmount) {
      toast.error("Lesson Discount Amount Should Be Lesser Than Actual Amount ");
    } else if (quizCount === 0 || homeWorkCount === 0) {
      toast.error("Quiz And HomeWork Need Created For This Lesson");
      this.setState({ isSubmit: false });
    } else {
      this.setState({ isSubmit: true });

      Api.patch("api/v1/courselesson/" + lessonId, {
        courseId: this.state.courseId,
        lessonNumber: value.lessonNumber,
        lessonName: value.lessonName,
        lessonActualAmount: actualAmount,
        lessonDiscountAmount: discountAmount,
        description: convertedData,
        duration: this.state.durationId,
        token: token,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            this.setState({ isSubmit: false });
            this.getLessonDetail();
            toast.success("Updated");
          } else {
            toast.error(response.data.message);
            this.setState({ isSubmit: false });
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
            this.setState({ isSubmit: false });
          }
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            this.logout();
            toast.error("Session Timeout");
          }
          this.setState({ isSubmit: false });
        });
    }
  };

  render() {
    const { lesson, courseName, isLoading, lessonId, courseId } = this.state;

    return (
      <Container className=" mt-1 ">
        <CourseSideMenu lessonId={lessonId} courseId={courseId ? courseId : this.state.courseID} />
        <div className="edit-course-lesson-style mx-1">
          {isLoading ? (
            <Loader />
          ) : (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className="mt-2 mb-4">
                  <h4>{courseName}</h4>
                </div>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    lessonNumber: lesson.lessonNumber,
                    lessonName: lesson.lessonName,
                    lessonActualAmount: lesson.lessonActualAmount,
                    lessonDiscountAmount: lesson.lessonDiscountAmount,
                    description: "",
                    descriptionValue: this.state.descriptionValue,
                  }}
                  validationSchema={createLessonSchema}
                  onSubmit={(values) => this.submitForm(values)}
                >
                  {(formik) => {
                    const { values, setFieldValue, handleChange, handleSubmit, handleBlur, isValid } = formik;
                    return (
                      <div>
                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <Col xs={12} sm={6}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Lesson Number</Label>
                                <FormControl
                                  type="type"
                                  name="lessonNumber"
                                  id="lessonNumber"
                                  placeholder="Lesson No."
                                  value={values.lessonNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-styles"
                                />
                                <ErrorMessage name="lessonNumber" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Lesson Name</Label>
                                <FormControl
                                  type="type"
                                  name="lessonName"
                                  id="lessonName"
                                  placeholder="Enter Lesson Name"
                                  value={values.lessonName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-styles"
                                />
                                <ErrorMessage name="lessonName" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs={12} sm={6}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Actual Amount</Label>
                                <InputGroup className="input-group ">
                                  <InputGroup.Text>
                                    <FontAwesomeIcon icon={faDollarSign} size="1x" />
                                  </InputGroup.Text>
                                  <FormControl
                                    type="type"
                                    name="lessonActualAmount"
                                    id="lessonActualAmount"
                                    placeholder=" Actual Amount"
                                    value={values.lessonActualAmount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-styles"
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  name="lessonActualAmount"
                                  component="span"
                                  className="error text-danger"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Discount Amount</Label>
                                <InputGroup className="input-group ">
                                  <InputGroup.Text>
                                    <FontAwesomeIcon icon={faDollarSign} size="1x" />
                                  </InputGroup.Text>
                                  <FormControl
                                    type="type"
                                    name="lessonDiscountAmount"
                                    id="lessonDiscountAmount"
                                    placeholder=" Discount Amount"
                                    value={values.lessonDiscountAmount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-styles"
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  name="lessonDiscountAmount"
                                  component="span"
                                  className="error text-danger"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          <div>
                            <Label notify={true}>Description</Label>
                            <div className="description">
                              <Editor
                                spellCheck
                                editorState={this.state.description}
                                onEditorStateChange={(e) => {
                                  this.setState({ description: e });
                                  this.onChangeDescription.bind(this, setFieldValue, e);
                                }}
                                toolbar={{
                                  options: ["inline", "list", "textAlign"],
                                }}
                              />
                            </div>
                            {this.state.descriptionValue === "" && (
                              <p className="error text-danger">Description Is Required</p>
                            )}
                          </div>
                          <div className="d-flex justify-content-end my-4">
                            <Button
                              className="px-3 Kharpi-cancel-btn"
                              onClick={() => {
                                this.props.history.goBack();
                              }}
                            >
                              CANCEL
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={!isValid || this.state.isSubmit || this.state.descriptionValue === ""}
                              className={`${
                                !isValid || this.state.isSubmit || this.state.descriptionValue === ""
                                  ? "save-changes-disable ms-3"
                                  : "save-changes-active ms-3"
                              }`}
                              onClick={() => handleSubmit}
                            >
                              UPDATE
                            </Button>
                          </div>
                        </Form>
                      </div>
                    );
                  }}
                </Formik>
              </Col>
            </Row>
          )}
        </div>
      </Container>
    );
  }
}
