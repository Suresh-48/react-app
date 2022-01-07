import React, { Component } from "react";
import { Container, Row, Col, Card, Form, Modal, FormControl, InputGroup } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { Divider } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import Carousel from "react-elastic-carousel";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Avatar from "react-avatar";

// Styles
import "../../css/CourseDetail.scss";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";
import Label from "../../components/core/Label";
import { tableIcons } from "../core/TableIcons";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Styles
const tableTheme = createTheme({
  overrides: {
    MuiTableRow: {
      root: {
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "rgba(224, 224, 224, 1) !important",
        },
        "&:nth-child(even)": {
          backgroundColor: "#f0f5f5",
        },
      },
    },
  },
});

// Carousel
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3, itemsToScroll: 3 },
  { width: 1200, itemsToShow: 3, itemsToScroll: 3 },
  { width: 1440, itemsToShow: 5, itemsToScroll: 5 },
];

//Validation
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Enter Valid Email").required("Email Is Required"),
  password: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
      "Use 8 or more characters with a mix of letters, numbers, special character (!@#$%^&)"
    )
    .min(8)
    .required("Password is Required"),
});

export default class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aliasName: this.props?.match?.params?.id,
      courseData: "",
      lessonDetail: [],
      scheduleDetail: [],
      show: false,
      email: "",
      password: "",
      token: "",
      userId: "",
      isLoading: true,
      isSubmit: false,
      passwordShown: false,
    };
  }
  togglePasswordVisibility = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  };

  handleModal() {
    this.setState({ show: false });
  }

  // Table Heading
  columns = [
    {
      title: "Lesson",
      width: "5%",
      render: (rowData) => `Lesson-${rowData.tableData.id + 1}`,
    },
    { title: "Lesson Name", field: "lessonName" },
    {
      title: "Description",
      render: (rowData) => <div dangerouslySetInnerHTML={this.convertFromJSONToHTML(`${rowData.description}`)}></div>,
    },
    { title: "Duration", render: (rowData) => `1 hour` },
  ];

  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  // Login
  loginUser = (values, { resetForm }) => {
    const email = values.email.toLowerCase();
    Api.post("api/v1/user/login", {
      email: email,
      password: values.password,
    })
      .then((response) => {
        resetForm({ values: "" });
        const status = response.data.status;
        if (status === "Created") {
          const token = response.data.user.token;
          const parentId = response.data.user.parentId;
          const studentId = response.data.user.studentId;
          const role = response.data.user.role;
          const userId = response.data.user.id;
          const userName = response.data.user.email;
          localStorage.setItem("sessionId", token);
          localStorage.setItem("parentId", parentId);
          localStorage.setItem("studentId", studentId);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userName", userName);
          this.setState({ show: !this.state.show });
          window.location.reload();
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
  };

  // get Course Details
  getCourseDetails = () => {
    const sessionId = localStorage.getItem("sessionId");
    this.setState({ token: sessionId });
    Api.get(`api/v1/course/detail/${this.state.aliasName}`).then((response) => {
      const data = response.data.data;
      this.setState({
        courseData: data.courseDetail,
        lessonDetail: data.lessonDetail,
        scheduleDetail: data.scheduleDetail,
        isLoading: false,
      });
    });
  };

  componentDidMount() {
    this.getCourseDetails();
    window.scrollTo(0, 0);
  }

  render() {
    const { courseData, lessonDetail, scheduleDetail, isLoading, token, isSubmit, passwordShown } = this.state;
    return (
      <Container className="py-3">
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Row>
              <Col xs={12} sm={9} className="height:auto">
                <h4>{`${courseData?.name} ${"(  $" + courseData?.discountAmount + ")"}`}</h4>
                <p dangerouslySetInnerHTML={this.convertFromJSONToHTML(courseData?.description)}></p>
                <Divider />
              </Col>
              <Col xs={12} sm={3} className="course-image-style">
                <img src={courseData?.imageUrl} className="img-fluid" alt="" />
              </Col>
            </Row>
            <Row className="mb-3">
              <h4 className="row-main">Available Timing (Central Time)</h4>
              {scheduleDetail?.length > 0 ? (
                scheduleDetail?.length < 3 ? (
                  scheduleDetail.map((scheduleDetail, i) => (
                    <Col xs={12} sm={6} md={6} lg={4} className="mt-3">
                      <Card className="shadow available-time">
                        <div className="schedule-content pt-2">
                          <p className="mb-1 weekly-on">{scheduleDetail?.weeklyOn}</p>
                          <p className="time pt-1 mb-0">{scheduleDetail?.startDate}</p>
                          <p className="time pb-1">{`${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`}</p>
                        </div>
                        {scheduleDetail?.teacherId?._id ? (
                          <div className="row mb-2">
                            <Col xs={5} className="teachers-profile-image">
                              <Avatar
                                name={`${scheduleDetail?.teacherId?.firstName} ${scheduleDetail?.teacherId?.lastName}`}
                                size="40"
                                round={true}
                                color="silver"
                              />
                            </Col>
                            <Col xs={7} className="teacher-detail px-3">
                              <span>
                                <h5 className="teachers-name mb-0">
                                  {" "}
                                  {scheduleDetail?.teacherId?.firstName} {scheduleDetail?.teacherId?.middleName}{" "}
                                  {scheduleDetail?.teacherId?.lastName}
                                </h5>
                                <h6 className="teachers-spec"> {scheduleDetail?.teacherId.speciality}</h6>
                              </span>
                            </Col>
                          </div>
                        ) : (
                          <div className="row mb-2">
                            <Col xs={4} className="teachers-profile-image">
                              <Avatar
                                src={"https://www.freeiconspng.com/thumbs/warning-icon-png/warning-icon-28.png"}
                                size="38"
                                round={true}
                                color="silver"
                              />
                            </Col>
                            <Col xs={8} className="no-teacher-detail px-3">
                              <span>
                                <h6 className="teachers-not-name mb-0">Teacher Not Updated</h6>
                                <h6 className="teachers-not-spec"> Right Now</h6>
                              </span>
                            </Col>
                          </div>
                        )}
                        <Card.Footer>
                          {scheduleDetail?.teacherId?._id ? (
                            token !== null ? (
                              <Link
                                className="enroll-link"
                                to={{
                                  pathname: `/course/checkout/${courseData?.aliasName}`,
                                  state: {
                                    courseId: courseData?.id,
                                    scheduleId: scheduleDetail?.id,
                                    coursePayment: courseData?.discountAmount,
                                  },
                                }}
                                onClick={() => {
                                  const time = `${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`;
                                  localStorage.setItem("courseTiming", time);
                                }}
                              >
                                Enroll
                              </Link>
                            ) : (
                              <Link
                                className="enroll-link"
                                to={"#"}
                                onClick={() => {
                                  this.setState({ show: true });
                                }}
                              >
                                Enroll
                              </Link>
                            )
                          ) : (
                            <Link className="enroll-link-disable" to={"#"} onClick={() => {}}>
                              Enroll
                            </Link>
                          )}
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Carousel breakPoints={breakPoints}>
                    {scheduleDetail.map((scheduleDetail, i) => (
                      <Card className="shadow available-time">
                        <div className="schedule-content pt-2">
                          <p className="mb-1 weekly-on">{scheduleDetail?.weeklyOn}</p>
                          <p className="time pt-1 mb-0">{scheduleDetail?.startDate}</p>
                          <p className="time pb-1">{`${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`}</p>
                        </div>
                        {scheduleDetail?.teacherId?._id ? (
                          <div className="row mb-2">
                            <Col xs={5} className="teachers-profile-image">
                              <Avatar
                                name={`${scheduleDetail?.teacherId?.firstName} ${scheduleDetail?.teacherId?.lastName}`}
                                size="45"
                                round={true}
                                color="silver"
                              />
                            </Col>
                            <Col xs={7} className="teacher-detail px-3">
                              <span>
                                <h5 className="teachers-name mb-0">
                                  {" "}
                                  {scheduleDetail?.teacherId?.firstName} {scheduleDetail?.teacherId?.middleName}{" "}
                                  {scheduleDetail?.teacherId?.lastName}
                                </h5>
                                <h6 className="teachers-spec"> {scheduleDetail?.teacherId.speciality}</h6>
                              </span>
                            </Col>
                          </div>
                        ) : (
                          <div className="row mb-2">
                            <Col xs={4} className="teachers-profile-image">
                              <Avatar
                                src={"https://www.freeiconspng.com/thumbs/warning-icon-png/warning-icon-28.png"}
                                size="38"
                                round={true}
                                color="silver"
                              />
                            </Col>
                            <Col xs={8} className="no-teacher-detail px-2">
                              <span>
                                <h6 className="teachers-not-name mb-0">Teacher Not Updated</h6>
                                <h6 className="teachers-not-spec"> Right Now</h6>
                              </span>
                            </Col>
                          </div>
                        )}
                        <Card.Footer>
                          {scheduleDetail?.teacherId?._id ? (
                            token !== null ? (
                              <Link
                                className="enroll-link"
                                to={{
                                  pathname: `/course/checkout/${courseData?.aliasName}`,
                                  state: {
                                    courseId: courseData?.id,
                                    scheduleId: scheduleDetail?.id,
                                    coursePayment: courseData?.discountAmount,
                                  },
                                }}
                                onClick={() => {
                                  const time = `${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`;
                                  localStorage.setItem("courseTiming", time);
                                }}
                              >
                                Enroll
                              </Link>
                            ) : (
                              <Link
                                className="enroll-link"
                                to={"#"}
                                onClick={() => {
                                  this.setState({ show: true });
                                }}
                              >
                                Enroll
                              </Link>
                            )
                          ) : (
                            <Link className="enroll-link-disable" to={"#"} onClick={() => {}}>
                              Enroll
                            </Link>
                          )}
                        </Card.Footer>
                      </Card>
                    ))}
                  </Carousel>
                )
              ) : (
                <div className="d-flex justify-content-center">
                  <h6>No Scheduled Timing</h6>
                </div>
              )}
            </Row>
            <Row className="mt-5">
              <h4 className="row-main">Course Lessons</h4>
              <ThemeProvider theme={tableTheme}>
                <MaterialTable
                  icons={tableIcons}
                  data={lessonDetail}
                  columns={this.columns}
                  localization={{
                    body: {
                      emptyDataSourceMessage: "Lessons Not Created",
                    },
                  }}
                  options={{
                    actionsColumnIndex: -1,
                    addRowPosition: "last",
                    headerStyle: {
                      fontWeight: "bold",
                      zIndex: 0,
                      backgroundColor: "#f0f5f5",
                    },
                    showTitle: false,
                    search: false,
                    toolbar: false,
                  }}
                />
              </ThemeProvider>
            </Row>
            <Modal show={this.state.show} centered onHide={() => this.handleModal()}>
              <Modal.Body id="contained-modal-title-vcenter">
                <div className="container py-3">
                  <div className="row flex-direction-row">
                    <h3 className=" d-flex justify-content-center align-self-center ">Sign In</h3>
                  </div>
                  <Formik
                    initialValues={{
                      email: "",
                      password: "",
                    }}
                    validationSchema={loginSchema}
                    onSubmit={(values, { resetForm }) => this.loginUser(values, { resetForm })}
                  >
                    {(formik) => {
                      const { values, handleChange, handleSubmit, handleBlur, isValid } = formik;
                      return (
                        <div className="mt-3">
                          <Form className="category-form-style" onSubmit={handleSubmit}>
                            <Row>
                              <Col md={12}>
                                <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                                  <Label notify={true}>Email Address</Label>
                                  <FormControl
                                    type="type"
                                    name="email"
                                    id="email"
                                    style={{ textTransform: "lowercase" }}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Email Address"
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={12}>
                                <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                                  <Label notify={true}>Password</Label>
                                  <InputGroup className="input-group ">
                                    <FormControl
                                      type={passwordShown ? "text" : "password"}
                                      name="password"
                                      id="password"
                                      placeholder="Password"
                                      value={values.password}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    <InputGroup.Text>
                                      <FontAwesomeIcon
                                        icon={passwordShown ? faEye : faEyeSlash}
                                        onClick={() => this.togglePasswordVisibility()}
                                        size="1x"
                                      />
                                    </InputGroup.Text>
                                  </InputGroup>
                                  <ErrorMessage
                                    name="password"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Form>
                          <div class="col text-center">
                            <Button
                              type="submit"
                              disabled={!isValid || isSubmit}
                              fullWidth
                              variant="contained"
                              className={`${!isValid || isSubmit ? "popup-button-disable" : "popup-button-active"}`}
                              onClick={handleSubmit}
                              style={{
                                borderRadius: 5,
                                marginTop: 10,
                                marginBottom: 25,
                              }}
                            >
                              SIGN IN
                            </Button>
                          </div>

                          <div className="or-modal-popup">
                            <div className="or-seperator">
                              <i>or</i>
                            </div>
                          </div>
                          <div className="col text-center mb-3">
                            <Link
                              className="parent-signup"
                              to={{
                                pathname: `/parent/signup`,
                                state: {
                                  courseId: courseData?.id,
                                },
                                search: `${courseData?.aliasName}`,
                              }}
                            >
                              Sign Up As Parent
                            </Link>
                          </div>
                          <div class="col text-center">
                            <Link
                              className="student-signup"
                              to={{
                                pathname: `/student/signup`,
                                state: {
                                  courseId: courseData?.id,
                                },
                                search: `${courseData?.aliasName}`,
                              }}
                            >
                              Sign Up As Student
                            </Link>
                          </div>
                          <div className="mt-5 ">
                            <Container
                              className="row mt-4 mb-2 "
                              style={{
                                justifyContent: "space-evenly",
                                display: "flex",
                              }}
                            ></Container>
                          </div>
                        </div>
                      );
                    }}
                  </Formik>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        )}
      </Container>
    );
  }
}
