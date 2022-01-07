import axios from "axios";
import React from "react";
import { Col, Container, Row, Form, FormControl, Button } from "react-bootstrap";

import { useHistory } from "react-router-dom";

import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Label from "../../components/core/Label";

const ResetPassword = () => {
  const history = useHistory();

  const submitForm = (values) => {
    const email = values.email.toLowerCase();
    axios
      .post("https://a779-61-3-229-69.ngrok.io/api/v1/parent/resetpassword", {
        email: email,
        NewPassword: values.NewPassword,
      })
      .then((response) => {
        if (response.data.email !== response.data.NewPassword) {
          history.push("/dashboard");
        } else {
          console.log("existing and newpassword not be same");
        }
      });
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Enter Valid Email").required("Email Is Required"),
    NewPassword: Yup.string()
      .matches(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
        "Password Should Be Mix Of Letters, Numbers, Special Character (!@#$%^&)"
      )
      .min(8, "Password Required Minimum 8 Characters")
      .required("Password Is Required"),
  });

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={5} md={6} sm={12} className=" p-5 m-auto shadow -sm rounded-lg">
          <Formik
            initialValues={{
              email: "",
              NewPassword: "",
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
                      <h3 className="d-flex justify-content-center mb-3">Forgot Password</h3>

                      <Col md="12">
                        <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
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
                          <Label notify={true}>New Password</Label>
                          <FormControl
                            type="password"
                            name="NewPassword"
                            id="NewPassword"
                            value={values.NewPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-width"
                            placeholder="New Password "
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                          <ErrorMessage name="NewPassword" component="span" className="error text-danger" />
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

export default ResetPassword;
