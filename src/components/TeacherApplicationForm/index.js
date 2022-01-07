import React, { useState } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core/";
import DateFnsUtils from "@date-io/date-fns";
import { useForm } from "./useForm";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import { Editor } from "react-draft-wysiwyg";

import "./TeacherApplication.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

//Component
import Label from "../core/Label";
import states from "../core/States";

function TeacherApplicationForm() {
  const { inputs, change } = useForm();

  const options = [
    { value: "Teacher", label: "Teacher" },
    { value: "Teaching Assistant", label: "Teaching Assistant" },
    { value: "Admin", label: "Admin" },
    { value: "Volunteer", label: "Volunteer" },
    { value: "Personal", label: "Personal" },
    { value: "Other", label: "Other" },
  ];

  const skillOptions = [
    { value: "Java", label: "Java" },
    { value: "Yoga", label: "Yoga" },
    { value: ".Net", label: ".Net" },
    { value: "Music", label: "Music" },
    { value: "Drawing", label: "Drawing" },
    { value: "Other", label: "Other" },
  ];

  const educationInfo = () => {
    return (
      <Container>
        <Form>
          <h5 className="d-flex justify-content-left mb-4">Educational Details</h5>
          <Row>
            <Col xs={12}>
              <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                <Label notify={true}>Institution Name</Label>
                <FormControl
                  type="type"
                  name="institution"
                  id="institution"
                  placeholder="Enter Institution Name"
                  defaultValue={inputs.institution}
                  onChange={change}
                  className="form-styles"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                <Label notify={true}>Subjects</Label>
                <FormControl
                  type="text"
                  name="subject"
                  id="subject"
                  defaultValue={inputs.subject}
                  onChange={change}
                  className="form-width"
                  placeholder="Enter Subjects"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6} md={6}>
              <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                <Label notify={true}>Credential</Label>
                <FormControl
                  type="type"
                  name="credential"
                  placeholder="Enter You Credentials"
                  id="credential"
                  defaultValue={inputs.credential}
                  onChange={change}
                  className="form-width"
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                <Label notify={true}>Year of Passing</Label>
                <FormControl
                  type="type"
                  name="yearOfPassing"
                  placeholder="Year of Passing"
                  id="yearOfPassing"
                  defaultValue={inputs.yearOfPassing}
                  onChange={change}
                  className="form-width"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} md={6}>
              <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                <Label notify={true}>States</Label>

                <Select
                  type="type"
                  id="state"
                  defaultValue={inputs.state}
                  name="state"
                  placeholder="State"
                  //onChange={change}
                  // onChange={(e) => {
                  //   handleChange("state");
                  //   this.Index(e);
                  // }}
                  options={states.map((item) => ({
                    label: item.state,
                    value: item.state,
                  }))}
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                <Label notify={true}>City</Label>
                <br />
                <Select
                  placeholder="City"
                  defaultValue={inputs.city}
                  name="city"
                  onChange={change}
                  options={states[this?.state?.stateCode]?.cities?.map((item, key) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6} md={6}>
              <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                <Label notify={true}>Country</Label>
                <FormControl
                  type="type"
                  name="country"
                  placeholder="Country"
                  id="address1"
                  defaultValue={inputs.country}
                  onChange={change}
                  className="form-width"
                />
              </Form.Group>
            </Col>
            <Col sm={6} md={6}>
              <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                <Label notify={true}>Zip Code</Label>
                <FormControl
                  type="type"
                  name="zipCode"
                  maxLength="5"
                  placeholder="Zip Code"
                  id="zipCode"
                  defaultValue={inputs.zipCode}
                  onChange={change}
                  className="form-width"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  };

  const experienceInfo = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Container>
          <div className="experience">
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Institution Name</Label>
                  <FormControl
                    type="text"
                    name="workInstitution"
                    defaultValue={inputs.workInstitution}
                    onChange={change}
                    className="form-width"
                    placeholder="Enter Institution Name"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="form-row mb-3">
                  <Label notify={true}>Subjects Taught</Label>
                  <br />

                  <div>
                    <Select
                      defaultValue={inputs.subjectTaught}
                      options={skillOptions}
                      name="skills"
                      onChange={(e) => {
                        this.setState({
                          skills: e,
                        });
                      }}
                      isMulti
                    ></Select>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Experience</Label>
                  <FormControl
                    type="text"
                    name="experience"
                    id="experience"
                    onChange={change}
                    defaultValue={inputs.experience}
                    className="form-width"
                    placeholder="Enter Your Experience"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Form.Group className="form-row mb-3">
                  <Label notify={true}>Role</Label>
                  <Select defaultValue={inputs.role} placeholder="Choose Role..." onChange={change} options={options} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6}>
                <Form.Group className="form-row mb-3">
                  <Label notify={true}>Start Date</Label>
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
                    defaultValue={inputs.startDate}
                    onChange={(e) => {
                      this.setDateFormat(e);
                    }}
                    keyboardIcon={
                      <FontAwesomeIcon icon={faCalendarDay} size="sm" color="grey" style={{ padding: 0 }} />
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group className="form-row mb-3">
                  <Label notify={true}>End Date</Label>
                  <br />
                  <KeyboardDatePicker
                    variant="standard"
                    className="start-time-style"
                    style={{ paddingLeft: 10 }}
                    placeholder="Select End Date"
                    helperText={""}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    format="MMM dd yyyy"
                    defaultValue={inputs.endDate}
                    onChange={(e) => {
                      this.setDateFormat(e);
                    }}
                    keyboardIcon={
                      <FontAwesomeIcon icon={faCalendarDay} size="sm" color="grey" style={{ padding: 0 }} />
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4} md={4}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Class Size</Label>
                  <FormControl
                    type="type"
                    name="classSize"
                    placeholder="Enter Class Size"
                    id="classSize"
                    onChange={change}
                    defaultValue={inputs.classSize}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
              <Col sm={4} md={4}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Student Age Range From</Label>
                  <FormControl
                    type="type"
                    name="ageRangeFrom"
                    placeholder="Age Range From"
                    id="ageRangeFrom"
                    onChange={change}
                    defaultValue={inputs.ageRangeFrom}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
              <Col sm={4} md={4}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Student Age Range To</Label>
                  <FormControl
                    type="type"
                    name="ageRangeTo"
                    placeholder="Age Range To"
                    id="ageRangeTo"
                    onChange={change}
                    defaultValue={inputs.ageRangeTo}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Institution Address Line 1</Label>
                  <FormControl
                    type="type"
                    name="address1"
                    placeholder="Address Line 1"
                    id="address1"
                    onChange={change}
                    defaultValue={inputs.workAddress1}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
              <Col sm={6} md={6}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Institution Address Line 2</Label>
                  <FormControl
                    type="type"
                    name="address2"
                    placeholder="Address Line 2"
                    id="address2"
                    onChange={change}
                    defaultValue={inputs.workAddress2}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={4} md={4}>
                <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                  <Label notify={true}>States</Label>

                  <Select
                    defaultValue={inputs.workState}
                    name="state"
                    placeholder="State"
                    onChange={(e) => {
                      this.Index(e);

                      this.setState({
                        state: e,
                        stateValue: e.value,
                        cityValue: "",
                        city: "",
                      });
                    }}
                    options={states.map((item) => ({
                      label: item.state,
                      value: item.state,
                    }))}
                  />
                </Form.Group>
              </Col>
              <Col sm={4} md={4}>
                <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                  <Label notify={true}>City</Label>
                  <br />
                  <Select
                    placeholder="City"
                    defaultValue={inputs.workCity}
                    name="workCity"
                    onChange={(e) => {
                      this.setState({ cityValue: e.value, city: e });
                    }}
                    options={states[this?.state?.stateCode]?.cities?.map((item, key) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                </Form.Group>
              </Col>

              <Col sm={4} md={4}>
                <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                  <Label notify={true}>Zip Code</Label>
                  <FormControl
                    type="type"
                    name="WorkZipCode"
                    maxLength="5"
                    placeholder="Zip Code"
                    id="WorkZipCode"
                    onChange={change}
                    defaultValue={inputs.WorkZipCode}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label notify={true}>Country</Label>
                  <FormControl
                    type="type"
                    name="workCountry"
                    placeholder="Country"
                    id="address1"
                    onChange={change}
                    defaultValue={inputs.workCountry}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
              <Col sm={6} md={6}>
                <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                  <Label>Web site ( optional )</Label>
                  <FormControl
                    type="type"
                    name="website"
                    placeholder="Enter Website if any"
                    id="address2"
                    onChange={change}
                    defaultValue={inputs.workInsWebsite}
                    className="form-width"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className="mb-3">
                  <Label notify={true}>Aditional Information</Label>
                  <div className="description">
                    <Editor
                      spellCheck
                      name="descriptionValue"
                      editorState={this?.state?.additionalInfoDesc}
                      onEditorStateChange={(e) => this.setState({ additionalInfoDesc: e })}
                      toolbar={{
                        options: ["inline", "list", "textAlign"],
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </MuiPickersUtilsProvider>
    );
  };
  const profileInfo = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Container>
          <div>
            <Form>
              <h5 className="d-flex justify-content-left mb-4">Online Profile Details</h5>

              <Row>
                <Col xs={12}>
                  <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                    <Label notify={true}>Professional Websites</Label>
                    <FormControl
                      name="ownsites"
                      defaultValue={inputs.ownsites}
                      onChange={change}
                      placeholder="Enter Websites"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6} md={6}>
                  <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                    <Label>Facebook</Label>
                    <FormControl
                      name="facebook"
                      placeholder="Enter FaceBook Link"
                      defaultValue={inputs.facebook}
                      onChange={change}
                    />
                  </Form.Group>
                </Col>
                <Col sm={6} md={6}>
                  <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                    <Label>LinkedIn</Label>
                    <FormControl
                      name="linkedIn"
                      placeholder="Enter LinkedIn Address"
                      defaultValue={inputs.linkedIn}
                      onChange={change}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="mb-3">
                    <Label notify={true}>Aditional Information</Label>
                    <div className="description">
                      <Editor
                        spellCheck
                        name="descriptionValue"
                        editorState={this?.state?.additionalInfoDesc}
                        onEditorStateChange={(e) => this.setState({ additionalInfoDesc: e })}
                        toolbar={{
                          options: ["inline", "list", "textAlign"],
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Container>
      </MuiPickersUtilsProvider>
    );
  };
  const finalComponent = () => {
    return (
      <MuiThemeProvider>
        <>
          <Container>
            <div className="submitPage">
              <h3 className="d-flex justify-content-center mb-4">Application Form Confirmation</h3>
              <Row className="teacher-profile-header">
                <h5 className="d-flex justify-content-left mb-4">Educational Information</h5>
              </Row>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Institution Name" secondary={inputs.institution} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Subject" secondary={inputs.subject} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Credential" secondary={inputs.credential} />
                    </ListItem>
                  </Col>
                </Row>
              </List>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Year Of Passing" secondary={inputs.yearOfPassing} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="State" secondary={inputs.state} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="City" secondary={inputs.city} />
                    </ListItem>
                  </Col>
                </Row>
              </List>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Country" secondary={inputs.country} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Zip Code" secondary={inputs.zipCode} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem></ListItem>
                  </Col>
                </Row>
              </List>
              <Row className="teacher-profile-header">
                <h5 className="d-flex justify-content-left mb-4">Working Information</h5>
              </Row>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Educational Institution Name" secondary={inputs.workInstitution} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Subjects Taught" secondary={inputs.subjectTaught} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Experiences" secondary={inputs.experience} />
                    </ListItem>
                  </Col>
                </Row>
              </List>
              <List>
                <Row>
                  <Row>
                    <Col sm={4} md={4}>
                      <ListItem>
                        <ListItemText primary="Role" secondary={inputs.role} />
                      </ListItem>
                    </Col>
                    <Col sm={4} md={4}>
                      <ListItem>
                        <ListItemText primary="Working From" secondary={inputs.startDate} />
                      </ListItem>
                    </Col>
                    <Col sm={4} md={4}>
                      <ListItem>
                        <ListItemText primary="Working To" secondary={inputs.endDate} />
                      </ListItem>
                    </Col>
                  </Row>
                </Row>
              </List>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Class Size" secondary={inputs.classSize} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Age Range From" secondary={inputs.ageRangeFrom} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Age Range To" secondary={inputs.ageRangeTo} />
                    </ListItem>
                  </Col>
                </Row>
              </List>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Address Line 1" secondary={inputs.workAddress1} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Address Line 2" secondary={inputs.workAddress2} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Web Sites" secondary={inputs.workInsWebsite} />
                    </ListItem>
                  </Col>
                </Row>
              </List>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="State" secondary={inputs.workState} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="City" secondary={inputs.workCity} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Country" secondary={inputs.workCountry} />
                    </ListItem>
                  </Col>
                </Row>
              </List>
              <Row className="teacher-profile-header">
                <h5 className="d-flex justify-content-left mb-4">Online Profile Details</h5>
              </Row>
              <List>
                <Row>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Institution Name" secondary={inputs.ownsites} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Credentials" secondary={inputs.facebook} />
                    </ListItem>
                  </Col>
                  <Col sm={4} md={4}>
                    <ListItem>
                      <ListItemText primary="Year of Passing" secondary={inputs.linkedIn} />
                    </ListItem>
                  </Col>
                </Row>
              </List>
              <br />
            </div>
          </Container>
        </>
      </MuiThemeProvider>
    );
  };

  const [steps, setSteps] = useState([
    {
      key: "firstStep",
      label: "Education",
      isDone: true,
      component: educationInfo,
    },
    {
      key: "secondStep",
      label: "Experience",
      isDone: false,
      component: experienceInfo,
    },
    {
      key: "thirdStep",
      label: "Profile",
      isDone: false,
      component: profileInfo,
    },
    {
      key: "finalStep",
      label: "Confirmation",
      isDone: false,
      component: finalComponent,
    },
  ]);
  const [activeStep, setActiveStep] = useState(steps[0]);

  const handleNext = () => {
    if (steps[steps.length - 1].key === activeStep.key) {
      return;
    }

    const index = steps.findIndex((x) => x.key === activeStep.key);
    setSteps((prevStep) =>
      prevStep.map((x) => {
        if (x.key === activeStep.key) x.isDone = true;
        return x;
      })
    );
    setActiveStep(steps[index + 1]);
  };

  const handleBack = () => {
    const index = steps.findIndex((x) => x.key === activeStep.key);
    if (index === 0) return;

    setSteps((prevStep) =>
      prevStep.map((x) => {
        if (x.key === activeStep.key) x.isDone = false;
        return x;
      })
    );
    setActiveStep(steps[index - 1]);
  };

  return (
    <div>
      <h4>Application Form</h4>
      <div className="box">
        <div className="steps">
          <ul className="nav">
            {steps.map((step, i) => {
              return (
                <li key={i} className={`${activeStep.key === step.key ? "active" : ""} ${step.isDone ? "done" : ""}`}>
                  <div>
                    Step {i + 1}
                    <br />
                    <span>{step.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="step-component">{activeStep.component()}</div>
      </div>
      <div className="d-flex justify-content-end my-3">
        <Button
          color="secondary"
          variant="contained"
          className="backbtn-active"
          onClick={handleBack}
          disabled={steps[0].key === activeStep.key}
        >
          Back
        </Button>

        <Button
          variant="contained"
          className="nextbtn-active"
          onClick={handleNext}
          value={steps[steps.length - 1].key !== activeStep.key ? "Next" : "Submit"}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default TeacherApplicationForm;
