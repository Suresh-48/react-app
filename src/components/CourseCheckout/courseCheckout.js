import React, { Component } from "react";
import { Container, Row, Col, Form, FormControl, Modal, Spinner, InputGroup } from "react-bootstrap";
import Select from "react-select";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../../components/core/Loader";
import Button from "@material-ui/core/Button";
import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";
import CardSection from "../core/CardSection";
// Styles
import "../../css/CourseCheckout.scss";

import { FaExclamationCircle } from "react-icons/fa";

// Api
import Api from "../../Api";

// Components
import Label from "../../components/core/Label";
import { toast } from "react-toastify";
import states from "../../components/core/States";
// Roles
import { ROLES_PARENT, ROLES_STUDENT } from "../../constants/roles";
import { customStyles } from "../core/Selector";

const role = localStorage.getItem("role");

const isParent = role === ROLES_PARENT;

// Validations
const SignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("First Name as displayed in Credit Card"),

  lastName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("Last Name as displayed in Credit Card"),

  address1: Yup.string().required("Address 1 Is Required"),

  address2: Yup.string().nullable(),

  state: Yup.object().required("State Is Required"),

  city: Yup.object().required("City Is Required"),

  zipCode: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be  5 Digits")
    .required("Zip Code Is Required")
    .nullable(),

  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .min(10, "Enter valid number")
    .max(10, "Enter valid number")
    .required("Phone Number Is Required"),

  email: Yup.string()
    .email("Enter Valid Email")
    .required("Email Is Required"),

  student: isParent && Yup.object().required("Student Name Is Required"),
});
const token = localStorage.getItem("sessionId");

class CourseCheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleDetail: this.props?.props?.location?.state?.scheduleDetail
        ? this.props?.props?.location?.state?.scheduleDetail
        : this.props?.props?.location?.state?.scheduleId,
      courseId: this.props?.props?.location?.state?.courseId,
      scheduleId: this.props?.props?.location?.state?.scheduleId?.id
        ? this.props?.props?.location?.state?.scheduleId?.id
        : this.props?.props?.location?.state?.scheduleId,
      payment: this.props?.props?.location?.state?.coursePayment
        ? this.props?.props?.location?.state?.coursePayment
        : this.props?.props?.location?.state?.lessonPayment,
      lessonIds: this.props?.props?.location?.state?.lessonIds,
      courseTime: "",
      parentId: "",
      cvc: "",
      expiry: "",
      focus: "",
      name: "",
      number: "",
      student: "",
      studentId: "",
      studentList: [],
      show: false,
      view: false,
      errorText: " ",
      isProcessing: true,
      isSubmit: false,
      role: "",
      userStudentId: "",
      studentShow: true,
      parentAddress: [],
      studentAddress: [],
      ////initial form
      studentName: "",
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      zipCode: "",
      stateCode: 0,
      errorStatus: false,
      isLoading: true,
      cityValue: "",
      stateValue: "",
      checked: false,
    };
  }

  // Log out
  logout = () => {
    setTimeout(() => {
      localStorage.clear(this.props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get Parent Address
  getParentAddress = () => {
    const token = localStorage.getItem("sessionId");
    const parentId = localStorage.getItem("parentId");
    Api.get(`api/v1/parent/${parentId}`, { headers: { token: token } })
      .then((response) => {
        const data = response.data.data.getOne;
        this.setState({
          parentAddress: data,
          firstName: data?.firstName,
          lastName: data?.lastName,
          address1: data?.address1,
          address2: data?.address2,
          phone: data?.phone,
          email: data?.email,
          city: data.city ? { value: data?.city, label: data?.city } : "",
          cityValue: data?.city,
          state: data.state ? { value: data?.state, label: data?.state } : "",
          stateValue: data?.state,
          zipCode: data?.zipCode,
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

  // Get Student Address
  getStudentAddress = () => {
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("sessionId");
    Api.get(`api/v1/student/${studentId}`, { headers: { token: token } })
      .then((response) => {
        const data = response.data.data.getOne;
        this.setState({
          studentAddress: data,
          firstName: data?.firstName,
          lastName: data?.lastName,
          address1: data?.address1,
          address2: data?.address2,
          phone: data?.phone,
          email: data?.email,
          city: data.city ? { value: data?.city, label: data?.city } : "",
          cityValue: data?.city,
          state: data.state ? { value: data?.state, label: data?.state } : "",
          stateValue: data?.state,
          zipCode: data?.zipCode,
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

  // Get userId in local storage and user details
  getStudentList = () => {
    const parentId = localStorage.getItem("parentId");
    const courseTiming = localStorage.getItem("courseTiming");
    this.setState({
      courseTime: courseTiming,
      parentId: parentId,
    });
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
        token: token,
      },
    })
      .then((res) => {
        const data = res.data.data.studentList;
        this.setState({ studentList: data });
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
    let role = localStorage.getItem("role");
    let studentId = localStorage.getItem("studentId");
    const parentId = localStorage.getItem("parentId");
    this.setState({
      role: role,
      userStudentId: studentId,
      parentId: parentId,
      isLoading: false,
    });
    this.getStudentList();
    //  isParent ? this.getParentAddress() : this.getStudentAddress()
  }

  // Submit Form post data to backend
  submit = async (values, { resetForm }) => {
    this.setState({ show: true, isSubmit: true });
    const { role, userStudentId, parentId } = this.state;
    const isStudent = role === ROLES_STUDENT;
    const isParent = role === ROLES_PARENT;

    //stripe

    const { stripe, elements } = this.props;
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    const token = localStorage.getItem("sessionId");
    if (result.error) {
      this.setState({
        show: false,
        isSubmit: false,
        view: true,
        errorText: result.error.message,
      });
      // toast.error(result.error.message);
    } else {
      {
        this.state.lessonIds
          ? Api.get("api/v1/student/upcomingSchedule/check", {
              params: {
                courseScheduleId: this.state.scheduleId,
                studentId: isParent ? this.state.studentId : userStudentId,
                lessonId: this.state.lessonIds,
                token: token,
              },
            })
              .then((res) => {
                const email = values.email.toLowerCase();
                Api.post("/api/v1/billing/lesson/strip/payment", {
                  currency: "inr",
                  price: this.state.payment * 100,
                  studentId: isParent ? this.state.studentId : userStudentId,
                  courseId: this.state.courseId,
                  courseScheduleId: this.state.scheduleId,
                  lessonId: this.state.lessonIds,
                })
                  .then(async (resposne) => {
                    const data = resposne.data;
                    const confirmPayment = await stripe.confirmCardPayment(data.clientSecret, {
                      payment_method: {
                        card: card,
                        billing_details: {
                          address: {
                            city: this.state.cityValue,
                            country: "us",
                            line1: values.address1,
                            line2: values.address2,
                            postal_code: values.zipCode,
                            state: this.state.stateValue,
                          },
                          email: email,
                          name: values.firstName,
                          phone: values.phone,
                        },
                      },
                    });

                    if (!confirmPayment.error) {
                      Api.post(
                        `api/v1/billing/checkout/lesson/${
                          (isStudent && parentId === "null") || (isStudent && parentId === null) ? "student" : "parent"
                        }`,
                        {
                          firstName: values.firstName,
                          lastName: values.lastName,
                          address1: values.address1,
                          address2: values.address2,
                          email: values.email,
                          city: this.state.cityValue,
                          state: this.state.stateValue,
                          zipCode: values.zipCode,
                          phone: values.phone,
                          parentId: this.state.parentId,
                          studentId: isParent ? this.state.studentId : userStudentId,
                          courseId: this.state.courseId,
                          courseScheduleId: this.state.scheduleId,
                          payment: this.state.payment,
                          lessonId: this.state.lessonIds,
                        }
                      ).then((res) => {
                        const status = res.status;
                        if (status === 201) {
                          resetForm({ values: "" });
                          this.setState({ student: "", isProcessing: false });
                        }
                      });
                      Api.post("api/v1/student/upcomingList", {
                        parentId: this.state.parentId,
                        studentId: isParent ? this.state.studentId : userStudentId,
                        courseId: this.state.courseId,
                        courseScheduleId: this.state.scheduleId,
                      });
                    } else {
                      this.setState({
                        show: false,
                        isSubmit: false,
                        view: true,
                        errorText: "Payment Failed",
                      });
                      // toast.error("Payment Failed");
                    }
                  })
                  .catch((error) => {
                    if (error.response && error.response.status >= 400) {
                      let errorMessage;
                      const errorRequest = error.response.request;
                      if (errorRequest && errorRequest.response) {
                        errorMessage = JSON.parse(errorRequest.response).message;
                      }
                      // toast.error(error.response.data.message);
                      this.setState({
                        isSubmit: false,
                        show: false,
                        view: true,
                        errorText: error.response.data.message,
                      });
                    }
                  });
              })
              .catch((error) => {
                if (error.response && error.response.status >= 400) {
                  let errorMessage;
                  const errorRequest = error.response.request;
                  if (errorRequest && errorRequest.response) {
                    errorMessage = JSON.parse(errorRequest.response).message;
                  }
                  // toast.error(error.response.data.message);
                  this.setState({
                    isSubmit: false,
                    show: false,
                    view: true,
                    errorText: error.response.data.message,
                  });
                }
                const errorStatus = error?.response?.status;
                if (errorStatus === 401) {
                  this.logout();
                  toast.error("Session Timeout");
                }
              })
          : Api.get("api/v1/student/upcomingSchedule/check", {
              params: {
                courseScheduleId: this.state.scheduleId,
                studentId: isParent ? this.state.studentId : userStudentId,
                token: token,
              },
            })
              .then((res) => {
                const email = values.email.toLowerCase();
                Api.post("/api/v1/billing/strip/payment", {
                  currency: "inr",
                  price: this.state.payment * 100,
                  studentId: isParent ? this.state.studentId : userStudentId,
                  courseId: this.state.courseId,
                  courseScheduleId: this.state.scheduleId,
                })
                  .then(async (resposne) => {
                    const data = resposne.data;
                    const confirmPayment = await stripe.confirmCardPayment(data.clientSecret, {
                      payment_method: {
                        card: card,
                        billing_details: {
                          address: {
                            city: this.state.cityValue,
                            country: "us",
                            line1: values.address1,
                            line2: values.address2,
                            postal_code: values.zipCode,
                            state: this.state.stateValue,
                          },
                          email: email,
                          name: values.firstName,
                          phone: values.phone,
                        },
                      },
                    });

                    if (!confirmPayment.error) {
                      Api.post(
                        `api/v1/billing/paybill/${
                          (isStudent && parentId === "null") || (isStudent && parentId === null) ? "student" : "parent"
                        }`,
                        {
                          firstName: values.firstName,
                          lastName: values.lastName,
                          address1: values.address1,
                          address2: values.address2,
                          email: values.email,
                          city: this.state.cityValue,
                          state: this.state.stateValue,
                          zipCode: values.zipCode,
                          phone: values.phone,
                          parentId: this.state.parentId,
                          studentId: isParent ? this.state.studentId : userStudentId,
                          courseId: this.state.courseId,
                          courseScheduleId: this.state.scheduleId,
                          payment: this.state.payment,
                        }
                      ).then((res) => {
                        const status = res.status;
                        if (status === 201) {
                          resetForm({ values: "" });
                          this.setState({ student: "", isProcessing: false });
                        }
                      });
                      Api.post("api/v1/student/upcomingList", {
                        parentId: this.state.parentId,
                        studentId: isParent ? this.state.studentId : userStudentId,
                        courseId: this.state.courseId,
                        courseScheduleId: this.state.scheduleId,
                      });
                    } else {
                      this.setState({
                        show: false,
                        isSubmit: false,
                        view: true,
                        errorText: "Payment Failed",
                      });
                      // toast.error("Payment Failed");
                    }
                  })
                  .catch((error) => {
                    if (error.response && error.response.status >= 400) {
                      let errorMessage;
                      const errorRequest = error.response.request;
                      if (errorRequest && errorRequest.response) {
                        errorMessage = JSON.parse(errorRequest.response).message;
                      }
                      // toast.error(error.response.data.message);
                      this.setState({
                        isSubmit: false,
                        show: false,
                        view: true,
                        errorText: error.response.data.message,
                      });
                    }
                  });
              })
              .catch((error) => {
                if (error.response && error.response.status >= 400) {
                  let errorMessage;
                  const errorRequest = error.response.request;
                  if (errorRequest && errorRequest.response) {
                    errorMessage = JSON.parse(errorRequest.response).message;
                  }
                  // toast.error(error.response.data.message);
                  this.setState({
                    isSubmit: false,
                    show: false,
                    view: true,
                    errorText: error.response.data.message,
                  });
                }
                const errorStatus = error?.response?.status;
                if (errorStatus === 401) {
                  this.logout();
                  toast.error("Session Timeout");
                }
              });
      }
    }
  };

  // Handle Modal
  handleModal() {
    this.setState({ show: !this.state.show });
  }
  //handle popup
  handleFailed() {
    this.setState({ show: !this.state.view });
  }

  Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        this.setState({ stateCode: i });
      }
    }
  };

  //checkbox
  checkBox = () => {
    const isChecked = !this.state.checked;
    if (isChecked) {
      isParent ? this.getParentAddress() : this.getStudentAddress();
    } else {
      this.setState({
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        zipCode: "",
        stateCode: 0,
        cityValue: "",
        stateValue: "",
      });
    }
  };

  render() {
    // const courseName = this.props.match.params.name;
    const { role, userStudentId, courseId, payment, isLoading } = this.state;
    const isParent = role === ROLES_PARENT;

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Container className="mt-1">
            <div className="d-flex">
              <h4 className="mx-3 mb-0">Billing Information</h4>
              <div className="user-value">
                {/* Course Name */}
                <h6 className=" purchased-course mx-3 mb-0 fw-bold">{this.state.scheduleDetail?.courseId?.name}</h6>-
                {/* Category Name */}
                <h6 className="purchased-course mx-3 mb-0 fw-bold">
                  {this.state.scheduleDetail?.courseId?.category?.name}
                </h6>
                {/* Schedule Timings */}
                <h6 className=" purchased-course mb-0">{`${this.state.scheduleDetail?.startTime} ${this.state.scheduleDetail?.endTime}`}</h6>
                {/* <h6 className=" purchased-course mb-0">{`(${
                  this.state.scheduleDetail?.startTime + " - " + this.state.scheduleDetail?.endTime
                })`}</h6> */}
              </div>
            </div>
            <Row>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  address1: this.state.address1,
                  address2: this.state.address2,
                  email: this.state.email,
                  state: this.state.state,
                  city: this.state.city,
                  zipCode: this.state.zipCode,
                  phone: this.state.phone,
                  student: isParent ? this.state.student : userStudentId,
                }}
                validationSchema={SignInSchema}
                onSubmit={(values, { resetForm }) => this.submit(values, { resetForm })}
              >
                {(formik) => {
                  const { setFieldValue, handleSubmit, handleBlur, isValid } = formik;
                  return (
                    <div>
                      <Form onSubmit={handleSubmit}>
                        <Row className="px-3">
                          {isParent && (
                            <Col sm={6} md={6}>
                              <Form.Group className="form-row mt-3">
                                <Label notify={true}>Select Student</Label>
                                <Select
                                  value={this.state.student}
                                  styles={customStyles}
                                  placeholder="Select Student"
                                  name="student"
                                  onChange={(e) => {
                                    if (e.value === "Enroll Student") {
                                      this.props.props.history.push("/student/signup", {
                                        courseId: courseId,
                                      });
                                    } else {
                                      this.setState({
                                        student: e,
                                        studentId: e.value,
                                      });
                                    }
                                  }}
                                  options={[
                                    {
                                      value: "Enroll Student",
                                      label: "Enroll Student",
                                    },
                                    {
                                      options: this.state.studentList.map((list) => ({
                                        value: list.id,
                                        label: `${list.firstName} ${list.lastName}`,
                                      })),
                                    },
                                  ]}
                                />
                                <ErrorMessage
                                  name="student"
                                  component="span"
                                  className="error text-danger error-message m-0"
                                />
                              </Form.Group>
                            </Col>
                          )}
                          <Col
                            xs={12}
                            sm={6}
                            md={6}
                            className="checkbox-content d-flex justify-content-start align-items-center"
                          >
                            <Form.Group className="form-row mt-4">
                              <Form.Check
                                className="checkbox-style"
                                type="checkbox"
                                label="Billing Information Same As Registration Information"
                                checked={this.state.checked}
                                onChange={() => {
                                  this.setState({
                                    checked: !this.state.checked,
                                  });
                                  this.checkBox();
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="px-3 pt-2">
                          <Col sm={6} md={6}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>First Name</Label>
                              <FormControl
                                type="type"
                                name="firstName"
                                placeholder="First Name as displayed in Credit card"
                                id="firstName"
                                value={this.state.firstName}
                                onChange={(e) => this.setState({ firstName: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage
                                name="firstName"
                                component="span"
                                className="error text-danger error-message m-0 "
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={6}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>Last Name</Label>
                              <FormControl
                                type="type"
                                name="lastName"
                                placeholder="Last Name as displayed in Credit card"
                                id="lastName"
                                value={this.state.lastName}
                                onChange={(e) => this.setState({ lastName: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage
                                name="lastName"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="px-3 pt-2">
                          <Col sm={6} md={6}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>Address Line 1</Label>
                              <FormControl
                                type="type"
                                name="address1"
                                placeholder="Address Line 1"
                                id="address1"
                                value={this.state.address1}
                                onChange={(e) => this.setState({ address1: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage
                                name="address1"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={6}>
                            <Form.Group className="form-row" style={{ width: "100%" }}>
                              <Label>Address Line 2</Label>
                              <FormControl
                                type="type"
                                name="address2"
                                placeholder="Address Line 2"
                                id="address2"
                                value={this.state.address2}
                                onChange={(e) => this.setState({ address2: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage
                                name="address2"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="px-3 pt-2">
                          <Col sm={6} md={6}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>Email</Label>
                              <FormControl
                                type="type"
                                name="email"
                                placeholder="Email"
                                id="email"
                                style={{ textTransform: "lowercase" }}
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage
                                name="email"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={6} md={6}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>Phone Number</Label>
                              <br />
                              <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                                <FormControl
                                  type="phoneNumber"
                                  name="phone"
                                  placeholder="Phone Number"
                                  id="phone"
                                  value={this.state.phone}
                                  onChange={(e) => this.setState({ phone: e.target.value })}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name="phone"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="px-3 pt-2">
                          <Col sm={4} md={4}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>States</Label>

                              <Select
                                value={this.state.state}
                                styles={customStyles}
                                name="state"
                                placeholder="State"
                                onChange={(e) => {
                                  this.Index(e);
                                  setFieldValue("state", e);
                                  this.setState({
                                    state: e,
                                    stateValue: e.value,
                                    cityValue: "",
                                    city: "",
                                  });
                                }}
                                options={states.map((item) => ({
                                  label: item.state,
                                  value: item.state,
                                }))}
                              />
                              <ErrorMessage
                                name="state"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                          <Col sm={4} md={4}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>City</Label>
                              <br />
                              <Select
                                placeholder="City"
                                styles={customStyles}
                                value={this.state.city}
                                name="city"
                                onChange={(e) => {
                                  setFieldValue("city", e);
                                  this.setState({
                                    cityValue: e.value,
                                    city: e,
                                  });
                                }}
                                options={states[this.state.stateCode]?.cities?.map((item, key) => ({
                                  label: item,
                                  value: item,
                                }))}
                              />
                              <ErrorMessage
                                name="city"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>

                          <Col sm={4} md={4}>
                            <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                              <Label notify={true}>Zip Code</Label>
                              <FormControl
                                type="type"
                                name="zipCode"
                                maxLength="5"
                                placeholder="Zip Code"
                                id="zipCode"
                                value={this.state.zipCode}
                                onChange={(e) => this.setState({ zipCode: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage
                                name="zipCode"
                                component="span"
                                className="error text-danger error-message m-0"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <CardSection />
                        </Row>
                        <div className="d-flex justify-content-end mt-4 px-3 mb-4">
                          <Button
                            disabled={!isValid || this.state.isSubmit}
                            className={`${!isValid || this.state.isSubmit ? "checkout-disable" : "checkout-active"}`}
                            variant="primary"
                            type="submit"
                          >
                            Pay Now ${payment}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </Row>
            <div>
              <Modal
                show={this.state.show}
                backdrop="static"
                keyboard={false}
                centered
                onHide={() => this.handleModal()}
              >
                <Modal.Body>
                  <Row>
                    {this.state.isProcessing ? (
                      <div className="processing-content">
                        <Spinner animation="grow" variant="secondary" />
                        <h4 style={{ paddingLeft: 20 }}>Processing...</h4>
                      </div>
                    ) : (
                      <div>
                        <div className="success-content">
                          <p className="payment-success-style">Payment Success!</p>
                        </div>
                        <div className="ok-button-container">
                          <Button
                            className="ok-button-style"
                            variant="contained"
                            color="primary"
                            onClick={() => this.props.props.history.push("/dashboard")}
                          >
                            Go To Dashboard
                          </Button>
                        </div>
                      </div>
                    )}
                  </Row>
                </Modal.Body>
              </Modal>
            </div>
            <div>
              <Modal
                show={this.state.view}
                backdrop="static"
                keyboard={false}
                centered
                onHide={() => this.handleFailed()}
              >
                <Modal.Body>
                  <Row>
                    <div className="payment-details">
                      <FaExclamationCircle size={40} />
                    </div>
                    <h5 className="text-center">{this.state.errorText}</h5>
                  </Row>
                </Modal.Body>
                <div className="ok-button-container">
                  <Button
                    className="ok-button-style"
                    variant="contained"
                    color="primary"
                    onClick={() => this.setState({ view: false })}
                  >
                    Retry
                  </Button>
                </div>
              </Modal>
            </div>
          </Container>
        )}
      </div>
    );
  }
}
export default function InjectedCheckoutForm(props) {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => <CourseCheckoutScreen stripe={stripe} elements={elements} props={props.props} />}
    </ElementsConsumer>
  );
}
