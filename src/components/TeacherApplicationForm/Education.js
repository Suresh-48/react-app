import React, { Component } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";

//Component
import Label from "../core/Label";
import states from "../core/States";

// Styles
import "../../css/TeacherApplicationForm.scss";

export class Education extends Component {
  next = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  Index = (value) => {
    let selectState = value;
    for (let i = 0; i < states.length; i++) {
      if (states[i].state === selectState.value) {
        this.setState({ stateCode: i });
      }
    }
  };

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
                Educational Details
              </h5>

              <Row>
                <Col xs={12}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Institution Name</Label>
                    <FormControl
                      type="type"
                      name="institution"
                      id="institution"
                      placeholder="Enter Institution Name"
                      defaultValue={values.institution}
                      onChange={handleChange("institution")}
                      className="form-styles"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Subjects</Label>
                    <FormControl
                      type="text"
                      name="subject"
                      id="subject"
                      defaultValue={values.subject}
                      onChange={handleChange("subject")}
                      className="form-width"
                      placeholder="Enter Subjects"
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
                    <Label notify={true}>Credential</Label>
                    <FormControl
                      type="type"
                      name="credential"
                      placeholder="Enter You Credentials"
                      id="credential"
                      defaultValue={values.credential}
                      onChange={handleChange("credential")}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-3"
                    style={{ marginRight: 20, width: "100%" }}
                  >
                    <Label notify={true}>Year of Passing</Label>
                    <FormControl
                      type="type"
                      name="yearOfPassing"
                      placeholder="Year of Passing"
                      id="yearOfPassing"
                      defaultValue={values.yearOfPassing}
                      onChange={handleChange("yearOfPassing")}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-2"
                    style={{ width: "100%" }}
                  >
                    <Label notify={true}>States</Label>

                    <Select
                      defaultValue={values.state}
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
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-2"
                    style={{ width: "100%" }}
                  >
                    <Label notify={true}>City</Label>
                    <br />
                    <Select
                      placeholder="City"
                      defaultValue={values.city}
                      name="city"
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
                      name="country"
                      placeholder="Country"
                      id="address1"
                      defaultValue={values.country}
                      onChange={handleChange("country")}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} sm={6} md={6}>
                  <Form.Group
                    className="form-row mb-2"
                    style={{ width: "100%" }}
                  >
                    <Label notify={true}>Zip Code</Label>
                    <FormControl
                      type="type"
                      name="zipCode"
                      maxLength="5"
                      placeholder="Zip Code"
                      id="zipCode"
                      defaultValue={values.zipCode}
                      onChange={handleChange("zipCode")}
                      className="form-width"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end my-3">
                <Button
                  variant="primary"
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

export default Education;
