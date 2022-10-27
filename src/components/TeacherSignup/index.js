import React, { Component } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { InputGroup, Form, FormControl, Container, Col, Row, Card } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";

// Styles
import "../../css/ParentSignup.scss";

// Api
import Api from "../../Api";

// Component
import Label from "../../components/core/Label";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { customStyles } from "../core/Selector";

// Validations
const SignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .required("First Name Is Required"),

  middleName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .nullable(),

  lastName: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .matches(/^[A-Z]/, "First Letter Must Be In Capital")
    .required("Last Name Is Required"),

  // city: Yup.string().required("City is Required"),

  // state: Yup.string().required("state is Required"),

  // zipCode: Yup.string()
  //   .required("Zipcode is Required")
  //   .matches(/^[0-9]+$/, "Must be only digits")
  //   .min(5, "Must be exactly 5 digits")
  //   .max(5, "Must be exactly 5 digits"),
  // alternativeEmail: Yup.string()
  //     .email("Enter Valid Email")
  //   .nullable(),

  // address1: Yup.string().required("Address Line1 is Required"),

  // address2: Yup.string().required("Address Line2 is Required"),

  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .max(10, "Enter valid number")
    .min(10, "Enter valid number")
    .required("Phone Number Is Required"),

  email: Yup.string()
    .email("Enter Valid Email")
    .required("Email Is Required"),

  speciality: Yup.string().required("Speciality Is Required"),

  descriptionValue: Yup.string().required("Speciality Description Is Required"),

  // hearAboutUs:Yup.string().required("Required Field"),
  userName: Yup.string().required("User Name Is Required"),
  password: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
      "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .min(8, "Password Required Minimum 8 Characters")
    .required("Password Is Required"),

  confirmPassword: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
      "Confirm Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .oneOf([Yup.ref("password"), null], "Password Did Not Match")
    .required("Confirm Password Is Required"),
  captcha: Yup.string()
    .required("Captcha Is Required")
    .min(6, "Captcha required minimum 6 characters ")
    .max(6, "Captcha maximum 6 characters"),
});

