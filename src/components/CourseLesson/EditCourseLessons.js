import React, { Component } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
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

// Validation
const createLessonSchema = Yup.object().shape({
  lessonNumber: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Lesson Number"
    )
    .required("Lesson Number Is Required"),

  lessonName: Yup.string().required("Lesson Name Is Required"),
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
    };
  }

  componentDidMount = () => {
    this.getLessonDetail();
  };

  // Get lesson details
  getLessonDetail = () => {
    const { lessonId } = this.state;
    Api.get("api/v1/courseLesson/" + lessonId).then((res) => {
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
    this.setState({ isSubmit: true });
    Api.patch("api/v1/courselesson/" + lessonId, {
      courseId: this.state.courseId,
      lessonNumber: value.lessonNumber,
      lessonName: value.lessonName,
      description: convertedData,
      duration: this.state.durationId,
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
        this.setState({ isSubmit: false });
      });
  };

  render() {
    const { lesson, courseName, isLoading, lessonId, courseId } = this.state;

    return (
      <Container>
        <CourseSideMenu lessonId={lessonId} courseId={courseId ? courseId : this.state.courseID} />
        <div className="main">
          {isLoading ? (
            <Loader />
          ) : (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <div className=" mt-2 mb-4">
                  <h4>{courseName}</h4>
                </div>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    lessonNumber: lesson.lessonNumber,
                    lessonName: lesson.lessonName,
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
                          </Row>
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
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              disabled={!isValid || this.state.isSubmit || this.state.descriptionValue === ""}
                              className={`${
                                !isValid || this.state.isSubmit || this.state.descriptionValue === ""
                                  ? "save-changes-disable"
                                  : "save-changes-active"
                              }`}
                              onClick={() => handleSubmit}
                            >
                              SAVE CHANGES
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
