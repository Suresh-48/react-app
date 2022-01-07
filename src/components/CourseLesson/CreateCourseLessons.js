import React, { Component } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import Button from "@material-ui/core/Button";
import * as Yup from "yup";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from "draft-js";

// Styles
import "../../css/CreateCourseLesson.scss";

// Api
import Api from "../../Api";

// Component
import { toast } from "react-toastify";
import Label from "../../components/core/Label";

// Validations
const createLessonSchema = Yup.object().shape({
  lessonNumber: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "This Field Accept Numbers Only"
    )
    .required("Lesson Number Is Required"),

  lessonName: Yup.string().required("Lesson Name Is Required"),

  descriptionValue: Yup.string().required("Description Is Required"),
});

export default class CreateCourseLessons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: "",
      durationValue: "",
      isSubmit: false,
      courseName: this.props?.location?.state?.courseName,
      courseId: this.props?.location?.state?.courseId,
      description: EditorState.createEmpty(),
    };
  }

  // Description on change
  onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  // Submit form
  submitForm = (value) => {
    const convertedData = JSON.stringify(convertToRaw(this.state.description.getCurrentContent()));
    const { courseId } = this.state;
    this.setState({ isSubmit: true });
    Api.post("api/v1/courseLesson/", {
      courseId: courseId,
      lessonNumber: value.lessonNumber,
      lessonName: value.lessonName,
      description: convertedData,
      duration: this.state.duration,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          this.setState({ isSubmit: false });
          this.props.history.goBack();
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
    return (
      <div>
        <Container>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className=" mt-2 mb-4">
                <h4>{this.state.courseName}</h4>
              </div>
              <Formik
                initialValues={{
                  lessonNumber: "",
                  lessonName: "",
                  description: "",
                  descriptionValue: "",
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
                                placeholder="Lesson Number"
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
                              name="descriptionValue"
                              editorState={this.state.description}
                              onEditorStateChange={(e) => {
                                this.setState({ description: e });
                                this.onChangeDescription({ setFieldValue }, e);
                              }}
                              toolbar={{
                                options: ["inline", "list", "textAlign"],
                              }}
                            />
                          </div>
                          <ErrorMessage name="descriptionValue" component="span" className="error text-danger" />
                        </div>
                        <div className="d-flex justify-content-end my-4">
                          <Button
                            type="submit"
                            fullWidth
                            disabled={!isValid || this.state.isSubmit}
                            variant="contained"
                            className={`${!isValid || this.state.isSubmit ? "create-disable" : "create-active"}`}
                          >
                            CREATE
                          </Button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