const CLIENT_ID = "901411976146-5r87ft9nah8tqdp3stg7uod39i1h66ft.apps.googleusercontent.com";
class TeacherSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      parentId: "",
      isSubmit: false,
      hearAboutUs: "",
      type: "text",
      confirmPasswordShown: false,
      passwordShown: false,
      specialityDescription: EditorState.createEmpty(),
      userName: "",
      errorMessage: "",
      categoryList: [],
      skills: "",
      captcha: "",
    };
  }

  togglePasswordVisibility = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  };

  toggleConfirmPasswordVisibility = () => {
    this.setState({ confirmPasswordShown: !this.state.confirmPasswordShown });
  };

  onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };
  getRandomCaptcha = () => {
    let randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    this.setState({ captcha: result });
  };

  // Submit form
  submitForm = (values, { resetForm }) => {
    const user_captcha = values.captcha;
    const email = values.email.toLowerCase();
    // const alternativeEmail = values.alternativeEmail.toLowerCase();
    const convertedData = JSON.stringify(convertToRaw(this.state.specialityDescription.getCurrentContent()));
    const skillsData = JSON.stringify(values.skills);
    //const category = JSON.stringify(values.skills);
    if (values.password === values.confirmPassword && this.state.captcha === user_captcha) {
      this.getRandomCaptcha();
      this.setState({ isSubmit: true });

      Api.post("api/v1/teacher/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        phone: values.phone,
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        // address1: values.address1,
        // address2: values.address2,
        // city: values.city,
        // state: values.state,
        // zipCode: values.zipCode,
        // alternativeEmail:alternativeEmail,
        hearAboutUs: this.state.hearAboutUs,
        speciality: values.speciality,
        userName: this.state.userName,
        specialityDescription: convertedData,
        skills: skillsData,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            this.setState({ isSubmit: false });
            resetForm({ values: "" });
            const role = response.data.teacherLogin.role;
            const userId = response.data.teacherLogin.id;
            const teacherId = response.data.teacherLogin.teacherId;
            const token = response.data.teacherLogin.token;
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("teacherId", teacherId);
            localStorage.setItem("sessionId", token);
            this.props.history.push({ pathname: "/teacher/application/form", state: { sidebar: true } });
            // window.location.reload();
          } else {
            this.setState({ isSubmit: false });
            toast.error("Teacher Already Exist ");
          }
        })
        .catch((error) => {
          console.log("error", error.response.status);
          const errorValue = error.response.status;
          if (errorValue === 400) {
            toast.error("Teacher Already Exit");
          }
        });
    } else {
      this.setState({ isSubmit: false });
      toast.error("Captcha Does Not Match");
      values.captcha = "";
      this.getRandomCaptcha();
    }
  };

  getUsername = (e) => {
    let username = e.target.value;
    let laststr = username.substr(username.length - 1);

    let format = /^[!@#$%^&*()_+\- =[\]{};':"\\|,.<>/?]*$/;
    if (laststr.match(format)) {
      let name = username.replace(laststr, " ");
      this.setState({ userName: name });
    } else {
      this.setState({ userName: username });
    }

    Api.get("api/v1/teacher/check/username", {
      params: {
        userName: username,
      },
    }).then((response) => {
      let status = response?.data?.data?.userName;
      if (username.toLowerCase() === status?.toLowerCase()) {
        let errMsg = "Username Is Already Exist";
        this.setState({ errorMessage: errMsg });
      } else {
        let errMsg = "";
        this.setState({ errorMessage: errMsg });
      }
    });
  };

  // Get category list option
  getCategoryList = () => {
    Api.get("api/v1/category").then((res) => {
      const option = res.data.data.data;
      this.setState({ categoryList: option });
    });
  };

  componentDidMount() {
    this.getCategoryList();
    this.getRandomCaptcha();
  }

  // for future release
  // responseGoogleSuccess = (response) => {
  //   Api.post("api/v1/teacher/signup", {
  //     tokenId: response.tokenId,
  //     googleId: response.googleId,
  //     isGoogleLogin: true,
  //   })
  //     .then((res) => {
  //       if (!res.data.dataVerified) {
  //         const role = res.data.teacherLogin.role;
  //         const userId = res.data.teacherLogin.id;
  //         const teacherId = res.data.teacherLogin.teacherId;
  //         const token = res.data.teacherLogin.token;
  //         localStorage.setItem("role", role);
  //         localStorage.setItem("userId", userId);
  //         localStorage.setItem("teacherId", teacherId);
  //         localStorage.setItem("sessionId", token);
  //         this.props.history.push(`/teacher/edit/${teacherId}`);
  //         window.location.reload();
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.status >= 400) {
  //         let errorMessage;
  //         const errorRequest = error.response.request;
  //         if (errorRequest && errorRequest.response) {
  //           errorMessage = JSON.parse(errorRequest.response).message;
  //         }
  //         toast.error(error.response.data.message);
  //       }
  //     });
  // };

  // //FaceBook
  // responseFacebook = (response) => {
  //   Api.post("api/v1/teacher/signup",{
  //     faceBookId: response.id,
  //     isFaceBookLogin: true,
  //     firstName: response.first_name,
  //     lastName: response.last_name,
  //     email: response.email
  //   })
  //   .then((res)=>{
  //     if (!res.data.dataVerified) {
  //       const role = res.data.teacherLogin.role;
  //       const userId = res.data.teacherLogin.id;
  //       const teacherId = res.data.teacherLogin.teacherId;
  //       const token = res.data.teacherLogin.token;
  //       localStorage.setItem("role", role);
  //       localStorage.setItem("userId", userId);
  //       localStorage.setItem("teacherId", teacherId);
  //       localStorage.setItem("sessionId", token);
  //       this.props.history.push(`/teacher/edit/${teacherId}`);
  //       window.location.reload()
  //     }
  //   })
  //   .catch((error) => {
  //     if (error.response && error.response.status >= 400) {
  //       let errorMessage;
  //       const errorRequest = error.response.request;
  //       if (errorRequest && errorRequest.response) {
  //         errorMessage = JSON.parse(errorRequest.response).message;
  //       }
  //       toast.error(error.response.data.message);
  //     }
  //   });
  // };

  // Error Handler
  responseGoogleError = (response) => {};
  render() {
    const { categoryList } = this.state;
    return (
      <Container className=" my-2 px-3" fluid>
        <Card className="p-md-3 p-lg-4 teacer-sign-background">
          <div className="row  mt-2">
            <div className="col-sm-12" style={{ height: "auto" }}>
              <h4 className="d-flex justify-content-center mb-4" style={{ fontFamily: "none", fontWeight: "bold" }}>
                Teacher Sign Up
              </h4>
              {/* For future update  */}
              {/* <Row>
              <Col xs={12} sm={6}>
                <div className="google-login d-flex justify-content-center py-2">
                  <GoogleLogin
                    clientId={CLIENT_ID}
                    buttonText="Sign Up with Google"
                    onSuccess={this.responseGoogleSuccess}
                    onFailure={this.responseGoogleError}
                    isSignedIn={false}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="py-2">
                  <FacebookLogin
                    appId="766552864322859"
                    autoLoad={false}
                    textButton="Sign Up with Facebook"
                    fields="first_name,last_name,email,picture"
                    scope="public_profile,email,user_friends"
                    callback={this.responseFacebook}
                    icon="fa-facebook"
                  />
                </div>
              </Col>
            </Row> 
            <hr className="or-divider mt-4 mb-5" />
            */}
              <div className="d-flex justify-content-center align-items-center mb-2 mt-3">
                <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" color="#1d1464" />
              </div>
              <div>
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    hearAboutUs: "",
                    speciality: "",
                    descriptionValue: "",
                    userName: "",
                    skills: "",
                    captcha: "",
                  }}
                  validationSchema={SignInSchema}
                  onSubmit={(values, { resetForm }) => this.submitForm(values, { resetForm })}
                >
                  {(formik) => {
                    const { values, handleChange, handleSubmit, handleBlur, isValid, setFieldValue } = formik;
                    return (
                      <div>
                        <Form onSubmit={handleSubmit}>
                          <div className="row d-flex justify-content-center">
                            <Col xs={12} sm={4}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>First Name</Label>
                                <br />
                                <FormControl
                                  type="type"
                                  name="firstName"
                                  id="firstName"
                                  placeholder="Enter Your First Name"
                                  value={values.firstName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="firstName" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={4}>
                              <Form.Group className="form-row mb-3">
                                <Label>Middle Name</Label>
                                <br />
                                <FormControl
                                  type="type"
                                  name="middleName"
                                  id="middleName"
                                  placeholder="Enter Your Middle Name"
                                  value={values.middleName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="middleName" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={4}>
                              <Form.Group className="form-row" style={{ width: "100%" }}>
                                <Label notify={true}>Last Name</Label>
                                <br />
                                <FormControl
                                  type="type"
                                  name="lastName"
                                  id="lastName"
                                  placeholder="Enter Your Last Name"
                                  value={values.lastName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="lastName" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          <div className="row d-flex justify-content-center">
                            <Col>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>User Name</Label>
                                <br />
                                <FormControl
                                  type="userName"
                                  name="userName"
                                  id="userName"
                                  placeholder="Enter User Name"
                                  value={values.userName}
                                  onChange={(e) => {
                                    setFieldValue("userName", e.target.value.replace(/\s/g, "-"));
                                    this.getUsername(e);
                                  }}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage name="userName" component="span" className="error text-danger" />

                                <p className="error text-danger"> {this.state.errorMessage} </p>
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}> Email</Label>
                                <br />
                                <FormControl
                                  type="email"
                                  name="email"
                                  id="email"
                                  style={{ textTransform: "lowercase" }}
                                  placeholder="Enter Your Email "
                                  value={values.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="email" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          <div className="row d-flex justify-content-center">
                            <Col>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Phone Number</Label>
                                <br />
                                <InputGroup className="mb-3">
                                  <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                                  <FormControl
                                    type="PhoneNumber"
                                    name="phone"
                                    id="phone"
                                    placeholder="Enter Your Phone Number"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                </InputGroup>
                                <ErrorMessage name="phone" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                              <Form.Group className="form-row mb-3">
                                <Label>How Did You Hear About Us?</Label>
                                <br />
                                <Select
                                  value={values.hearAboutUs}
                                  styles={customStyles}
                                  placeholder="How Did You Hear About Us?"
                                  name="hearAboutUs"
                                  onChange={(e) => {
                                    setFieldValue("hearAboutUs", e);
                                    this.setState({
                                      hearAboutUs: e.value,
                                    });
                                  }}
                                  options={[
                                    {
                                      value: "Referred By A Friend",
                                      label: "Referred By A Friend",
                                    },
                                    {
                                      value: "Web Search",
                                      label: "Web Search",
                                    },
                                    {
                                      value: "Social Media",
                                      label: "Social Media",
                                    },
                                  ]}
                                />
                                <ErrorMessage name="hearAboutUs" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          <div>
                            {/* <div className="d-flex justify-content-center mb-3">
                          <Form.Group
                            className="form-row mb-3"
                            style={{ marginRight: 20, width: "50%" }}
                          >
                             <Label notify={true}>Address Line 1</Label>
                            <br />
                            <FormControl
                              type="type"
                              name="address1"
                              id="address1"
                              placeholder="Enter Address 1"
                              value={values.address1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="address1" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group
                            className="form-row mb-3"
                            style={{ width: "50%" }}
                          >
                            <Label notify={true}>Address Line 2</Label>
                            <br />
                            <FormControl
                              type="text"
                              name="address2"
                              id="address2"
                              placeholder="Enter Address 2"
                              value={values.address2}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="address2" component="span" className="error text-danger" />
                          </Form.Group>
                        </div>
                        <div className="d-flex justify-content-center  mb-3">
                          <Form.Group
                            className="form-row mb-3"
                            style={{ marginRight: 20, width: "50%" }}
                          >
                             <Label notify={true}>City</Label>
                            <br />
                            <FormControl
                              type="type"
                              name="city"
                              id="city"
                              placeholder="Enter Your City"
                              value={values.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="city" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group
                            className="form-row mb-3"
                            style={{ width: "50%" }}
                          >
                             <Label notify={true}>State</Label>
                            <br />
                            <FormControl
                              type="type"
                              name="state"
                              id="state"
                              placeholder="Enter Your State"
                              value={values.state}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="state" component="span" className="error text-danger" />
                          </Form.Group>
                        </div>
                        <div className="d-flex justify-content-center mb-3">
                          <Form.Group
                            className="form-row mb-3"
                            style={{ marginRight: 20, width: "50%" }}
                          >
                             <Label notify={true}>Zip Code</Label>
                            <br />
                            <FormControl
                              type="text"
                              name="zipCode"
                              id="zipCode"
                              placeholder="Enter Your ZipCode"
                              value={values.zipCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="zipCode" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group
                            className="form-row mb-3"
                            style={{ width: "50%" }}
                          >
                            <Label notify={true}>Primary Email</Label> <br />
                            <FormControl
                              type="alternativeEmail"
                              name="alternativeEmail"
                              id="alternativeEmail"
                              style={{ textTransform: "lowercase" }}
                              placeholder="Enter Your Alternative Email"
                              value={values.alternativeEmail}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="alternativeEmail" component="span" className="error text-danger" />
                          </Form.Group>
                        </div> */}
                          </div>
                          <div className="row d-flex justify-content-center">
                            <Col xs={12} sm={6}>
                              <Form.Group className="form-row mb-3">
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
                                      style={{ cursor: "pointer" }}
                                      onClick={this.togglePasswordVisibility}
                                      size="1x"
                                    />
                                  </InputGroup.Text>
                                </InputGroup>
                                <ErrorMessage name="password" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm={6}>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Confirm Password</Label>
                                <InputGroup>
                                  <FormControl
                                    type={this.state.confirmPasswordShown ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                    placeholder="Confirm Password"
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
                                      icon={this.state.confirmPasswordShown ? faEye : faEyeSlash}
                                      style={{ cursor: "pointer" }}
                                      onClick={this.toggleConfirmPasswordVisibility}
                                      size="1x"
                                    />
                                  </InputGroup.Text>
                                </InputGroup>
                                <ErrorMessage name="confirmPassword" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          <div className="row d-flex justify-content-left">
                            <Col>
                              <Form.Group className="form-row mb-3">
                                <Label notify={true}>Speciality</Label>
                                <br />
                                <FormControl
                                  type="speciality"
                                  name="speciality"
                                  id="speciality"
                                  placeholder="Enter Your Speciality"
                                  value={values.speciality}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                                <ErrorMessage name="speciality" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group className="form-row mb-3">
                                <Label>Skills</Label>
                                <br />
                                <Select
                                  value={values.skills}
                                  styles={customStyles}
                                  placeholder="Add Your Skills"
                                  name="skills"
                                  onChange={(e) => {
                                    setFieldValue("skills", e);
                                  }}
                                  options={[
                                    {
                                      options: categoryList.map((list) => ({
                                        value: list.id,
                                        label: list.name,
                                      })),
                                    },
                                  ]}
                                  isMulti
                                />
                                <ErrorMessage name="skills" component="span" className="error text-danger" />
                              </Form.Group>
                            </Col>
                          </div>
                          <div className="d-flex justify-content-center mb-4">
                            <Form.Group className="form-row" style={{ width: "100%" }}>
                              <Label notify={true}>Speciality Description</Label>
                              <br />
                              <div className="teacher-description">
                                <Editor
                                  spellCheck
                                  name="descriptionValue"
                                  editorState={this.state.specialityDescription}
                                  onEditorStateChange={(e) => {
                                    this.setState({ specialityDescription: e });
                                    this.onChangeDescription({ setFieldValue }, e);
                                  }}
                                  toolbar={{
                                    options: ["inline", "list", "textAlign"],
                                  }}
                                />
                              </div>
                              <ErrorMessage name="descriptionValue" component="span" className="error text-danger" />
                            </Form.Group>
                          </div>
                          <div className="mb-5">
                            <Form.Group>
                              {" "}
                              <Label notify={true}>Captcha</Label>
                            </Form.Group>
                            <Row>
                              <Col>
                                <Form.Group>
                                  <Form.Control
                                    placeholder="Captcha"
                                    name="captcha"
                                    type="text"
                                    id="captcha"
                                    value={values.captcha}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onPaste={(e) => {
                                      e.preventDefault();
                                      return false;
                                    }}
                                  />
                                  <ErrorMessage name="captcha" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                              <Col className="d-flex flex-direction-row align-items-center">
                                <s
                                  className="border border-primary captcha-form-alignment  px-4 mx-4 "
                                  style={{ backgroundColor: "azure", color: "black" }}
                                  onCopy={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                >
                                  {this.state.captcha}
                                </s>
                                <FontAwesomeIcon
                                  icon={faRedoAlt}
                                  size="1x"
                                  color="blue"
                                  onClick={() => {
                                    values.captcha = "";
                                    this.getRandomCaptcha();
                                  }}
                                  style={{ cursor: "pointer" }}
                                />
                              </Col>
                            </Row>
                            {/* <Col xs={12}>
                            <Form.Group>
                              <Label notify={true}>Captcha</Label>
                              <div className="captcha-form-alignment ">
                                <Form.Control
                                  placeholder="Captcha"
                                  name="captcha"
                                  type="text"
                                  id="captcha"
                                  value={values.captcha}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  style={{ width: "50%" }}
                                />
                                <s className="border border-primary  px-2 captcha-primary ">{this.state.captcha}</s>
                                <FontAwesomeIcon
                                  icon={faRedoAlt}
                                  size="1x"
                                  color="#1d1464"
                                  className="captcha-column-alignment"
                                  onClick={() => {
                                    values.captcha = "";
                                    this.getRandomCaptcha();
                                  }}
                                />
                              </div>
                              <ErrorMessage name="captcha" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col> */}
                          </div>
                          <div className="d-flex justify-content-end mb-5">
                            <Button
                              variant="outlined"
                              className="me-2 Kharpi-cancel-btn"
                              onClick={() => this.props.history.goBack()}
                            >
                              Cancel
                            </Button>
                            <Button
                              className={`${
                                !isValid || this.state.isSubmit ? "create-account-disable" : "create-account-active"
                              }`}
                              variant="contained"
                              disabled={!isValid || this.state.isSubmit}
                              type="submit"
                            >
                              Sign Up as Teacher
                            </Button>
                          </div>
                        </Form>
                      </div>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    );
  }
}
export default TeacherSignup;
