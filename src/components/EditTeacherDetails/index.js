import React, { Component } from "react";
import { Container, Row, Col, Form, FormControl, Dropdown, InputGroup } from "react-bootstrap";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, convertFromRaw } from "draft-js";
import { toast } from "react-toastify";
import { TEACHER_ACCOUNT_TYPE, TEACHER_ACCOUNT_COUNTRY, TEACHER_ACCOUNT_CURRENCY } from "../../constants/roles.js";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEye, faEyeSlash, faBuildingColumns, faUserPlus } from "@fortawesome/free-solid-svg-icons";

// Styles
import "../../css/EditTeacherDetails.scss";

// Component
import Label from "../../components/core/Label";
import states from "../../components/core/States";
import Loader from "../../components/core/Loader";
import profile from "../core/NoProfile.png";

// Api
import Api from "../../Api";
import { customStyles } from "../core/Selector";
import LabelComponent from "../../components/core/Label";

//Tabs
import { Tab, Tabs } from "@material-ui/core";

// Validation
const EmailSignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("First Name Is Required"),

  lastName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("Last Name Is Required"),

  password: Yup.string()
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
      "Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .min(8, "Password Required Minimum 8 Characters")
    .required("Password Is Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .matches(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&])",
      "Confirm Password Should contain Uppercase, Lowercase, Numbers and Special Characters"
    )
    .required("Confirm Password Is Required"),

  zipCode: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be 5 Digits")
    .nullable(),

  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .max(10, "Enter Valid number")
    .min(10, "Enter Valid number")
    .required("Phone Number Is Required"),

  email: Yup.string()
    .email("Enter Valid Email")
    .required("Email Is Required"),

  alternativeEmail: Yup.string()
    .email("Enter Valid Email")
    .nullable(),

  speciality: Yup.string().required("Speciality Is Required"),

  descriptionValue: Yup.string().required("Speciality Description Is Required"),

  aboutUsValue: Yup.string().required("About Us Is Required"),
});

const GoogleAndFacebookSignInSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("First Name Is Required"),

  lastName: Yup.string()
    .matches(/^[A-Z]/, "First Letter Must Be Capital")
    .matches(/^[aA-zZ\s]+$/, "Enter Valid Name")
    .required("Last Name Is Required"),

  zipCode: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Zip Code"
    )
    .matches(/^[0-9]{5}$/, "Zip Code Must Be 5 Digits")
    .nullable(),

  phone: Yup.string()
    .matches(/^[0-9\s]+$/, "Enter Valid Phone Number")
    .required("Phone Number Is Required"),

  email: Yup.string()
    .email("Enter Valid Email")
    .required("Email Is Required"),

  alternativeEmail: Yup.string()
    .email("Enter Valid Email")
    .nullable(),

  speciality: Yup.string().required("Speciality Is Required"),

  descriptionValue: Yup.string().required("Speciality Description Is Required"),

  aboutUsValue: Yup.string().required("About Us Is Required"),
});

const BankDetails = Yup.object().shape({
  accountName: Yup.string().required("Account Name is Required"),
  routingNumber: Yup.string().required(" Account Routing Number is Required"),
  bankName: Yup.string().required("Bank Name is Required"),
  accountNumber: Yup.string().required("Account Number is Required"),
  confirmAccountNumber: Yup.string()
    .oneOf([Yup.ref("accountNumber"), null], "Accounts Number is must atch")
    .required("Confirm Account Number is Required"),
  // customerId: Yup.string().required("customer Id is Required"),
});

