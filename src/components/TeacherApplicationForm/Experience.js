import React, { Component } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, convertFromRaw, EditorState } from "draft-js";
import moment from "moment";

//Component
import Label from "../core/Label";
import states from "../core/States";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarDay } from "@fortawesome/free-solid-svg-icons";

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

export class Experience extends Component {
  next = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        this.setState({ stateCode: i });
      }
    }
  };
  // Date Format
  setDateFormat = (e) => {
    const startDateValue = moment(e).format("LLLL");
    this.setState({ startDate: startDateValue });
    this.setState({ endDate: startDateValue });
  };

  // onChangeDescription = ({ setFieldValue }, e) => {
  //   const editedText = convertToRaw(e.getCurrentContent());
  //   setFieldValue("additionalInfoDesc", editedText.blocks[0].text);
  // };

  render() {
    const { values, handleChange } = this.props;
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Container>
          <div>
            <Form>
              <h3 className="d-flex justify-content-center mb-4">
                Application Form
              </h3>
              <h5 className="d-flex justify-content-left mb-4">
                Place of Experience
              </h5>
              <Row>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Institution Name</Label>
                    <FormControl
                      type="text"
                      name="workInstitution"
                      defaultValue={values.workInstitution}
                      onChange={handleChange("workInstitution")}
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
                        defaultValue={values.subjectTaught}
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
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Experience</Label>
                    <FormControl
                      type="text"
                      name="experience"
                      id="experience"
                      onChange={handleChange("experience")}
                      defaultValue={values.experience}
                      className="form-width"
                      placeholder="Enter Your Experience"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group className="form-row mb-3">
                    <Label notify={true}>Role</Label>
                    <Select
                      defaultValue={values.role}
                      placeholder="Choose Role..."
                      onChange={(e) => {
                        this.setState({ role: e.value });
                      }}
                      options={options}
                    />
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
                      defaultValue={values.startDate}
                      onChange={(e) => {
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
                      defaultValue={values.endDate}
                      onChange={(e) => {
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
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} sm={4} md={4}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Class Size</Label>
                    <FormControl
                      type="type"
                      name="classSize"
                      placeholder="Enter Class Size"
                      id="classSize"
                      onChange={handleChange("classSize")}
                      defaultValue={values.classSize}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} sm={4} md={4}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Student Age Range From</Label>
                    <FormControl
                      type="type"
                      name="ageRangeFrom"
                      placeholder="Age Range From"
                      id="ageRangeFrom"
                      onChange={handleChange("ageRangeFrom")}
                      defaultValue={values.ageRangeFrom}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} sm={4} md={4}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Student Age Range To</Label>
                    <FormControl
                      type="type"
                      name="ageRangeTo"
                      placeholder="Age Range To"
                      id="ageRangeTo"
                      onChange={handleChange("ageRangeTo")}
                      defaultValue={values.ageRangeTo}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Institution Address Line 1</Label>
                    <FormControl
                      type="type"
                      name="address1"
                      placeholder="Address Line 1"
                      id="address1"
                      onChange={handleChange("workAddress1")}
                      defaultValue={values.workAddress1}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Institution Address Line 2</Label>
                    <FormControl
                      type="type"
                      name="address2"
                      placeholder="Address Line 2"
                      id="address2"
                      onChange={handleChange("workAddress2")}
                      defaultValue={values.workAddress2}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} sm={4} md={4}>
                  <Form.Group
                    className="form-row mb-2"
                    style={{ width: "100%" }}
                  >
                    <Label notify={true}>States</Label>

                    <Select
                      defaultValue={values.workState}
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
                <Col sm={12} sm={4} md={4}>
                  <Form.Group
                    className="form-row mb-2"
                    style={{ width: "100%" }}
                  >
                    <Label notify={true}>City</Label>
                    <br />
                    <Select
                      placeholder="City"
                      defaultValue={values.workCity}
                      name="workCity"
                      onChange={(e) => {
                        this.setState({ cityValue: e.value, city: e });
                      }}
                      options={states[this?.state?.stateCode]?.cities?.map(
                        (item, key) => ({
                          label: item,
                          value: item,
                        })
                      )}
                    />
                  </Form.Group>
                </Col>

                <Col sm={12} sm={4} md={4}>
                  <Form.Group
                    className="form-row mb-2"
                    style={{ width: "100%" }}
                  >
                    <Label notify={true}>Zip Code</Label>
                    <FormControl
                      type="type"
                      name="WorkZipCode"
                      maxLength="5"
                      placeholder="Zip Code"
                      id="WorkZipCode"
                      onChange={handleChange("WorkZipCode")}
                      defaultValue={values.WorkZipCode}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Country</Label>
                    <FormControl
                      type="type"
                      name="workCountry"
                      placeholder="Country"
                      id="address1"
                      onChange={handleChange("workCountry")}
                      defaultValue={values.workCountry}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label>Web site ( optional )</Label>
                    <FormControl
                      type="type"
                      name="website"
                      placeholder="Enter Website if any"
                      id="address2"
                      onChange={handleChange("workInsWebsite")}
                      defaultValue={values.workInsWebsite}
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
                        onEditorStateChange={(e) =>
                          this.setState({ additionalInfoDesc: e })
                        }
                        toolbar={{
                          options: ["inline", "list", "textAlign"],
                        }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="d-flex justify-content-end my-3">
                <Button
                  color="secondary"
                  variant="contained"
                  className="backbtn-active"
                  onClick={this.back}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  className="nextbtn-active"
                  onClick={this.next}
                >
                  Next
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}

export default Experience;
