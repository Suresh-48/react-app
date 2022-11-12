import React, { Component } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import { InputGroup, FormControl, Form, Container, Modal, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, convertFromRaw } from "draft-js";

// Api
import Api from "../../Api";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faDollarSign, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

//css
import "../../css/CourseCreation.scss";

// Component
import Loader from "../core/Loader";
import CourseSideMenu from "../CourseSideMenu";
import Label from "../../components/core/Label";
import { customStyles } from "../core/Selector";

// Validation
const SignInSchema = Yup.object().shape({
  type: Yup.object().required("Type Name Is Required"),
  category: Yup.object().required("Category Name Is Required"),
  courseName: Yup.string().required("Course Name Is Required"),
  courseImage: Yup.mixed().required("Image Is Required"),
  duration: Yup.object()
    .required("Duration is Required")
    .nullable(),
});

export default class EditCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseId: this.props?.match?.params?.id,
      aliasName: this.props?.location?.aliasName,
      category: "",
      categoryId: "",
      type: "",
      typeId: "",
      options: [],
      show: false,
      selectCategory: "",
      date: "",
      isFuture: false,
      imagePreview: undefined,
      isSubmit: false,
      courseData: [],
      isLoading: true,
      duration: "",
      durationValue: "",
      imageType: "image",
      description: EditorState.createEmpty(),
      descriptionValue: "",
    };
  }

  //logout
  logout = () => {
    setTimeout(() => {
      localStorage.clear(this.props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Course Data
  getCourseData = () => {
    const token = localStorage.getItem("sessionId");
    Api.get(`api/v1/course/${this.state.courseId}`, { headers: { token: token } })
      .then((response) => {
        const data = response.data.data;
        const contentState = convertFromRaw(JSON.parse(data.description));
        const editorState = EditorState.createWithContent(contentState);
        const editedText = convertToRaw(editorState.getCurrentContent());
        this.setState({
          courseData: data,
          category: { value: data?.category?._id, label: data?.category?.name },
          type: { value: data.submitType, label: data.submitType },
          isFuture: data.isFuture,
          categoryId: data?.category?._id,
          imagePreview: data.imageUrl,
          typeId: data.submitType,
          duration: { value: data.duration, label: data.duration },
          durationValue: data.duration,
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

  onChangeDescription = (setFieldValue, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    this.setState({ descriptionValue: editedText.blocks[0].text });
  };

  componentDidMount() {
    this.getCategory();
    this.getCourseData();
  }

  // Get category
  getCategory = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/category", {
      headers: {
        token: token,
      },
    })
      .then((res) => {
        const option = res.data.data.data;
        this.setState({ options: option });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  handleModal() {
    this.setState({ show: !this.state.show });
  }

  // Submit form
  submitForm = (values) => {
    const convertedData = JSON.stringify(convertToRaw(this.state.description.getCurrentContent()));
    const token = localStorage.getItem("sessionId");
    this.setState({ isSubmit: true });
    Api.patch("api/v1/course/" + this.state.courseId, {
      id: this.state.courseId,
      category: this.state.categoryId,
      name: values.courseName,
      description: convertedData,
      type: this.state.typeId,
      isFuture: this.state.isFuture,
      duration: this.state.durationValue,
      token: token,
    })
      .then((response) => {
        const status = response.status;
        const image = this.state.imagePreview;

        if (status === 201) {
          if (image) {
            if (image === this.state.courseData.imageUrl) {
              Api.patch("api/v1/course/image/update/" + this.state.courseId, {
                imageUrl: image,
                token: token,
              })
                .then((res) => {
                  toast.success("Updated");
                  this.setState({ isSubmit: false });
                })
                .catch((error) => {
                  const errorStatus = error?.response?.status;
                  if (errorStatus === 401) {
                    this.logout();
                    toast.error("Session Timeout");
                  }
                });
            } else {
              Api.patch("api/v1/course/image/upload", {
                courseId: this.state.courseId,
                image: this.state.imagePreview,
                token: token,
              })
                .then((res) => {
                  toast.success("Updated");
                  this.setState({ isSubmit: false });
                })
                .catch((error) => {
                  const errorStatus = error?.response?.status;
                  if (errorStatus === 401) {
                    this.logout();
                    toast.error("Session Timeout");
                  }
                });
            }
          } else {
            Api.patch("api/v1/course/image/update/" + this.state.courseId, {
              imageUrl: null,
              token: token,
            })
              .then((res) => {
                toast.success("Updated");
                this.setState({ isSubmit: false });
              })
              .catch((error) => {
                const errorStatus = error?.response?.status;
                if (errorStatus === 401) {
                  this.logout();
                  toast.error("Session Timeout");
                }
              });
          }
        } else {
          this.setState({ isSubmit: false });
          toast.error(response.data.message);
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
      });
  };

  // Create Category
  createCategory = () => {
    const token = localStorage.getItem("sessionId");
    this.setState({ isSubmit: true });
    Api.post("api/v1/category", {
      name: this.state.selectCategory,
      token: token,
    })
      .then((response) => {
        const status = response.status;
        const data = response.data.data;
        if (status === 201) {
          this.setState({
            category: {
              id: data.createCategory.id,
              label: data.createCategory.name,
            },
            categoryId: data.createCategory.id,
            selectCategory: "",
          });
          this.handleModal();
          this.getCategory();
          this.setState({ isSubmit: false });
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
      });
  };

  // Select Image
  selectFile = async (event, { setFieldValue }) => {
    const file = event.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await this.convertBase64(file);
    this.setState({ imagePreview: base64, imageType: type });
    setFieldValue("courseImage", base64);
  };

  // Convert Image to Base64
  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  closePreview = (setFieldValue) => {
    this.setState({ imagePreview: undefined });
    setFieldValue("courseImage", "");
  };

  render() {
    const { courseData, isLoading } = this.state;

    return (
      <Container className="mt-1">
        <CourseSideMenu courseId={this.state.courseId} aliasName={this.state.aliasName} />
        <div className="row edit-course-lesson-style mt-4 mx-0">
          {isLoading ? (
            <Loader />
          ) : (
            <div>
              {/* <div className="d-flex justify-content-center align-items-center mt-1">
                <FontAwesomeIcon icon={faBookOpen} size="3x" color="#1d1464" />
              </div> */}
              <div className="mt-3 mt-1">
                <h4>Edit Course </h4>
              </div>
              <div className="col-sm-12">
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    category: this.state.category,
                    courseName: courseData.name,
                    description: "",
                    descriptionValue: this.state.descriptionValue,
                    type: this.state.type,
                    duration: this.state.duration,
                    courseImage: this.state.imagePreview,
                  }}
                  validationSchema={SignInSchema}
                  onSubmit={(values) => this.submitForm(values)}
                >
                  {(formik) => {
                    const { values, handleChange, handleSubmit, handleBlur, isValid, setFieldValue } = formik;
                    return (
                      <Row>
                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <Col xs={12} sm={12} md={7}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Category</Label>

                                <Select
                                  styles={customStyles}
                                  value={values.category}
                                  placeholder="Select Category"
                                  name="category"
                                  isOptionDisabled={(options) => options.isdisabled} // disable an option
                                  onChange={(e) => {
                                    if (e.value === "create new") {
                                      this.setState({
                                        show: !this.state.show,
                                      });
                                      this.getCategory();
                                      this.getCourseData();
                                    } else {
                                      setFieldValue("category", e);
                                      this.setState({
                                        category: e,
                                        categoryId: e.value,
                                      });
                                      this.getCategory();
                                      this.getCourseData();
                                    }
                                  }}
                                  options={[
                                    {
                                      value: "create new",
                                      label: "Create New Category",
                                      isdisabled: true,
                                    },
                                    {
                                      options: this?.state?.options?.map((list) => ({
                                        value: list.id,
                                        label: list.name,
                                        isdisabled: true,
                                      })),
                                    },
                                  ]}
                                />
                                <ErrorMessage
                                  name="category"
                                  component="span"
                                  className="error text-danger error-message"
                                />
                              </Form.Group>
                              <Form.Group className="form-row mb-3" controlId="courseName">
                                <Label notify={true}>Course Name</Label>
                                <FormControl
                                  type="type"
                                  name="courseName"
                                  id="courseName"
                                  placeholder="Enter Course Name"
                                  value={values.courseName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-styles"
                                />
                                <ErrorMessage
                                  name="courseName"
                                  component="span"
                                  className="error text-danger error-message"
                                />
                              </Form.Group>
                              <div className="mb-3">
                                <Label notify={true}>Description</Label>
                                <div className="description">
                                  <Editor
                                    spellCheck
                                    editorState={this.state.description}
                                    onEditorStateChange={(e) => {
                                      this.setState({ description: e });
                                      this.onChangeDescription(setFieldValue, e);
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

                              <div className="row mb-3">
                                <Col xs={12} sm={6} md={6}>
                                  <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                                    <Label notify={true}>Status</Label>
                                    <br />
                                    <Select
                                      value={values.type}
                                      styles={customStyles}
                                      placeholder="Select Status"
                                      name="type"
                                      onChange={(e) => {
                                        setFieldValue("type", e);
                                        this.setState({
                                          typeId: e.value,
                                        });
                                      }}
                                      options={[
                                        { value: "Draft", label: "Draft" },
                                        {
                                          value: "Publish",
                                          label: "Publish",
                                        },
                                      ]}
                                    />
                                    <ErrorMessage
                                      name="type"
                                      component="span"
                                      className="error text-danger error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col xs={12} sm={6} md={6}>
                                  <Form.Group className="form-row">
                                    <Label notify={true}>Durations</Label>
                                    <Select
                                      name="duration"
                                      styles={customStyles}
                                      value={values.duration}
                                      onChange={(e) => {
                                        setFieldValue("duration", e);
                                        this.setState({ duration: e.value });
                                      }}
                                      options={[
                                        {
                                          value: "1 hour",
                                          label: "1 hour",
                                        },
                                      ]}
                                    />
                                    <ErrorMessage name="duration" component="span" className="error text-danger" />
                                  </Form.Group>
                                </Col>
                              </div>
                              <div>
                                <Col className="d-flex justify-content-start align-items-center">
                                  <Form.Group className="form-row">
                                    <Form.Check
                                      className="checkbox-style mt-0"
                                      type="checkbox"
                                      label="Display In Landing Page"
                                      checked={this.state.isFuture}
                                      onChange={(e) => {
                                        this.setState({
                                          isFuture: !this.state.isFuture,
                                        });
                                      }}
                                    />
                                  </Form.Group>
                                </Col>
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={5}>
                              <Row>
                                <div className="d-flex justify-content-center  ">
                                  <label className="file-upload">
                                    <input
                                      type="file"
                                      name="courseImage"
                                      accept="image/*"
                                      className="fileToUpload"
                                      id="fileToUpload"
                                      onChange={(e) => {
                                        this.selectFile(e, { setFieldValue });
                                      }}
                                    />
                                    {this.state.imagePreview ? "Change Image" : "Upload Image"}
                                  </label>
                                </div>
                                <div>
                                  {this.state.imagePreview ? (
                                    <div>
                                      <div className="d-flex justify-content-center mt-4">
                                        <img className="image-preview-size" src={this.state.imagePreview} alt="" />
                                      </div>
                                      <div className="d-flex justify-content-center align-items-center mt-3">
                                        {this.state.imageType !== "image" ? (
                                          <p className="d-flex justify-content-center error text-danger fs-6">
                                            Please Select A Image File
                                          </p>
                                        ) : (
                                          <p
                                            style={{
                                              color: "red",
                                              fontWeight: "500",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              this.closePreview(setFieldValue);
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faTrashAlt}
                                              size="lg"
                                              color="#bf1000"
                                              className="delete-icon"
                                            />
                                            Remove Image
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <Row className="d-flex justify-content-center">
                                      <Row>
                                        <img
                                          className="image-preview-size"
                                          src="https://thumbs.dreamstime.com/b/arrow-upload-icon-logo-design-template-117344870.jpg"
                                          alt=" "
                                        />
                                      </Row>
                                      <Row>
                                        {this.state.imagePreview === undefined && (
                                          <p className="image-validation"> Image Is Required</p>
                                        )}
                                      </Row>
                                    </Row>
                                  )}
                                </div>
                              </Row>
                            </Col>
                            <Row className=" mb-4 mt-3">
                              <Col className="d-flex justify-content-end ">
                                <button
                                  type="submit"
                                  disabled={!isValid || this.state.isSubmit || this.state.descriptionValue === ""}
                                  variant="contained"
                                  // style={{ width: "30%" }}
                                  className={`${
                                    !isValid || this.state.isSubmit || this.state.descriptionValue === ""
                                      ? "save-changes-disable font-weight-bold py-2 px-3"
                                      : "save-changes-active font-weight-bold py-2 px-3"
                                  }`}
                                >
                                  SAVE CHANGES
                                </button>
                              </Col>
                            </Row>
                          </Row>
                        </Form>
                      </Row>
                    );
                  }}
                </Formik>
                <Modal show={this.state.show} centered onHide={() => this.handleModal()}>
                  <Modal.Body id="contained-modal-title-vcenter">
                    <div className="container py-3">
                      <div className="row flex-direction-row">
                        <h3 className=" d-flex justify-content-center align-self-center ">Create Course Category</h3>
                      </div>
                      <div className="mt-3">
                        <Row>
                          <Form className="category-form-style">
                            <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                              <Label notify={true}>Category Name</Label>
                              <FormControl
                                className="form-styles align-self-center"
                                type="text"
                                placeholder="Category Name"
                                value={this.state.selectCategory}
                                onChange={(e) =>
                                  this.setState({
                                    selectCategory: e.target.value,
                                  })
                                }
                              />
                            </Form.Group>
                          </Form>
                        </Row>
                        <Row className="button-content-style">
                          <Col xs={6} sm={6} md={6}>
                            <Button
                              type="submit"
                              fullWidth
                              className="Kharpi-cancel-btn"
                              color="#fff"
                              style={{ width: "100%", borderRadius: 5 }}
                              onClick={() => this.handleModal()}
                            >
                              Cancel
                            </Button>
                          </Col>
                          <Col xs={6} sm={6} md={6}>
                            <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              className="karphi-primary-length"
                              disabled={this.state.selectCategory === "" || this.state.isSubmit}
                              onClick={() => this.createCategory()}
                            >
                              Create
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          )}
        </div>
      </Container>
    );
  }
}
