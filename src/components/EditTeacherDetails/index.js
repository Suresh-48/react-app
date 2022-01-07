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

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Styles
import "../../css/EditTeacherDetails.scss";

// Component
import Label from "../../components/core/Label";
import states from "../../components/core/States";
import Loader from "../../components/core/Loader";

// Api
import Api from "../../Api";

// Validation
const SignInSchema = Yup.object().shape({
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

  email: Yup.string().email("Enter Valid Email").required("Email Is Required"),

  alternativeEmail: Yup.string().email("Enter Valid Email").nullable(),

  speciality: Yup.string().required("Speciality Is Required"),

  descriptionValue: Yup.string().required("Speciality Description Is Required"),

  aboutUsValue: Yup.string().required("About Us Is Required"),
});

export default class EditTeacherDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hearAboutUs: "",
      teacherId: this.props?.match?.params?.id,
      teacherDetails: "",
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
    };
    this.inputReference = React.createRef();
  }

  fileUploadAction = () => this.inputReference.current.click();

  fileUploadInputChange = async (e) => {
    const file = e.target.files[0];
    const type = file?.type?.split("/")[0];
    const base64 = await this.convertBase64(file);
    this.setState({ imagePreview: base64, imageType: type });
    if (type === "image") {
      Api.patch("api/v1/teacher/image/upload", {
        teacherId: this.state.teacherId,
        image: this.state.imagePreview,
      }).then((response) => {});
    } else {
      toast.error("Image Only Accept");
    }
  };

  // Delete Image
  removeImage = () => {
    Api.delete("api/v1/teacher/remove/image", {
      params: {
        teacherId: this.state.teacherId,
      },
    }).then((response) => {
      this.getTeacherDetail();
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

  componentDidMount = () => {
    this.getTeacherDetail();
    this.getCategory();
  };
  // Get category list option
  getCategory = () => {
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
    Api.get(`api/v1/teacher/${this.state.teacherId}`).then((response) => {
      const data = response.data.data.getOne;
      let selectSkill = JSON.parse(data.skills);
      const specialityDescriptionData = this.changeToHtml(data?.specialityDescription);
      this.setState({
        teacherDetails: data,
        userName: data?.userName,
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
        specialityDescription: specialityDescriptionData.editorState,
        descriptionValue: specialityDescriptionData.editedText.blocks[0].text,
        skills: selectSkill,
        isLoading: false,
      });
      const aboutUsData = this.changeToHtml(data?.aboutUs);
      this.setState({
        aboutUs: aboutUsData.editorState,
        aboutUsValue: aboutUsData.editedText.blocks[0].text,
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
    const skillsData = JSON.stringify(this.state.skills);

    Api.patch(`api/v1/teacher/${this.state.teacherId}`, {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      middleName: this.state.middleName,
      address1: this.state.address1,
      address2: this.state.address2,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      city: this.state.cityValue,
      state: this.state.stateValue,
      zipCode: this.state.zipCode,
      phone: this.state.phone,
      email: email,
      alternateEmail: alternativeEmail,
      hearAboutUs: this.state.hearAboutUsValue,
      speciality: this.state.speciality,
      specialityDescription: convertedData,
      aboutUs: aboutUsConvertedData,
      isPublic: this.state.isEnable,
      skills: skillsData,
    }).then((response) => {
      const status = response.status;
      if (status === 201) {
        this.setState({ isSubmit: false });
        toast.success("Updated");
        this.getTeacherDetail();
        // this.props.history.push('/dashboard')
      } else {
        this.setState({ isSubmit: false });
        toast.error("Email Already Exist");
      }
    });
  };

  render() {
    const { categoryList } = this.state;
    const value = this.state.skills;
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
          <Container>
            <Row className="teacher-detail-header">
              <Col xs={12} sm={5} className="userName">
                <p className="mb-0">{`${"# " + this.state.userName}`}</p>
              </Col>
              <Col xs={12} sm={7}>
                <Row>
                  <Col sm={7} xs={12} className="switch-enable">
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
                        pathname: `/teacher/profile/public`,
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
                validationSchema={SignInSchema}
                onSubmit={(values, { resetForm }) => this.submitForm(values, { resetForm })}
              >
                {(formik) => {
                  const { handleSubmit, handleBlur, setFieldValue } = formik;
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
                            <Form.Group className="form-row mb-2">
                              <Label className="label-title" notify={true}>
                                First Name
                              </Label>
                              <FormControl
                                type="type"
                                name="firstName"
                                id="firstName"
                                placeholder="First Name"
                                value={this.state.firstName}
                                onChange={(e) => this.setState({ firstName: e.target.value })}
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
                                value={this.state.middleName}
                                onChange={(e) => this.setState({ middleName: e.target.value })}
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
                                value={this.state.lastName}
                                onChange={(e) => this.setState({ lastName: e.target.value })}
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
                                placeholder="Primary Email"
                                style={{ textTransform: "lowercase" }}
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value })}
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
                                value={this.state.alternativeEmail}
                                onChange={(e) =>
                                  this.setState({
                                    alternativeEmail: e.target.value,
                                  })
                                }
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="alternativeEmail" component="span" className="error text-danger" />
                            </Form.Group>
                            <Form.Group className="form-row mb-2">
                              <Label className="label-title" notify={true}>
                                Phone Number
                              </Label>
                              <FormControl
                                type="phone"
                                name="phone"
                                id="phone"
                                placeholder="Phone Number"
                                value={this.state.phone}
                                onChange={(e) => this.setState({ phone: e.target.value })}
                                onBlur={handleBlur}
                                className="form-width"
                              />
                              <ErrorMessage name="phone" component="span" className="error text-danger" />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={8} className="px-4">
                            <div className="row d-flex justify-content-center">
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
                                      value={this.state.password}
                                      onChange={(e) => this.setState({ password: e.target.value })}
                                      onBlur={handleBlur}
                                      className="form-width"
                                    />
                                    <InputGroup.Text>
                                      <FontAwesomeIcon
                                        icon={this.state.passwordShown ? faEye : faEyeSlash}
                                        onClick={this.togglePasswordVisibility}
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
                                      value={this.state.confirmPassword}
                                      onCopy={(e) => {
                                        e.preventDefault();
                                        return false;
                                      }}
                                      onPaste={(e) => {
                                        e.preventDefault();
                                        return false;
                                      }}
                                      onChange={(e) => this.setState({ confirmPassword: e.target.value })}
                                      onBlur={handleBlur}
                                      className="form-width"
                                    />
                                    <InputGroup.Text>
                                      <FontAwesomeIcon
                                        icon={this.state.confirmPasswordShown ? faEye : faEyeSlash}
                                        onClick={this.toggleConfirmPasswordVisibility}
                                        size="1x"
                                      />
                                    </InputGroup.Text>
                                  </InputGroup>
                                  <ErrorMessage name="confirmPassword" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                            </div>
                            <div className="row d-flex justify-content-center">
                              <Col sm={6} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label className="label-title">Address Line 1</Label>
                                  <FormControl
                                    type="type"
                                    id="address1"
                                    placeholder="Address 1"
                                    value={this.state.address1}
                                    onChange={(e) => this.setState({ address1: e.target.value })}
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
                                    value={this.state.address2}
                                    onChange={(e) => this.setState({ address2: e.target.value })}
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
                                  <ErrorMessage name="state" component="span" className="error text-danger" />
                                </Form.Group>
                              </Col>
                              <Col sm={4} xs={12}>
                                <Form.Group className="form-row mb-3">
                                  <Label className="label-title">City</Label>
                                  <Select
                                    placeholder="City"
                                    value={this.state.city}
                                    onChange={(e) => {
                                      this.setState({
                                        city: e,
                                        cityValue: e.value,
                                      });
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
                                    value={this.state.zipCode}
                                    onChange={(e) => this.setState({ zipCode: e.target.value })}
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
                                    value={this.state.speciality}
                                    onChange={(e) =>
                                      this.setState({
                                        speciality: e.target.value,
                                      })
                                    }
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
                                    value={this.state.hearAboutUs}
                                    placeholder="How did you hear about us?"
                                    name="hearAboutUs"
                                    onChange={(e) => {
                                      this.setState({
                                        hearAboutUs: e,
                                        hearAboutUsValue: e.value,
                                      });
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
                                      value={value}
                                      options={options}
                                      name="skills"
                                      onChange={(e) => {
                                        this.setState({
                                          skills: e,
                                        });
                                        setFieldValue("skills", e);
                                      }}
                                      isMulti
                                    ></Select>
                                  </div>
                                  <ErrorMessage name="hearAboutUs" component="span" className="error text-danger" />
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
                              <ErrorMessage name="descriptionValue" component="span" className="error text-danger" />
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
                            <div className="d-flex justify-content-end mt-5">
                              <Button
                                className={`${
                                  this.state.isSubmit ? "teacher-save-changes-disable" : "teacher-save-changes-active"
                                }`}
                                variant="contained"
                                color="primary"
                                disabled={this.state.isSubmit}
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
        )}
      </div>
    );
  }
}
