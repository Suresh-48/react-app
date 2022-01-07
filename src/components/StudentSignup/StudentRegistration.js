import React, { useEffect, useState } from "react";
import Api from "../../Api";
import { Col, Container, Row, Form, Button, FormControl, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { faUserFriends, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Select from "react-select";
import moment from "moment";

//Styles
import "../../css/StudentRegistration.scss";

// Component
import Label from "../../components/core/Label";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const options = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const StudentRegistration = (props) => {
  const [parentId, setparentId] = useState("");
  const [courseId, setcourseId] = useState(props?.props?.location?.state?.courseId);
  const [isSubmit, setisSubmit] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [gender, setgender] = useState("");
  const [dob, setdob] = useState("");

  // Date Format
  const setDateFormat = (e) => {
    let dateValue = moment(e).format("LLLL");
    let dateOfBirth = new Date(dateValue);
    let month = Date.now() - dateOfBirth.getTime();
    let getAge = new Date(month);
    let year = getAge.getUTCFullYear();
    let age = Math.abs(year - 1970);

    if (age <= 17) {
      setdob(dateValue);
    } else {
      toast.warning("Your Age Must Be Under 17");
      setdob(null);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const tooglePasswordVisibility = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const history = useHistory();

  useEffect(() => {
    let parentId = localStorage.getItem("parentId");
    setparentId(parentId);
  }, []);

  //Submit Form
  const submitForm = (values) => {
    const email = values.email.toLowerCase();
    const startDate = dob;
    const dateValue = moment(startDate).format("ll");
    setisSubmit(true);
    if (values.password === values.confirmPassword) {
      Api.post("api/v1/student/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        parentId: parentId,
        dob: dateValue,
        gender: gender,
      })
        .then((response) => {
          setisSubmit(false);
          const status = response.status;
          if (status === 201) {
            if (parentId) {
              if (courseId) {
                history.goBack();
              } else {
                history.push("/dashboard");
              }
            } else {
              const role = response.data.studentLogin.role;
              const userId = response.data.studentLogin.id;
              const studentId = response.data.studentLogin.studentId;
              const token = response.data.studentLogin.token;
              localStorage.setItem("role", role);
              localStorage.setItem("userId", userId);
              localStorage.setItem("studentId", studentId);
              localStorage.setItem("sessionId", token);
              if (courseId) {
                history.goBack();
              } else {
                history.push("/dashboard");
              }
            }
          } else {
            toast.error(response.data.message);
            setisSubmit(false);
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
            setisSubmit(false);
          }
          setisSubmit(false);
        });
    }
  };

  //Validations
  const loginSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
      .matches(/^[A-Z]/, "First Letter Must Be In Capital")
      .required("First Name Is Required"),
    lastName: Yup.string()
      .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
      .matches(/^[A-Z]/, "First Letter Must Be In Capital")
      .required("Last Name Is Required"),
    email: Yup.string().email("Enter Valid Email").required("Email Is Required"),

    dob: Yup.string().required("Date Of Birth Is Required"),

    gender: Yup.object().required("Gender Is Required"),

    password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
        "Password Should Be Mix Of Letters, Numbers, Special Character (!@#$%^&)"
      )
      .min(8, "Password Required Minimum 8 characters")
      .required("Password Is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
        "Password Should Be Mix Of Letters, Numbers, Special Character (!@#$%^&)"
      )
      .required("Confirm Password Is Required"),
  });

  return (
    <Container>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Row className="mt-5">
          <Col lg={6} md={6} sm={12} className="p-5 m-auto shadow -sm rounded-lg">
            <div className="d-flex justify-content-center align-items-center mb-4 ">
              <FontAwesomeIcon icon={faUserFriends} size="3x" color="#1d1464" />
            </div>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                dob: "",
                gender: "",
                confirmPassword: "",
              }}
              validationSchema={loginSchema}
              onSubmit={(values) => submitForm(values)}
            >
              {(formik) => {
                const { values, handleChange, handleSubmit, setFieldValue, handleBlur, isValid } = formik;
                return (
                  <div>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <h3 className="d-flex justify-content-center mb-4">Student Registration</h3>
                        <Col md="12">
                          <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                            <Label notify={true}>First Name</Label>
                            <FormControl
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={values.firstName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                              placeholder="First Name"
                            />
                            <ErrorMessage name="firstName" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                        <Col md="12" className="mb-3">
                          <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                            <Label notify={true}>Last Name</Label>
                            <FormControl
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={values.lastName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                              placeholder="Last Name"
                            />
                            <ErrorMessage name="lastName" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                        <Col md="12" className="mb-3">
                          <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                            <Label notify={true}>Email</Label>
                            <FormControl
                              type="email"
                              name="email"
                              id="email"
                              style={{ textTransform: "lowercase" }}
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                              placeholder="Email Address"
                            />
                            <ErrorMessage name="email" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                        <Row className="pe-0">
                          <Col sm={12} md={12} xs={12} lg={6} className="pe-0">
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Date Of Birth</Label>
                              <br />
                              <KeyboardDatePicker
                                variant="standard"
                                className="start-time-style"
                                style={{ paddingLeft: 10 }}
                                placeholder="Select Start Date"
                                helperText={""}
                                InputProps={{
                                  disableUnderline: true,
                                }}
                                format="MMM dd yyyy"
                                value={dob}
                                onChange={(e) => {
                                  setFieldValue("dob", e);
                                  setDateFormat(e);
                                }}
                                keyboardIcon={
                                  <FontAwesomeIcon icon={faCalendarDay} size="sm" color="grey" style={{ padding: 0 }} />
                                }
                              />
                              <ErrorMessage name="dob" component="span" className="error text-danger error-message" />
                            </Form.Group>
                          </Col>
                          <Col sm={12} md={12} xs={12} lg={6} className="pe-0">
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Gender</Label>
                              <br />
                              <Select
                                id="gender"
                                name="gender"
                                value={values.gender}
                                placeholder="Select Gender"
                                onChange={(e) => {
                                  setFieldValue("gender", e);
                                  setgender(e.value);
                                }}
                                options={options}
                              />
                              <ErrorMessage name="gender" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Col md="12" className="mb-3">
                          <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                            <Label notify={true}>Password</Label>
                            <InputGroup className="input-group ">
                              <FormControl
                                type={passwordShown ? "text" : "password"}
                                name="password"
                                id="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="form-width"
                                placeholder="Password"
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                              />
                              <InputGroup.Text>
                                <FontAwesomeIcon
                                  icon={passwordShown ? faEye : faEyeSlash}
                                  onClick={togglePasswordVisibility}
                                  size="1x"
                                />
                              </InputGroup.Text>
                            </InputGroup>
                            <ErrorMessage name="password" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                        <Col md="12" className="mb-3">
                          <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                            <Label notify={true}>Confirm Password</Label>
                            <InputGroup className="input-group ">
                              <FormControl
                                type={confirmPasswordShown ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onBlur={handleBlur}
                                className="form-width"
                                placeholder="Confirm Password"
                              />
                              <InputGroup.Text>
                                <FontAwesomeIcon
                                  icon={confirmPasswordShown ? faEye : faEyeSlash}
                                  onClick={tooglePasswordVisibility}
                                  size="1x"
                                />
                              </InputGroup.Text>
                            </InputGroup>
                            <ErrorMessage name="confirmPassword" component="span" className="error text-danger" />
                          </Form.Group>
                        </Col>
                        <div className="d-flex justify-content-center mt-3">
                          <Button
                            className={`${!isValid || isSubmit ? "create-account-disable" : "create-account-active"}`}
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={!isValid || isSubmit}
                          >
                            Create Account
                          </Button>
                        </div>
                      </Row>
                    </Form>
                  </div>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </MuiPickersUtilsProvider>
    </Container>
  );
};
export default StudentRegistration;
