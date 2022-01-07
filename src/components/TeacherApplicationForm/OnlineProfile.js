import React, { Component } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Editor } from "react-draft-wysiwyg";
import Button from "@material-ui/core/Button";

//Component
import Label from "../core/Label";

// Styles
import "../../css/TeacherApplicationForm.scss";

export default class OnlineProfile extends Component {
  next = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
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
              <h3 className="d-flex justify-content-center mb-4">Application Form</h3>
              <h5 className="d-flex justify-content-left mb-4">Online Profile Details</h5>

              <Row>
                <Col xs={12}>
                  <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                    <Label notify={true}>Professional Websites</Label>
                    <FormControl
                      name="ownsites"
                      defaultValue={values.ownsites}
                      onChange={handleChange("ownsites")}
                      placeholder="Enter Websites"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                    <Label>Facebook</Label>
                    <FormControl
                      name="facebook"
                      placeholder="Enter FaceBook Link"
                      defaultValue={values.facebook}
                      onChange={handleChange("facebook")}
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group className="form-row mb-3" style={{ marginRight: 20, width: "100%" }}>
                    <Label>LinkedIn</Label>
                    <FormControl
                      name="linkedIn"
                      placeholder="Enter LinkedIn Address"
                      defaultValue={values.linkedIn}
                      onChange={handleChange("linkedIn")}
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
              <div className="d-flex justify-content-end my-3">
                <Button color="secondary" variant="contained" className="backbtn-active" onClick={this.back}>
                  Back
                </Button>
                <Button variant="contained" className="nextbtn-active" onClick={this.next}>
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
