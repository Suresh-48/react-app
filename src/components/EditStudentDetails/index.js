import React, { Component } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Form, FormControl, Dropdown, InputGroup } from "react-bootstrap";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";

// Api
import Api from "../../Api";

// Style
import "../../css/ParentSignup.scss";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import DateFnsUtils from "@date-io/date-fns";

// Component
import Label from "../../components/core/Label";
import Loader from "../../components/core/Loader";
import states from "../../components/core/States";
import profile from "../core/NoProfile.png";
import { customStyles } from "../core/Selector";

// Validations
const EmailSignInSchema = Yup.object().shape({
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

  gender: Yup.object().required("Gender Is Required"),

  phoneNumber: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .min(10, "Enter Valid number")
    .max(10, "Enter Valid number")
    .nullable(),

  zipCode: Yup.string()
    .nullable()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be 5 Digits"),

  email: Yup.string()
    .email("Enter Valid Email")
    .required("Email Is Required"),

  dob: Yup.string().required("Date Of Birth Is Required"),

  password: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
      "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .min(8, "Password Required Minimum 8 characters")
    .required("Password Is Required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
      "Confirm Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .required("Confirm Password Is Required"),
});

const GoogleAndFacebookSignInSchema = Yup.object().shape({
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

  gender: Yup.object().required("Gender Is Required"),

  phoneNumber: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .min(10, "Enter valid phone number")
    .max(10, "Enter valid phone number")
    .nullable(),

  zipCode: Yup.string()
    .nullable()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be 5 Digits"),

  email: Yup.string()
    .email("Enter Valid Email")
    .required("Email Is Required"),

  dob: Yup.string().required("Date Of Birth Is Required"),
});

const options = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

class EditStudentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      studentId: this.props?.match?.params?.id,
      isLoading: true,
      gender: "",
      genderValue: "",
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
      dob: "",
      fileUploadState: "",
      imagePreview: "",
      password: "",
      confirmPassword: "",
      passwordShown: false,
      confirmPasswordShown: false,
      isSubmit: false,
      aliasName: this.props?.location?.state?.aliasName,
    };
    this.inputReference = React.createRef();
  }

  //logout
  logout = () => {
    setTimeout(() => {
      localStorage.clear(this.props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

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
    const token = localStorage.getItem("sessionId");
    console.log("token  student edit", token);
    this.setState({ imagePreview: base64, imageType: type });
    if (type === "image") {
      Api.post("api/v1/student/profile/upload", {
        studentId: this.state.studentId,
        image: this.state.imagePreview,
        token: token,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            toast.success("Profile Upload Successfully!...");
            this.studentDetails();
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

          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            this.logout();
            toast.error("Session Timeout");
          }
        });
    } else {
      toast.error("Image Only Accept");
    }
  };

  // Delete Image
  removeImage = () => {
    const token = localStorage.getItem("sessionId");
    Api.delete("api/v1/student/remove/profile", {
      params: {
        studentId: this.state.studentId,
        token: token,
      },
    })
      .then((response) => {
        this.studentDetails();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
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
  studentDetails = () => {
    const token = localStorage.getItem("sessionId");
    console.log("token student get", token);
    Api.get(`/api/v1/student/${this.state.studentId}`, { headers: { token: token } })
      .then((res) => {
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
          email: data?.email,
          dob: data?.dob ? data?.dob : "",
          password: data?.password,
          confirmPassword: data?.confirmPassword,
          imagePreview: data?.imageUrl,
          genderValue: data?.gender,
          gender: data?.gender ? { value: data?.gender, label: data?.gender } : "",
          zipCode: data?.zipCode,
          city: data?.city ? { value: data?.city, label: data?.city } : "",
          cityValue: data?.city,
          state: data?.state ? { value: data?.state, label: data?.state } : "",
          stateValue: data?.state,
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

  componentDidMount() {
    this.studentDetails();
  }

  // Submit Details
  submitForm = (values) => {
    this.setState({ isSubmit: true });
    const email = values.email.toLowerCase();
    const startDate = this.state.dob;
    const gender = values.gender.value ? values.gender.value : "";
    const City = values.city.value ? values.city.value : "";
    const state = values.state.value ? values.state.value : "";
    const dateValue = moment(startDate).format("ll");
    const token = localStorage.getItem("sessionId");
    Api.patch(`api/v1/student/${this.state.studentId}`, {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName ? values.middleName : "",
      dob: dateValue,
      gender: gender,
      phone: values.phone ? values.phone : "",
      email: email,
      address1: values.address1 ? values.address1 : "",
      address2: values.address2 ? values.address2 : "",
      city: City,
      state: state,
      zipCode: values.zipCode ? values.zipCode : "",
      password: values.password,
      confirmPassword: values.confirmPassword,
      loginType: this.state.details.loginType,
      token: token,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          this.setState({ isSubmit: false });
          toast.success("Updated");
          if (this.state.aliasName) {
            this.props.history.push(`/course/detail/${this.state.aliasName}`);
          } else {
            // this.props.history.push("/dashboard");
            this.studentDetails();
            this.props.history.push({ state: { sidebar: true } });
          }
          // window.location.reload();
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

        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Date Format
  setDateFormat = (e) => {
    let dateValue = moment(e).format("LLLL");
    let dob = new Date(dateValue);
    let month = Date.now() - dob.getTime();
    let getAge = new Date(month);
    let year = getAge.getUTCFullYear();
    let age = Math.abs(year - 1970);

    if (age >= 5 && age <= 18) {
      this.setState({ dob: dateValue });
    } else {
      toast.warning("Your Age Must Be at least 5 years to at most 18 years");
      this.setState({ dob: null });
    }
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {isLoading ? (
            <Loader />
          ) : (
            <Container className="p-3">
              <Row className=" py-0 profile-dropdown-status">
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    middleName: this.state.middleName,
                    dob: this.state.dob,
                    gender: this.state.gender,
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
                  validationSchema={
                    this.state.details.logininType === "Email" ? EmailSignInSchema : GoogleAndFacebookSignInSchema
                  }
                  onSubmit={(values) => this.submitForm(values)}
                >
                  {(formik) => {
                    const { values, handleChange, handleSubmit, setFieldValue, handleBlur } = formik;
                    return (
                      <div>
                        <Form onSubmit={handleSubmit}>
                          <Row>
                            <Col
                              sm={12}
                              xs={12}
                              md={12}
                              lg={4}
                              className="d-flex justify-content-center px-4 pt-2"
                              style={{ backgroundColor: "#0000000a" }}
                            >
                              <Dropdown className="dropdown-profile-list">
                                <Dropdown.Toggle className="teacher-menu-dropdown p-0" varient="link">
                                  <div>
                                    <div>
                                      {this.state.imagePreview ? (
                                        <Avatar
                                          src={this.state.imagePreview}
                                          size="220"
                                          round={true}
                                          color="silver"
                                          className="image-size"
                                        />
                                      ) : (
                                        <Avatar
                                          src={profile}
                                          size="220"
                                          round={true}
                                          color="silver"
                                          className="image-size"
                                        />
                                      )}
                                    </div>
                                    <div className="d-flex justify-content-center mt-3">
                                      <p style={{ fontSize: 11, color: "black" }}>Click Here To Upload Profile</p>
                                      <FontAwesomeIcon icon={faPen} size="sm" color="#1d1464" className="mx-1" />
                                    </div>
                                  </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu center className="profile-dropdown-status  ms-4 py-0">
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
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={8} className="py-4 px-4">
                              <div className="row d-flex justify-content-center">
                                <Col xs={12} sm={4} md={4}>
                                  <Form.Group className="form-row mb-3">
                                    <Label notify={true}>First Name</Label>
                                    <br />
                                    <FormControl
                                      type="type"
                                      name="firstName"
                                      placeholder="First Name"
                                      id="firstName"
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
                                      placeholder="Middle Name"
                                      id="middleName"
                                      value={values.middleName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="form-width"
                                    />
                                    <ErrorMessage name="middleName" component="span" className="error text-danger" />
                                  </Form.Group>
                                </Col>
                                <Col xs={12} sm={4}>
                                  <Form.Group className="form-row mb-3">
                                    <Label notify={true}>Last Name</Label>
                                    <br />
                                    <FormControl
                                      type="type"
                                      placeholder="Last Name"
                                      name="lastName"
                                      id="lastName"
                                      value={values.lastName}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="form-width"
                                    />
                                    <ErrorMessage name="lastName" component="span" className="error text-danger" />
                                  </Form.Group>
                                </Col>
                                <Col sm={6} xs={12}>
                                  <Form.Group className="form-row mb-3">
                                    <Label notify={true}>Email</Label>
                                    <FormControl
                                      type="email"
                                      placeholder="Email Address"
                                      name="email"
                                      id="email"
                                      disabled={this.state.details.loginType !== "Email"}
                                      style={{ textTransform: "lowercase" }}
                                      value={values.email}
                                      onChange={handleChange}
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
                                    <InputGroup className="mb-3">
                                      <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                                      <FormControl
                                        type="phoneNumber"
                                        placeholder="PhoneNumber"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="form-width"
                                      />
                                    </InputGroup>
                                    <ErrorMessage name="phoneNumber" component="span" className="error text-danger" />
                                  </Form.Group>
                                </Col>
                              </div>
                              <div className="row d-flex justify-content-center">
                                <Col sm={6} xs={12}>
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
                                      value={values.dob}
                                      onChange={(e) => {
                                        setFieldValue("dob", e);
                                        this.setDateFormat(e);
                                      }}
                                      keyboardIcon={
                                        <FontAwesomeIcon
                                          icon={faCalendarDay}
                                          size="sm"
                                          color="grey"
                                          style={{ padding: 0 }}
                                        />
                                      }
                                    />
                                    <ErrorMessage
                                      name="dob"
                                      component="span"
                                      className="error text-danger error-message"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col sm={6} xs={12}>
                                  <Form.Group className="form-row mb-3">
                                    <Label notify={true}>Gender</Label>
                                    <br />
                                    <Select
                                      id="gender"
                                      styles={customStyles}
                                      name="gender"
                                      value={values.gender}
                                      placeholder="Select Gender"
                                      onChange={(e) => {
                                        setFieldValue("gender", e);
                                      }}
                                      options={options}
                                    />
                                    <ErrorMessage name="gender" component="span" className="error text-danger" />
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
                                      value={values.address1}
                                      onChange={handleChange}
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
                                      value={values.address2}
                                      onChange={handleChange}
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
                                      value={values.state}
                                      styles={customStyles}
                                      name="state"
                                      placeholder="State"
                                      onChange={(e) => {
                                        this.Index(e);
                                        setFieldValue("state", e);
                                        // this.setState({
                                        //   state: e,
                                        //   stateValue: e.value,
                                        //   cityValue: "",
                                        //   city: "",
                                        // });
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
                                      styles={customStyles}
                                      value={values.city}
                                      onChange={(e) => {
                                        setFieldValue("city", e);
                                        // this.setState({
                                        //   city: e,
                                        //   cityValue: e.value,
                                        // });
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
                                      value={values.zipCode}
                                      maxLength="5"
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="form-width"
                                    />
                                    <ErrorMessage name="zipCode" component="span" className="error text-danger" />
                                  </Form.Group>
                                </Col>
                              </div>
                              {this.state.details.loginType === "Email" && (
                                <div>
                                  {/* <div className="row d-flex justify-content-center">
                                    <Col sm={6} xs={12}>
                                      <Form.Group
                                        className="form-row"
                                        style={{
                                          marginRight: 20,
                                          width: "100%",
                                        }}
                                      >
                                        <Label notify={true}>Password</Label>
                                        <InputGroup className="input-group ">
                                          <FormControl
                                            type={this.state.passwordShown ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            disabled={this.state.password}
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
                                              style={{ cursor: "pointer" }}
                                              size="1x"
                                            />
                                          </InputGroup.Text>
                                        </InputGroup>
                                        <ErrorMessage name="password" component="span" className="error text-danger" />
                                      </Form.Group>
                                    </Col>
                                    <Col sm={6} xs={12}>
                                      <Form.Group
                                        className="form-row"
                                        style={{
                                          marginRight: 20,
                                          width: "100%",
                                        }}
                                      >
                                        <Label notify={true}>Confirm Password</Label>
                                        <InputGroup className="input-group ">
                                          <FormControl
                                            type={this.state.confirmPasswordShown ? "text" : "password"}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            disabled={this.state.confirmPassword}
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
                                              style={{ cursor: "pointer" }}
                                              onClick={() => this.tooglePasswordVisibility()}
                                              size="1x"
                                            />
                                          </InputGroup.Text>
                                        </InputGroup>
                                        <ErrorMessage
                                          name="confirmPassword"
                                          component="span"
                                          className="error text-danger"
                                        />
                                      </Form.Group>
                                    </Col>
                                  </div> */}
                                  <div className="mt-2">
                                    <Link
                                      className="linkColor ps-1"
                                      style={{
                                        fontSize: 17,
                                        fontFamily: "none",
                                      }}
                                      to={{
                                        pathname: `/set/password`,
                                      }}
                                    >
                                      Reset Password
                                    </Link>
                                  </div>
                                </div>
                              )}
                              <div className="d-flex justify-content-end my-3 pt-2">
                                <Button
                                  className={`${
                                    this.state.isSubmit
                                      ? "save-changes-disable Kharpi-save-btn"
                                      : "save-changes-active Kharpi-save-btn"
                                  }`}
                                  variant="contained"
                                  type="submit"
                                  onClick={handleSubmit}
                                  disabled={this.state.isSubmit === true}
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
        </MuiPickersUtilsProvider>
      </Container>
    );
  }
}
export default EditStudentDetails;