export default class EditTeacherDetails extends Component {
  constructor(props) {
    super(props);
    this.onChange = (editorState) => this.setState({ editorState });
    this.state = {
      hearAboutUs: "",
      teacherId: this.props?.match?.params?.id,
      teacherDetails: [],
      isLoading: true,
      userName: "",
      firstName: "",
      lastName: "",
      middleName: "",
      address1: "",
      address2: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      state: "",
      stateValue: "",
      stateCode: 0,
      city: "",
      cityValue: "",
      zipCode: "",
      alternativeEmail: "",
      speciality: "",
      hearAboutUsValue: "",
      specialityDescription: EditorState.createEmpty(),
      aboutUs: EditorState.createEmpty(),
      descriptionValue: "",
      aboutUsValue: "",
      isSubmit: false,
      isOpen: false,
      fileUploadState: "",
      imagePreview: "",
      isEnable: false,
      categoryList: [],
      skills: "",
      passwordShown: false,
      value: 0,
      teacherBankDetails: "",
      teacherUpdateId: "",
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

  fileUploadAction = () => this.inputReference.current.click();

  fileUploadInputChange = async (e) => {
    const file = e.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await this.convertBase64(file);
    this.setState({ imagePreview: base64, imageType: type });
    const token = localStorage.getItem("sessionId");

    if (type === "image") {
      Api.patch("api/v1/teacher/image/upload", {
        teacherId: this.state.teacherId,
        image: this.state.imagePreview,
        token: token,
      })
        .then((response) => {
          toast.success("Profile Updated Successfully");
        })
        .catch((error) => {
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

    Api.delete("api/v1/teacher/remove/image", {
      params: {
        teacherId: this.state.teacherId,
        token: token,
      },
    })
      .then((response) => {
        this.getTeacherDetail();
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

  componentDidMount() {
    this.getTeacherDetail();
    this.getCategory();
    this.getTeacherBankDetails();
  }

  // Get category list option
  getCategory = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/category").then((res) => {
      this.setState({ categoryList: res.data.data.data });
    });
  };

  togglePasswordVisibility = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  };

  toggleConfirmPasswordVisibility = () => {
    this.setState({ confirmPasswordShown: !this.state.confirmPasswordShown });
  };

  changeToHtml = (data) => {
    const contentState = convertFromRaw(JSON.parse(data));
    const editorState = EditorState.createWithContent(contentState);
    const editedText = convertToRaw(editorState.getCurrentContent());
    return { editedText, editorState };
  };

  // Get Teacher Details
  getTeacherDetail = () => {
    const token = localStorage.getItem("sessionId");
    Api.get(`api/v1/teacher/${this.state.teacherId}`).then((response) => {
      const data = response.data.data.getOne;
      const selectSkill = data.skills ? JSON.parse(data.skills) : "";
      const specialityDescriptionData = data?.specialityDescription
        ? this.changeToHtml(data?.specialityDescription)
        : "";
      this.setState({
        teacherDetails: data,
        userName: data?.userName ? data?.userName : "",
        firstName: data?.firstName,
        lastName: data?.lastName,
        middleName: data?.middleName,
        phone: data?.phone,
        email: data?.email,
        address1: data?.address1,
        address2: data?.address2,
        password: data?.password,
        confirmPassword: data?.password,
        state: data?.state ? { value: data.state, label: data.state } : "",
        stateValue: data.state,
        city: data?.city ? { value: data.city, label: data.city } : "",
        cityValue: data.city,
        zipCode: data?.zipCode,
        alternativeEmail: data?.alternateEmail,
        speciality: data?.speciality,
        hearAboutUsValue: data?.hearAboutUs,
        hearAboutUs: data?.hearAboutUs ? { value: data.hearAboutUs, label: data.hearAboutUs } : "",
        imagePreview: data?.imageUrl,
        specialityDescription: data?.specialityDescription ? specialityDescriptionData.editorState : "",
        descriptionValue: data?.specialityDescription ? specialityDescriptionData.editedText.blocks[0].text : "",
        skills: selectSkill,
        isLoading: false,
      });
      const aboutUsData = data?.aboutUs ? this.changeToHtml(data?.aboutUs) : "";
      this.setState({
        aboutUs: data?.aboutUs ? aboutUsData.editorState : "",
        aboutUsValue: data?.aboutUs ? aboutUsData.editedText.blocks[0].text : "",
        isEnable: data?.isPublic,
      });
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

  onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    this.setState({
      descriptionValue: editedText.blocks[0].text,
    });
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  onChangeAboutUs = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    this.setState({
      aboutUsValue: editedText.blocks[0].text,
    });
    setFieldValue("aboutUsValue", editedText.blocks[0].text);
  };

  // Submit Form
  submitForm = (values, { resetForm }) => {
    const email = values.email.toLowerCase();
    const alternativeEmail = values?.alternativeEmail?.toLowerCase();
    this.setState({ isSubmit: true });
    const convertedData = JSON.stringify(convertToRaw(this.state.specialityDescription.getCurrentContent()));
    const aboutUsConvertedData = JSON.stringify(convertToRaw(this.state.aboutUs.getCurrentContent()));
    const skillsData = JSON.stringify(values.skills);
    const state = values?.state?.value ? values?.state?.value : "";
    const city = values?.city?.value ? values?.city?.value : "";
    const hearAboutUs = values?.hearAboutUs?.value ? values?.hearAboutUs?.value : "";
    const token = localStorage.getItem("sessionId");

    Api.patch(`api/v1/teacher/${this.state.teacherId}`, {
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName,
      address1: values.address1,
      address2: values.address2,
      password: values.password,
      confirmPassword: values.confirmPassword,
      city: city,
      state: state,
      zipCode: values.zipCode,
      phone: values.phone,
      email: email,
      alternateEmail: alternativeEmail,
      hearAboutUs: hearAboutUs,
      speciality: values.speciality,
      specialityDescription: convertedData,
      aboutUs: aboutUsConvertedData,
      isPublic: this.state.isEnable,
      skills: skillsData,
      loginType: this.state.teacherDetails.loginType,
      token: token,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          this.setState({ isSubmit: false });
          toast.success("Updated");
          this.getTeacherDetail();
          // this.props.history.push("/dashboard");
          // window.location.reload();
          this.props.history.push({ state: { sidebar: true } });
        } else {
          this.setState({ isSubmit: false });
          toast.error("Email Already Exist");
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  submitBankDetails = (values) => {
    const userId = localStorage.getItem("userId");
    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("sessionId");
    Api.post("/api/v1/teacher/create/customer", {
      accountType: TEACHER_ACCOUNT_TYPE,
      country: TEACHER_ACCOUNT_COUNTRY,
      currency: TEACHER_ACCOUNT_CURRENCY,
      accountHolderName: values.accountName,
      routingNumber: values.routingNumber,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      confirmAccountNumber: values.confirmAccountNumber,
      userId: userId,
      teacherId: teacherId,
      // customerId: values.customerId,
      token: token,
    })
      .then((res) => {
        this.getTeacherBankDetails();
        toast.success(res.data.message);
      })
      .catch((error) => {
        if (error.response.status >= 400) {
          toast.error(error.response.data.message);
          this.setState({ isSubmit: false });
        }

        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  getTeacherBankDetails = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("sessionId");

    Api.get("/api/v1/teacher/bank/details", {
      params: {
        userId: userId,
        token: token,
      },
    })
      .then((res) => {
        const data = res.data.data;
        this.setState({ teacherBankDetails: data, teacherUpdateId: data?.id });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  updateTeacherBankDetails(values) {
    const token = localStorage.getItem("sessionId");

    Api.patch("/api/v1/teacher/bank/details", {
      accountName: values.accountName,
      routingNumber: values.routingNumber,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      confirmAccountNumber: values.confirmAccountNumber,
      id: this.state.teacherUpdateId,
      customerId: values.customerId,
      token: token,
    })
      .then((res) => {
        this.getTeacherBankDetails();
        const msg = res.data.message;
        toast.success(msg);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  }

  render() {
    const { categoryList, teacherBankDetails, teacherUpdateId } = this.state;
    // const value = this.state.skills;
    const options = [
      {
        options: categoryList.map((list) => ({
          value: list.id,
          label: list.name,
        })),
      },
    ];
    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <div className="mt-2">
            <Tabs
              value={this.state.value}
              indicatorColor="primary"
              textColor="primary"
              aria-label="primary tabs example"
              onChange={(event, newValue) => {
                this.setState({ value: newValue });
              }}
            >
              <Tab
                label={
                  <Row>
                    <Col>
                      <p className="tab-titles mt-2">
                        <FontAwesomeIcon icon={faUserPlus} size="lg" color="#1d1464" className="me-3" /> Profile{" "}
                      </p>
                    </Col>
                  </Row>
                }
                style={{ minWidth: "50%" }}
                value={0}
              />

              <Tab
                label={
                  <Row>
                    <Col>
                      <p className="tab-titles mt-2">
                        <FontAwesomeIcon icon={faBuildingColumns} size="lg" color="#1d1464" className="me-3" />
                        Bank Details
                      </p>
                    </Col>
                  </Row>
                }
                style={{ minWidth: "50%" }}
                value={1}
              />
            </Tabs>
            {this.state.value === 0 ? (
              <Container className="mb-5">
                <Row className="teacher-detail-header mt-3">
                  <Col xs={12} sm={5} className="userName">
                    <p className="mb-0">{this.state.userName !== "" ? `${"# " + this.state.userName}` : ""}</p>
                  </Col>
                  <Col xs={12} sm={7}>
                    <Row>
                      <Col sm={7} xs={12} className="switch-enable ">
                        <Form>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Make As A Public Page Enable"
                            checked={this.state.isEnable}
                            onChange={(e) => {
                              this.setState({
                                isEnable: !this.state.isEnable,
                              });
                            }}
                          />
                        </Form>
                      </Col>
                      <Col sm={5} xs={12} className="public-link">
                        <Link
                          className="view-as-public-page"
                          to={{
                            pathname: `/teacher/profile/view`,
                            state: { teacherId: this.state.teacherId },
                          }}
                        >
                          View As Public Page
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr />
                <Row className="mt-4">
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      firstName: this.state.firstName,
                      middleName: this.state.middleName,
                      lastName: this.state.lastName,
                      email: this.state.email,
                      phone: this.state.phone,
                      alternativeEmail: this.state.alternativeEmail,
                      password: this.state.password,
                      confirmPassword: this.state.confirmPassword,
                      address1: this.state.address1,
                      address2: this.state.address2,
                      state: this.state.state,
                      city: this.state.city,
                      zipCode: this.state.zipCode,
                      speciality: this.state.speciality,
                      specialityDescription: "",
                      descriptionValue: this.state.descriptionValue,
                      hearAboutUs: this.state.hearAboutUs,
                      aboutUs: "",
                      aboutUsValue: this.state.aboutUsValue,
                      skills: this.state.skills,
                    }}
                    validationSchema={
                      this.state.teacherDetails.logininType === "Email"
                        ? EmailSignInSchema
                        : GoogleAndFacebookSignInSchema
                    }
                    onSubmit={(values, { resetForm }) => this.submitForm(values, { resetForm })}
                  >
                    {(formik) => {
                      const { handleSubmit, handleBlur, setFieldValue, values, handleChange } = formik;
                      return (
                        <div>
                          <Form onSubmit={handleSubmit}>
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
                                          <Avatar src={profile} size="150" round={true} color="silver" />
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
                                <Form.Group className="form-row mb-2">
                                  <Label className="label-title" notify={true}>
                                    First Name
                                  </Label>
                                  <FormControl
                                    type="type"
                                    name="firstName"
                                    id="firstName"
                                    placeholder="First Name"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="firstName" component="span" className="error text-danger" />
                                </Form.Group>
                                <Form.Group className="form-row mb-2">
                                  <Label className="label-title">Middle Name</Label>
                                  <FormControl
                                    type="type"
                                    id="middleName"
                                    placeholder="Middle Name"
                                    value={values.middleName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                </Form.Group>
                                <Form.Group className="form-row mb-2">
                                  <Label className="label-title" notify={true}>
                                    Last Name
                                  </Label>
                                  <FormControl
                                    type="type"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Last Name"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="lastName" component="span" className="error text-danger" />
                                </Form.Group>
                                <Form.Group className="form-row mb-2">
                                  <Label className="label-title" notify={true}>
                                    Email
                                  </Label>
                                  <FormControl
                                    type="email"
                                    name="email"
                                    id="email"
                                    disabled={this.state.teacherDetails.loginType !== "Email"}
                                    placeholder="Primary Email"
                                    style={{ textTransform: "lowercase" }}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage name="email" component="span" className="error text-danger" />
                                </Form.Group>
                                <Form.Group className="form-row mb-2">
                                  <Label className="label-title">Alternative Email</Label>
                                  <FormControl
                                    type="email"
                                    name="alternativeEmail"
                                    id="alternativeEmail"
                                    placeholder="Alternative Email"
                                    style={{ textTransform: "lowercase" }}
                                    value={values.alternativeEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-width"
                                  />
                                  <ErrorMessage
                                    name="alternativeEmail"
                                    component="span"
                                    className="error text-danger"
                                  />
                                </Form.Group>
                                <Form.Group className="form-row mb-2">
                                  <Label className="label-title" notify={true}>
                                    Phone Number
                                  </Label>
                                  <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">+1</InputGroup.Text>
                                    <FormControl
                                      type="phone"
                                      name="phone"
                                      id="phone"
                                      placeholder="Phone Number"
                                      value={values.phone}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="form-width"
                                    />
                                  </InputGroup>
                                  <ErrorMessage name="phone" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                              <Col xs={12} sm={8} className="px-4">
                                <div className="row d-flex justify-content-center">
                                  <Col sm={6} xs={12}>
                                    <Form.Group className="form-row mb-3">
                                      <Label className="label-title">Address Line 1</Label>
                                      <FormControl
                                        type="type"
                                        id="address1"
                                        placeholder="Address 1"
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
                                      <Label className="label-title">Address Line 2</Label>
                                      <FormControl
                                        type="text"
                                        id="address2"
                                        placeholder="Address 2"
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
                                      <Label className="label-title">State</Label>
                                      <Select
                                        value={values.state}
                                        styles={customStyles}
                                        name="state"
                                        placeholder="State"
                                        onChange={(e) => {
                                          this.Index(e);
                                          setFieldValue("state", e);
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
                                      <ErrorMessage name="state" component="span" className="error text-danger" />
                                    </Form.Group>
                                  </Col>
                                  <Col sm={4} xs={12}>
                                    <Form.Group className="form-row mb-3">
                                      <Label className="label-title">City</Label>
                                      <Select
                                        name="city"
                                        styles={customStyles}
                                        placeholder="City"
                                        value={values.city}
                                        onChange={(e) => {
                                          setFieldValue("city", e);
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
                                      <ErrorMessage name="city" component="span" className="error text-danger" />
                                    </Form.Group>
                                  </Col>
                                  <Col sm={4} xs={12}>
                                    <Form.Group className="form-row mb-3">
                                      <Label className="label-title">Zip Code</Label>
                                      <FormControl
                                        type="text"
                                        name="zipCode"
                                        id="zipCode"
                                        maxLength="5"
                                        placeholder="ZipCode"
                                        value={values.zipCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="form-width"
                                      />
                                      <ErrorMessage name="zipCode" component="span" className="error text-danger" />
                                    </Form.Group>
                                  </Col>
                                </div>
                                <div className=" row d-flex justify-content-center">
                                  <Col xs={12} sm={6}>
                                    <Form.Group className="form-row mb-3">
                                      <Label className="label-title" notify={true}>
                                        Speciality
                                      </Label>
                                      <FormControl
                                        type="speciality"
                                        name="speciality"
                                        id="speciality"
                                        placeholder="Speciality"
                                        value={values.speciality}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="form-width"
                                      />
                                      <ErrorMessage name="speciality" component="span" className="error text-danger" />
                                    </Form.Group>
                                  </Col>
                                  <Col xs={12} sm={6}>
                                    <Form.Group className="form-row mb-3">
                                      <Label className="label-title" notify={true}>
                                        How did you hear about us?
                                      </Label>
                                      <Select
                                        value={values.hearAboutUs}
                                        styles={customStyles}
                                        placeholder="How did you hear about us?"
                                        name="hearAboutUs"
                                        onChange={(e) => {
                                          setFieldValue("hearAboutUs", e);
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
                                <div className="row d-flex justify-content-left">
                                  <Col xs={12}>
                                    <Form.Group className="form-row mb-3">
                                      <Label>Skills</Label>
                                      <br />

                                      <div>
                                        <Select
                                          value={values.skills}
                                          options={options}
                                          styles={customStyles}
                                          name="skills"
                                          onChange={(e) => {
                                            setFieldValue("skills", e);
                                          }}
                                          isMulti
                                        ></Select>
                                      </div>
                                      {/* <ErrorMessage name="hearAboutUs" component="span" className="error text-danger" /> */}
                                    </Form.Group>
                                  </Col>
                                </div>
                                <Form.Group className="form-row mb-3">
                                  <Label className="label-title" notify={true}>
                                    Speciality Description
                                  </Label>
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
                                  <ErrorMessage
                                    name="descriptionValue"
                                    component="span"
                                    className="error text-danger"
                                  />
                                </Form.Group>
                                <Form.Group className="form-row mb-3">
                                  <Label className="label-title" notify={true}>
                                    About Me
                                  </Label>
                                  <div className="teacher-description">
                                    <Editor
                                      spellCheck
                                      name="aboutUsValue"
                                      editorState={this.state.aboutUs}
                                      onEditorStateChange={(e) => {
                                        this.setState({ aboutUs: e });
                                        this.onChangeAboutUs({ setFieldValue }, e);
                                      }}
                                      toolbar={{
                                        options: ["inline", "list", "textAlign"],
                                      }}
                                    />
                                  </div>
                                  <ErrorMessage name="aboutUsValue" component="span" className="error text-danger" />
                                </Form.Group>
                                {/* <div className="row d-flex justify-content-center">
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label className="label-title" notify={true}>
                                    Password
                                  </Label>
                                  <InputGroup className="input-group ">
                                    <Form.Control
                                      type={this.state.passwordShown ? "text" : "password"}
                                      id="password"
                                      name="password"
                                      placeholder="Enter Password"
                                      disabled={values.password}
                                      value={values.password}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="form-width"
                                    />
                                    <InputGroup.Text>
                                      <FontAwesomeIcon
                                        icon={this.state.passwordShown ? faEye : faEyeSlash}
                                        onClick={this.togglePasswordVisibility}
                                        style={{ cursor: "pointer" }}
                                        size="1x"
                                      />
                                    </InputGroup.Text>
                                  </InputGroup>
                                  <ErrorMessage name="password" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label className="label-title" notify={true}>
                                    Confirm Password
                                  </Label>
                                  <InputGroup>
                                    <Form.Control
                                      type={this.state.confirmPasswordShown ? "text" : "password"}
                                      id="confirmPassword"
                                      name="confirmPassword"
                                      placeholder="Enter Confirm Password"
                                      disabled={values.confirmPassword}
                                      value={values.confirmPassword}
                                      onCopy={(e) => {
                                        e.preventDefault();
                                        return false;
                                      }}
                                      onPaste={(e) => {
                                        e.preventDefault();
                                        return false;
                                      }}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      className="form-width"
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
                            </div> */}
                                <div className="mt-0">
                                  <Link
                                    className="link-decoration ps-1"
                                    style={{
                                      fontSize: 17,
                                      fontFamily: "none",
                                      color: "#375474",
                                    }}
                                    to={{
                                      pathname: `/set/password`,
                                    }}
                                  >
                                    Reset Password
                                  </Link>
                                </div>
                                <div className="d-flex justify-content-end mt-3">
                                  <Button
                                    className={`${
                                      this.state.isSubmit
                                        ? "teacher-save-changes-disable"
                                        : "teacher-save-changes-active"
                                    }`}
                                    variant="contained"
                                    color="primary"
                                    disabled={this.state.isSubmit === true}
                                    type="submit"
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
            ) : (
              <Formik
                enableReinitialize={true}
                initialValues={{
                  accountName: teacherBankDetails?.accountName,
                  routingNumber: teacherBankDetails?.routingNumber,
                  bankName: teacherBankDetails?.bankName,
                  accountNumber: teacherBankDetails?.accountNumber,
                  confirmAccountNumber: teacherBankDetails?.confirmAccountNumber,
                  // customerId: teacherBankDetails?.customerId,
                  customerId: teacherBankDetails?.customerId,
                }}
                validationSchema={BankDetails}
                onSubmit={(values) =>
                  teacherUpdateId ? this.updateTeacherBankDetails(values) : this.submitBankDetails(values)
                }
              >
                {(formik) => {
                  const { handleSubmit, handleBlur, values, handleChange, handleReset } = formik;
                  return (
                    <Row>
                      <Col></Col>
                      <Col sm={12} md={9} lg={9}>
                        <Form
                          className="mx-3  mt-sm-3 mt-md-5 border p-4 mb-3 bank-details-bg "
                          onSubmit={handleSubmit}
                          onReset={handleReset}
                        >
                          <h4>Bank Account Information</h4>
                          <Form.Group className="form-row mb-3 mt-3">
                            <Label notify={true}>Account Holder Name </Label>
                            <Form.Control
                              placeholder="Account Holder Number"
                              name="accountName"
                              id="accountName"
                              value={values.accountName}
                              type="string"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="accountName" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Account Routing Number </Label>
                            <Form.Control
                              placeholder="Account Routing Number"
                              name="routingNumber"
                              id="routingNumber"
                              type="string"
                              value={values.routingNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="routingNumber" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Bank Name </Label>
                            <Form.Control
                              placeholder="Bank Name"
                              name="bankName"
                              id="bankName"
                              type="string"
                              value={values.bankName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="bankName" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Account Number </Label>
                            <Form.Control
                              name="accountNumber"
                              id="accountNumber"
                              placeholder="Account Number"
                              type="string"
                              value={values.accountNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="accountNumber" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group className="form-row mb-3">
                            <Label notify={true}>Confirm Account Number </Label>
                            <Form.Control
                              name="confirmAccountNumber"
                              id="confirmAccountNumber"
                              placeholder="Confirm Account Number"
                              type="string"
                              value={values.confirmAccountNumber}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="form-width"
                            />
                            <ErrorMessage name="confirmAccountNumber" component="span" className="error text-danger" />
                          </Form.Group>
                          <Form.Group className="form-row mb-3">
                            <Label>Customer Id </Label>
                            <Form.Control
                              name="customerId"
                              id="customerId"
                              placeholder="Customer Id"
                              type="string"
                              value={values.customerId}
                              className="form-width"
                              disabled
                            />
                            {/* <ErrorMessage name="customerId" component="span" className="error text-danger" /> */}
                          </Form.Group>

                          <Row className="mt-4 mb-3">
                            <Col className="d-flex justify-content-end">
                              <Button className="me-2 confirm-payment-cancel-btn px-3" type="reset">
                                Cancel
                              </Button>
                              <Button type="submit" className="bank-save-btn px-4">
                                Save
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </Col>
                      <Col></Col>
                    </Row>
                  );
                }}
              </Formik>
            )}
          </div>
        )}
      </div>
    );
  }
}
