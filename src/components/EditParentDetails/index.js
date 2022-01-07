import React, { Component } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Form, FormControl, Dropdown, InputGroup } from "react-bootstrap";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";

// Api
import Api from "../../Api";

import "../../css/ParentSignup.scss";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Component
import Label from "../../components/core/Label";
import Loader from "../../components/core/Loader";
import states from "../../components/core/States";

// Validations
const SignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("First Name Is Required"),

  middleName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .nullable(),

  lastName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("Last Name Is Required"),

  phoneNumber: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .required("Phone Number Is Required"),

  zipCode: Yup.string()
    .nullable()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be 5 Digits"),

  email: Yup.string().email("Enter Valid Email").required("Email Is Required"),

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

class EditStudentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      parentId: "",
      isLoading: true,
      city: "",
      cityValue: "",
      state: "",
      stateValue: "",
      stateCode: 0,
      firstName: "",
      middleName: "",
      lastName: "",
      address1: "",
      address2: "",
      phone: "",
      email: "",
      zipCode: "",
      fileUploadState: "",
      imagePreview: "",
      password: "",
      confirmPassword: "",
      passwordShown: false,
      confirmPasswordShown: false,
      isSubmit: false,
    };
    this.inputReference = React.createRef();
  }

  togglePasswordVisibility = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  };

  tooglePasswordVisibility = () => {
    this.setState({ confirmPasswordShown: !this.state.confirmPasswordShown });
  };

  fileUploadAction = () => this.inputReference.current.click();

  fileUploadInputChange = async (e) => {
    const file = e.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await this.convertBase64(file);
    this.setState({ imagePreview: base64, imageType: type });
    if (type === "image") {
      Api.post("api/v1/parent/profile/upload", {
        parentId: this.state.parentId,
        image: this.state.imagePreview,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            toast.success("Profile Upload Successfully!...");
            this.parentDetails();
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
    } else {
      toast.error("Image Only Accept");
    }
  };

  // Delete Image
  removeImage = () => {
    Api.delete("api/v1/parent/remove/profile", {
      params: {
        parentId: this.state.parentId,
      },
    }).then((response) => {
      this.parentDetails();
    });
    this.setState({ imagePreview: "" });
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

  // Parent details get
  parentDetails = () => {
    let userId = localStorage.getItem("userId");
    Api.get(`api/v1/user/${userId}`).then((res) => {
      const data = res.data.data.getOne;
      this.setState({ parentId: data.parentId });
      Api.get(`api/v1/parent/${this.state.parentId}`).then((res) => {
        const data = res.data.data.getOne;
        this.setState({
          details: data,
          isLoading: false,
          firstName: data?.firstName,
          middleName: data?.middleName,
          lastName: data?.lastName,
          address1: data?.address1,
          address2: data?.address2,
          phone: data?.phone,
          imagePreview: data?.imageUrl,
          email: data?.email,
          alternativeEmail: data?.alternateEmail,
          zipCode: data?.zipCode,
          city: data?.city ? { value: data?.city, label: data?.city } : "",
          cityValue: data?.city,
          state: data?.state ? { value: data?.state, label: data?.state } : "",
          stateValue: data?.state,
          password: data?.password,
          confirmPassword: data?.confirmPassword,
        });
      });
    });
  };

  componentDidMount() {
    this.parentDetails();
  }

  // Submit Details
  submitForm = (values) => {
    this.setState({ isSubmit: true });
    const email = this.state.email.toLowerCase();
    Api.patch(`api/v1/parent/${this.state.parentId}`, {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      middleName: this.state.middleName,
      phone: this.state.phone,
      email: email,
      address1: this.state.address1,
      address2: this.state.address2,
      city: this.state.cityValue,
      state: this.state.stateValue,
      zipCode: this.state.zipCode,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          this.setState({ isSubmit: false });
          toast.success("Updated");
          this.parentDetails();
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

  Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        this.setState({ stateCode: i });
      }
    }
  };

  validate = () => {
    let errors = {};
    if (!this.state.stateValue) {
      errors.state = "State Is Required";
    }
    if (!this.state.cityValue) {
      errors.city = "City Is Required";
    }
    return errors;
  };

  render() {
    const { isLoading } = this.state;
    return (
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <Container className="mt-5 pt-1">
            <Row className="mt-4 py-3">
              <Formik
                enableReinitialize={true}
                initialValues={{
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  middleName: this.state.middleName,
                  phoneNumber: this.state.phone,
                  email: this.state.email,
                  address1: this.state.address1,
                  address2: this.state.address2,
                  state: this.state.state,
                  city: this.state.city,
                  zipCode: this.state.zipCode,
                  password: this.state.password,
                  confirmPassword: this.state.confirmPassword,
                }}
                validationSchema={SignInSchema}
                validate={this.validate}
                onSubmit={(values) => this.submitForm(values)}
              >
                {(formik) => {
                  const { values, handleChange, handleSubmit, setFieldValue, handleBlur, isValid } = formik;
                  return (
                    <div>
                      <Form onSubmit={() => handleSubmit}>
                        <Row>
                          <Col sm={4} xs={12} className="px-4">
                            <Dropdown className="dropdown-profile-list">
                              <Dropdown.Toggle className="teacher-menu-dropdown p-0" varient="link">
                                <div>
                                  <div>
                                    {this.state.imagePreview ? (
                                      <Avatar
                                        src={this.state.imagePreview}
                                        size="150"
                                        round={true}
                                        color="silver"
                                        className="image-size"
                                      />
                                    ) : (
                                      <Avatar
                                        name={`${this.state.firstName} ${this.state.lastName}`}
                                        size="150"
                                        round={true}
                                        color="silver"
                                      />
                                    )}
                                  </div>
                                  <div className="d-flex justify-content-center mt-3">
                                    <p style={{ fontSize: 11, color: "black" }}>Click Here To Upload Profile</p>
                                    <FontAwesomeIcon icon={faPen} size="sm" color="#1d1464" className="mx-1" />
                                  </div>
                                </div>
                              </Dropdown.Toggle>
                              <Dropdown.Menu center className="profile-dropdown-status py-0">
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to="#"
                                    className="change-profile-text-style"
                                    onClick={() => this.fileUploadAction()}
                                  >
                                    Change Profile
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to="#"
                                    className="change-profile-text-style"
                                    onClick={() => {
                                      this.removeImage();
                                    }}
                                  >
                                    Remove Profile
                                  </Link>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                            <input
                              type="file"
                              name="courseImage"
                              accept="image/*"
                              className="fileToUpload"
                              ref={this.inputReference}
                              id="fileToUpload"
                              style={{ display: "none" }}
                              onChange={(e) => this.fileUploadInputChange(e)}
                            />
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>First Name</Label>
                              <br />
                              <FormControl
                                type="type"
                                name="firstName"
                                placeholder="First Name"
                                id="firstName"
                                value={this.state.firstName}
                                onChange={(e) => this.setState({ firstName: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="firstName" component="span" className="error text-danger" />
                            </Form.Group>
                            <Form.Group className="form-row mb-3">
                              <Label>Middle Name</Label>
                              <br />
                              <FormControl
                                type="type"
                                name="middleName"
                                placeholder="Middle Name"
                                id="middleName"
                                value={this.state.middleName}
                                onChange={(e) => this.setState({ middleName: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="middleName" component="span" className="error text-danger" />
                            </Form.Group>
                            <Form.Group className="form-row mb-3">
                              <Label notify={true}>Last Name</Label>
                              <br />
                              <FormControl
                                type="type"
                                placeholder="Last Name"
                                name="lastName"
                                id="lastName"
                                value={this.state.lastName}
                                onChange={(e) => this.setState({ lastName: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="lastName" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={8} className="px-4 pt-5">
                            <div className="row d-flex justify-content-center">
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Email</Label>
                                  <FormControl
                                    type="email"
                                    placeholder="Email Address"
                                    name="email"
                                    id="email"
                                    style={{ textTransform: "lowercase" }}
                                    value={this.state.email}
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="email" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label>Phone Number</Label>
                                  <br />
                                  <FormControl
                                    type="phoneNumber"
                                    placeholder="PhoneNumber"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    value={this.state.phone}
                                    onChange={(e) => this.setState({ phone: e.target.value })}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="phoneNumber" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                            </div>
                            <div className="row d-flex justify-content-center">
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label>Address Line 1</Label>
                                  <br />
                                  <FormControl
                                    type="type"
                                    name="address1"
                                    placeholder="Address 1"
                                    id="address1"
                                    value={this.state.address1}
                                    onChange={(e) =>
                                      this.setState({
                                        address1: e.target.value,
                                      })
                                    }
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="address1" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label>Address Line 2</Label>
                                  <br />
                                  <FormControl
                                    type="text"
                                    name="address2"
                                    placeholder="Address2"
                                    id="address2"
                                    value={this.state.address2}
                                    onChange={(e) =>
                                      this.setState({
                                        address2: e.target.value,
                                      })
                                    }
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="address2" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                            </div>
                            <div className=" row d-flex justify-content-center">
                              <Col sm={4} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label>State</Label>
                                  <br />
                                  <Select
                                    value={this.state.state}
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
                                    options={[
                                      {
                                        options: states.map((item) => ({
                                          label: item.state,
                                          value: item.state,
                                        })),
                                      },
                                    ]}
                                  />
                                </Form.Group>
                              </Col>
                              <Col sm={4} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label>City</Label>
                                  <Select
                                    placeholder="City"
                                    value={this.state.city}
                                    onChange={(e) => {
                                      setFieldValue("city", e);
                                      this.setState({
                                        city: e,
                                        cityValue: e.value,
                                      });
                                    }}
                                    options={[
                                      {
                                        options: states[this.state.stateCode].cities.map((item, key) => ({
                                          label: item,
                                          value: item,
                                        })),
                                      },
                                    ]}
                                  />
                                </Form.Group>
                              </Col>
                              <Col sm={4} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label>Zip Code</Label>
                                  <br />
                                  <FormControl
                                    type="text"
                                    name="zipCode"
                                    placeholder="Zip Code"
                                    id="zipCode"
                                    value={this.state.zipCode}
                                    maxLength="5"
                                    onChange={(e) => this.setState({ zipCode: e.target.value })}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="zipCode" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                            </div>
                            <div className="row d-flex justify-content-center">
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                                  <Label notify={true}>Password</Label>
                                  <InputGroup className="input-group ">
                                    <FormControl
                                      type={this.state.passwordShown ? "text" : "password"}
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
                                        icon={this.state.passwordShown ? faEye : faEyeSlash}
                                        onClick={() => this.togglePasswordVisibility()}
                                        size="1x"
                                      />
                                    </InputGroup.Text>
                                  </InputGroup>
                                  <ErrorMessage name="password" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row" style={{ marginRight: 20, width: "100%" }}>
                                  <Label notify={true}>Confirm Password</Label>
                                  <InputGroup className="input-group ">
                                    <FormControl
                                      type={this.state.confirmPasswordShown ? "text" : "password"}
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
                                        icon={this.state.confirmPasswordShown ? faEye : faEyeSlash}
                                        onClick={() => this.tooglePasswordVisibility()}
                                        size="1x"
                                      />
                                    </InputGroup.Text>
                                  </InputGroup>
                                  <ErrorMessage name="confirmPassword" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                            </div>
                            <div className="d-flex justify-content-end my-3 pt-4">
                              <Button
                                className="save-changes-active"
                                variant="contained"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={!isValid || this.state.isSubmit}
                              >
                                SAVE CHANGES
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  );
                }}
              </Formik>
            </Row>
          </Container>
        )}
      </Container>
    );
  }
}
export default EditStudentDetails;
