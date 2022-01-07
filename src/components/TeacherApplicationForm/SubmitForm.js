import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import { Row, Col } from "react-bootstrap";

// Styles
import "../../css/TeacherApplicationForm.scss";

export class Confirm extends Component {
  continue = (e) => {
    e.preventDefault();
    // PROCESS FORM //
    this.props.nextStep();
  };

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const {
      values: {
        institution,
        credential,
        yearOfPassing,
        state,
        city,
        country,
        zipCode,
        subject,
        workInstitution,
        subjectTaught,
        experience,
        role,
        startDate,
        endDate,
        classSize,
        ageRangeFrom,
        ageRangeTo,
        workAddress1,
        workAddress2,
        workState,
        workCity,
        WorkZipCode,
        workCountry,
        workInsWebsite,
        ownsites,
        facebook,
        linkedIn,
      },
    } = this.props;

    return (
      <MuiThemeProvider>
        <>
          <h3 className="d-flex justify-content-center mb-4">Application Form</h3>
          <Row className="teacher-profile-header">
            <h5 className="d-flex justify-content-left mb-4">Working Experience</h5>
          </Row>
          <List>
            <Row>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Institution Name" secondary={institution} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Credentials" secondary={credential} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Year of Passing" secondary={yearOfPassing} />
                </ListItem>
              </Col>
            </Row>
            <Row>
              <Row>
                <Col sm={12} sm={4} md={4}>
                  <ListItem>
                    <ListItemText primary="State" secondary={state} />
                  </ListItem>
                </Col>
                <Col sm={12} sm={4} md={4}>
                  <ListItem>
                    <ListItemText primary="City" secondary={city} />
                  </ListItem>
                </Col>
                <Col sm={12} sm={4} md={4}>
                  <ListItem>
                    <ListItemText primary="Country" secondary={country} />
                  </ListItem>
                </Col>
              </Row>
            </Row>
            <Row>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Zip Code" secondary={zipCode} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Subjects" secondary={subject} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}></Col>
            </Row>
          </List>
          <br />
          <Row className="teacher-profile-header">
            <h5 className="d-flex justify-content-left mb-4">Working Experience Informations</h5>
          </Row>
          <List>
            <Row>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Educational Institution Name" secondary={workInstitution} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Subjects Taught" secondary={subjectTaught} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Experiences" secondary={experience} />
                </ListItem>
              </Col>
            </Row>
            <Row>
              <Row>
                <Col sm={12} sm={4} md={4}>
                  <ListItem>
                    <ListItemText primary="Role" secondary={role} />
                  </ListItem>
                </Col>
                <Col sm={12} sm={4} md={4}>
                  <ListItem>
                    <ListItemText primary="Working From" secondary={startDate} />
                  </ListItem>
                </Col>
                <Col sm={12} sm={4} md={4}>
                  <ListItem>
                    <ListItemText primary="Working To" secondary={endDate} />
                  </ListItem>
                </Col>
              </Row>
            </Row>
            <Row>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Class Size" secondary={classSize} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Age Range From" secondary={ageRangeFrom} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Age Range To" secondary={ageRangeTo} />
                </ListItem>
              </Col>
            </Row>

            <Row>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Address Line 1" secondary={workAddress1} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Address Line 2" secondary={workAddress2} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Web Sites" secondary={workInsWebsite} />
                </ListItem>
              </Col>
            </Row>
            <Row>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="State" secondary={workState} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="City" secondary={workCity} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Country" secondary={workCountry} />
                </ListItem>
              </Col>
            </Row>
          </List>

          <Row className="teacher-profile-header">
            <h5 className="d-flex justify-content-left mb-4">Online Profile Details</h5>
          </Row>
          <List>
            <Row>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Institution Name" secondary={ownsites} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Credentials" secondary={facebook} />
                </ListItem>
              </Col>
              <Col sm={12} sm={4} md={4}>
                <ListItem>
                  <ListItemText primary="Year of Passing" secondary={linkedIn} />
                </ListItem>
              </Col>
            </Row>
          </List>
          <br />

          <div className="d-flex justify-content-end my-3">
            <Button color="secondary" variant="contained" className="backbtn-active" onClick={this.back}>
              Back
            </Button>
            <Button variant="contained" className="nextbtn-active" onClick={this.next}>
              Submit
            </Button>
          </div>
        </>
      </MuiThemeProvider>
    );
  }
}

export default Confirm;
