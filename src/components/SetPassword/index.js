import axios from "axios";
import React from "react";
import { Col, Container, Row, Form, Button, FormControl } from "react-bootstrap";

import { useHistory } from "react-router-dom";

import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Label from "../../components/core/Label";

const SetPassword = () => {
  const history = useHistory();

  const submitForm = (values) => {
    axios
      .post("api/parent/loginEmail", {
        Password: values.Password,
        ConfirmPassword: values.ConfirmPassword,
      })
      .then((response) => {
        if (response.data.status) {
          history.push("/dashboard");
        } else {
          console.log("password and confirm password must be match");
        }
      });
  };

  const loginSchema = Yup.object().shape({
    Password: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
        "Password Should Be Mix Of Letters, Numbers, Special Character (!@#$%^&)"
      )
      .min(8, "Password Required Minimum 8 Characters")
      .required("Password Is Required"),

    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref("Password"), null], "Passwords Must Match")
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
        "Password Should Be Mix Of Letters, Numbers, Special Character (!@#$%^&)"
      )
      .required("Confirm Password Is Required"),
  });

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={5} md={6} sm={12} className=" p-5 m-auto shadow -sm rounded-lg">
          <Formik
            initialValues={{
              Password: "",
              ConfirmPassword: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => submitForm(values)}
          >
            {(formik) => {
              const { values, handleChange, handleSubmit, handleBlur } = formik;
              return (
                <div>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <h3 className="d-flex justify-content-center mb-3">Set Password</h3>

                      <Col md="12">
                        <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>Password</Label>
                          <FormControl
                            type="Password"
                            name="Password"
                            id="Password"
                            value={values.Password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="Enter Password"
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                          <ErrorMessage name="Password" component="span" className="error text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                          <Label notify={true}>Confirm Password</Label>
                          <FormControl
                            type="Password"
                            name="ConfirmPassword"
                            id="ConfirmPassword"
                            value={values.ConfirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="Enter ConfirmPassword"
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                          <ErrorMessage name="ConfirmPassword" component="span" className="error text-danger" />
                        </Form.Group>
                      </Col>

                      <div className="d-flex justify-content-center mt-3">
                        <Button className="create-active" type="submit">
                          Submit
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

export default SetPassword;
