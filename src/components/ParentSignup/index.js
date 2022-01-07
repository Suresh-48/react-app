import React, { useState } from "react";
import Api from "../../Api";
import { Col, Container, Row, Form, Button, FormControl, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

// Styles
import "../../css/ParentSignup.scss";

// Component
import Label from "../../components/core/Label";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ParentSignup = (props) => {
  const history = useHistory();
  const [courseId, setcourseId] = useState(props?.location?.state?.courseId);
  const [isSubmit, setisSubmit] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const togglePasswordVisibility = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const submitForm = (values) => {
    setisSubmit(true);
    if (values.password === values.confirmPassword) {
      const email = values.email.toLowerCase();
      Api.post("api/v1/parent/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
        .then((response) => {
          setisSubmit(false);
          const status = response.status;
          if (status === 201) {
            const role = response.data.parentLogin.role;
            const userId = response.data.parentLogin.id;
            const parentId = response.data.parentLogin.parentId;
            const token = response.data.parentLogin.token;
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("parentId", parentId);
            localStorage.setItem("sessionId", token);
            if (courseId) {
              history.goBack();
            } else {
              history.push("/dashboard");
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

  // Validation
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
    password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
        "Password Should Be Mix Of Letters, Numbers, Special Character (!@#$%^&)"
      )
      .min(8, "Password Required Minimum 8 Characters")
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
              confirmPassword: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => submitForm(values)}
          >
            {(formik) => {
              const { values, handleChange, handleSubmit, handleBlur, isValid } = formik;
              return (
                <div>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <h3 className="d-flex justify-content-center mb-4">Parent Registration</h3>
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
                                onClick={togglePasswordVisiblity}
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
                                onClick={togglePasswordVisibility}
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
                          disabled={!isValid || isSubmit}
                          type="submit"
                        >
                          CREATE ACCOUNT
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
    </Container>
  );
};

export default ParentSignup;
