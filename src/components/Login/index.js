import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, InputGroup } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import { useHistory, Link } from "react-router-dom";
import Label from "../../components/core/Label";
import { toast } from "react-toastify";

// SCSS
import "../../css/Login.scss";

// API Call
import Api from "../../Api";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [alertShown, setalertShown] = useState("false");
  const [passwordShown, setPasswordShown] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      history.push("/dashboard");
    }
  },[]);

  const tooglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  // Sub
  const submit = (values, { resetForm }) => {
    const email = values.email.toLowerCase();
    Api.post("api/v1/user/login", {
      email:email,
      password: values.password,
    })
      .then((response) => {
        const status = response.data.status;
        if (status === "Created") {
          const token = response.data.user.token;
          const parentId = response.data.user.parentId;
          const studentId = response.data.user.studentId;
          const teacherId = response.data.user.teacherId;
          const role = response.data.user.role;
          const userId = response.data.user.id;
          const userName = response.data.user.email;

          localStorage.setItem("sessionId", token);
          localStorage.setItem("parentId", parentId);
          localStorage.setItem("studentId", studentId);
          localStorage.setItem("teacherId", teacherId);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userName", userName);
          resetForm({ values: "" });
          window.location.reload();
          history.push("/dashboard");
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

  // Validation
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter Valid Email")
      .required("Email Is Required"),
    password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
        "Password Should Be Mix Of Letters, Numbers, Special Character (!@#$%^&)"
      )
      .min(8, "Password Required Minimum 8 Characters")
      .required("Password Is Required"),
  });

  return (
    <Container>
      <Row className="mt-5 ">
        <Col
          lg={5}
          md={6}
          sm={12}
          className=" p-5 m-auto shadow -sm rounded-lg"
        >
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values, { resetForm }) => submit(values, { resetForm })}
          >
            {(formik) => {
              const {
                values,
                handleChange,
                handleSubmit,
                handleBlur,
               } = formik;
              return (
                <div>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <h3 className="d-flex justify-content-center mb-3">
                        Login
                      </h3>
                      <Col md="12">
                        <Form.Group
                          className="form-row mb-3"
                          style={{ marginRight: 20, width: "100%" }}
                        >
                          <Label notify={true}>Email </Label>
                          <Form.Control
                            type="type"
                            name="email"
                            id="email"
                            style={{ textTransform: "lowercase" }}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="Email Address"
                          />
                          <ErrorMessage
                            name="email"
                            component="span"
                            className="error text-danger error-message"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group
                          className="form-row"
                          style={{ marginRight: 20, width: "100%" }}
                        >
                          <Label notify={true}>Password</Label>
                          <InputGroup className="input-group ">
                            <Form.Control
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
                                onClick={tooglePasswordVisibility}
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
                      <div className="d-flex justify-content-center mt-3">
                        <Button
                          className="login-button"
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Login
                        </Button>
                      </div>
                      <div className="d-flex justify-content-center mt-3">
                        <Link
                          className="link-decoration"
                          to={{
                            pathname: "/forgot/password",
                          }}
                        >
                          Forgot Password
                        </Link>
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

export default Login;
