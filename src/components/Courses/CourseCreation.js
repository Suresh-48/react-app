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
import { convertToRaw } from "draft-js";

// Api
import Api from "../../Api";

// Styles
import "../../css/CourseCreation.scss";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faDollarSign, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// Component
import Label from "../../components/core/Label";
import Loader from "../core/Loader";

//selector custom style
import { customStyles } from "../core/Selector";

const SignInSchema = Yup.object().shape({
  category: Yup.object().required("Category Name Is Required"),
  courseName: Yup.string().required("Course Name Is Required"),
  descriptionValue: Yup.string().required("Description Is Required"),
  courseImage: Yup.mixed().required("Image Is Required"),
  duration: Yup.object()
    .required("Duration is Required")
    .nullable(),
});

export default class CoursesCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      categoryId: "",
      type: "",
      typeId: "Draft",
      options: [],
      show: false,
      selectCategory: "",
      date: "",
      isFuture: false,
      imagePreview: undefined,
      categoryImagePreview: undefined,
      isSubmit: false,
      duration: "1",
      durationValue: "",
      imageType: "",
      isLoading: true,
      description: EditorState.createEmpty(),
    };
  }

  // Description on change
  onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  componentDidMount() {
    this.getCategory();
  }

  // Get Course Category
  getCategory = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("/api/v1/category/", { headers: { token: token } })
      .then((res) => {
        const option = res.data.data.data;
        this.setState({ options: option, isLoading: false });
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
    this.setState({ show: !this.state.show, selectCategory: "", categoryImagePreview: undefined });
  }

  // Form submit
  submitForm = (values) => {
    const token = localStorage.getItem("sessionId");
    const convertedData = JSON.stringify(convertToRaw(this.state.description.getCurrentContent()));
    this.setState({ isSubmit: true });
    Api.post("api/v1/course", {
      category: this.state.categoryId,
      name: values.courseName,
      description: convertedData,
      type: this.state.typeId,
      isFuture: this.state.isFuture,
      duration: this.state.duration,
      token: token,
    })
      .then((response) => {
        const status = response.status;
        const image = this.state.imagePreview;
        if (status === 201) {
          if (image) {
            const courseId = response.data.data.createData.id;
            Api.patch("api/v1/course/image/upload", {
              courseId: courseId,
              image: this.state.imagePreview,
              token: token,
            }).then((res) => {
              this.props.history.goBack();
              this.setState({ isSubmit: false });
            });
          } else {
            this.props.history.goBack();
            this.setState({ isSubmit: false });
          }
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
  };

  // Log out
  logout = () => {
   setTimeout(() => {
     localStorage.clear(this.props.history.push("/kharpi"));
     window.location.reload();
   }, 2000);
  };

  // Create Category
  createCategory = () => {
    this.setState({ isSubmit: true });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("sessionId");
    Api.post("api/v1/category/", {
      name: this.state.selectCategory,
      createdBy: userId,
      token: token,
    })
      .then((response) => {
        const status = response.status;
        const data = response.data.data;
        const categoryImage = this.state.categoryImagePreview;
        if (status === 201) {
          if (categoryImage) {
            const categoryId = response.data.data.createCategory.id;
            Api.patch("api/v1/category/image/upload", {
              categoryId: categoryId,
              image: this.state.categoryImagePreview,
              token: token,
            }).then((res) => {
              this.getCategory();
              this.setState({ isSubmit: false });
            });
          } else {
            this.props.history.goBack();
            this.setState({ isSubmit: false });
          }
          this.setState({
            category: {
              id: data?.createCategory?.id,
              label: data?.createCategory?.name,
            },
            categoryId: data?.createCategory?.id,
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

  // Select Image from file
  selectFile = async (event, { setFieldValue }) => {
    const file = event.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await this.convertBase64(file);
    this.setState({ imagePreview: base64, imageType: type });
    setFieldValue("courseImage", base64);
  };

  // Select Image from file
  selectCategoryFile = async (event) => {
    const file = event.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await this.convertBase64(file);
    this.setState({ categoryImagePreview: base64, imageType: type });
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

  categoryImageClosePReview = () => {
    this.setState({ categoryImagePreview: undefined });
  };

  render() {
    const { isLoading } = this.state;
    return (
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="row">
            <div className="d-flex justify-content-center align-items-center mt-1">
              <FontAwesomeIcon icon={faBookOpen} size="3x" color="#1d1464" />
            </div>
            <div className="d-flex justify-content-center align-items-center mt-1">
              <h2>Course Creation</h2>
            </div>
            <div className="col-sm-12">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  category: this.state.category,
                  courseName: "",
                  description: "",
                  descriptionValue: "",
                  type: { value: "Draft", label: "Draft" },
                  courseImage: "",
                  duration: { value: "1", label: "1 Hour" },
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
                          <Col md={7}>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Category</Label>
                              <Select
                                value={values.category}
                                styles={customStyles}
                                placeholder="Select Category"
                                name="category"
                                onChange={(e) => {
                                  if (e.value === "create new") {
                                    this.setState({ show: !this.state.show });
                                  } else {
                                    setFieldValue("category", e);
                                    this.setState({
                                      category: e,
                                      categoryId: e.value,
                                    });
                                  }
                                }}
                                options={[
                                  {
                                    value: "create new",
                                    label: "Create New Category",
                                  },
                                  {
                                    options: this?.state?.options?.map((list) => ({
                                      value: list.id,
                                      label: list.name,
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
                            <Form.Group className="form-row mb-3">
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

                            <div className="row mb-3">
                              <Col xs={12} sm={6} md={6}>
                                <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                                  <Label notify={true}>Status</Label>
                                  <br />
                                  <Select
                                    value={values.type}
                                    styles={customStyles}
                                    placeholder="Select Status"
                                    onChange={(e) => {
                                      setFieldValue("type", e);
                                      this.setState({
                                        typeId: e.value,
                                      });
                                    }}
                                    options={[
                                      { value: "Draft", label: "Draft" },
                                      // {
                                      //   value: "Publish",
                                      //   label: "Publish",
                                      // },
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
                                  <Label notify={true}>Duration</Label>
                                  <Select
                                    name="duration"
                                    styles={customStyles}
                                    placeholder="Select Duration"
                                    value={values.duration}
                                    onChange={(e) => {
                                      setFieldValue("duration", e);
                                      this.setState({ duration: e.value });
                                    }}
                                    options={[
                                      {
                                        value: "1 ",
                                        label: "1 Hour",
                                      },
                                    ]}
                                  />
                                  <ErrorMessage
                                    name="duration"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                            </div>
                            <div>
                              <Col xs={12} sm={12} md={12} className="d-flex justify-content-start align-items-center">
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
                          <Col md={5}>
                            <Row>
                              <Row className="d-flex justify-content-center  ">
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
                                  {this.state.imagePreview ? "Change File" : "Choose File"}
                                </label>
                              </Row>
                              <div>
                                {this.state.imagePreview ? (
                                  <div>
                                    <div className="d-flex justify-content-center mt-4">
                                      <img className="image-preview-size" src={this.state.imagePreview} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center mt-3 ">
                                      {this.state.imageType !== "image" ? (
                                        <p className="d-flex justify-content-center error text-danger fs-6">
                                          Please Select A Image File
                                        </p>
                                      ) : (
                                        <p
                                          style={{
                                            color: "red",
                                            fontWeight: "400",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            this.closePreview(setFieldValue);
                                          }}
                                        >
                                          <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            size="sm"
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
                                        alt=""
                                      />
                                    </Row>
                                    <Row>
                                      <ErrorMessage
                                        className="d-flex justify-content-center error text-danger fs-6"
                                        name="courseImage"
                                        component="span"
                                      />
                                    </Row>
                                  </Row>
                                )}
                              </div>
                            </Row>
                          </Col>
                          <Row className="d-flex justify-content-end align-items-center mb-4  ">
                            <Button
                              type="submit"
                              disabled={!isValid || this.state.isSubmit}
                              style={{ width: "30%" }}
                              variant="contained"
                              className={`${!isValid || this.state.isSubmit ? "create-disable" : "create-active"}`}
                            >
                              CREATE
                            </Button>
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
                      <Row>
                        <Form className="category-form-style">
                          <Form.Group className="form-row mb-1" style={{ width: "100%" }}>
                            <Label notify={true}>Select Category Image</Label>
                          </Form.Group>
                          <Form.Group className="form-row " style={{ width: "100%", marginBottom: "30px" }}>
                            <label className="file-upload">
                              <input
                                type="file"
                                name="courseImage"
                                accept="image/*"
                                className="fileToUpload"
                                id="fileToUpload"
                                onChange={(e) => {
                                  this.selectCategoryFile(e);
                                }}
                              />
                              {this.state.categoryImagePreview ? "Change Image" : "Upload Image"}
                            </label>
                          </Form.Group>
                        </Form>
                      </Row>
                      <Row>
                        <div>
                          {this.state.categoryImagePreview ? (
                            <div>
                              <div className="d-flex justify-content-center mt-4">
                                <img className="image-preview-size" src={this.state.categoryImagePreview} alt="" />
                              </div>
                              <div className="d-flex justify-content-center align-items-center mt-3 ">
                                {this.state.imageType !== "image" ? (
                                  <p className="d-flex justify-content-center error text-danger fs-6">
                                    Please Select A Image File
                                  </p>
                                ) : (
                                  <p
                                    style={{
                                      color: "red",
                                      fontWeight: "400",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      this.categoryImageClosePReview();
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrashAlt}
                                      size="sm"
                                      color="#bf1000"
                                      className="delete-icon"
                                    />
                                    Remove Image
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </Row>
                      <Row className="button-content-style">
                        <Col xs={6} sm={6} md={6}>
                          <Button
                            type="submit"
                            fullWidth
                            color="#fff"
                            className="Kharpi-cancel-btn"
                            style={{ width: "100%", borderRadius: 5 }}
                            onClick={() => this.handleModal()}
                          >
                            Cancel
                          </Button>
                        </Col>
                        <Col xs={6} sm={6} md={6}>
                          <Button
                            type="submit"
                            // className="Kharpi-save-btn"
                            fullWidth
                            // style={{color:"white"}}
                            variant="contained"
                            color="primary"
                            disabled={
                              this.state.selectCategory === "" ||
                              this.state.isSubmit ||
                              this.state.categoryImagePreview === "" ||
                              this.state.categoryImagePreview === undefined
                            }
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
      </Container>
    );
  }
}
