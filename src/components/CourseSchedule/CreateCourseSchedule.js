import React, { Component } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Select from "react-select";
import TimezoneSelect, { allTimezones } from "react-timezone-select";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { KeyboardTimePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Avatar from "@material-ui/core/Avatar";

// Api
import Api from "../../Api.js";

//Component
import Label from "../../components/core/Label";

// Styles
import "../../css/CreateCourseSchedule.scss";

// Styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import Loader from "../core/Loader.js";

// Validation
const courseScheduleSchema = Yup.object().shape({
  weekly: Yup.object().required("Day Is Required").nullable(),

  enrollstudent: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{0,4}?[ \\-]*[0-9]{0,4}?$/,
      "Enter Valid Count"
    )
    .required("Maximum Enroll Count Is Required"),

  startTime: Yup.string().required("Start Time Is Required"),

  endTime: Yup.string().required("End Time Is Required"),

  timeZone: Yup.string().required("Time Zone Is Required"),

  startDate: Yup.string().required("Course Start Date Is Required"),
});

const options = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

export default class CreateCourseSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      endTime: "",
      courseName: this.props?.location?.state?.courseName,
      courseId: this.props?.location?.state?.courseId,
      weekly: "",
      isSubmit: false,
      duration: "",
      durationValue: "",
      startDate: "",
      isLoading: true,
      teacherList: [],
      teacherName: "",
      teacherId: null,
      speciality: "",
    };
  }

  componentDidMount = () => {
    this.getCourseData();
    this.getApprovedTeacher();
  };

  // Get Course Data
  getCourseData = () => {
    Api.get(`api/v1/course/${this.state.courseId}`).then((res) => {
      const data = res.data.data;
      this.setState({
        duration: data?.duration,
        isLoading: false,
      });
    });
  };
  // Get Approved  Teachers
  getApprovedTeacher = () => {
    Api.get(`api/v1/teacher/list`).then((res) => {
      const data = res.data.teacherList;
      this.setState({ teacherList: data });
    });
  };
  //get teachetr schedule
  checkTeacherSchedule = (e) => {
    const teacherId = e.value;
    const startTimeValue = moment(this.state.startTime, "LLLL").format("LT");
    const startDate = this.state.startDate;
    const dateValue = moment(startDate).format("ll");
    Api.get(`/api/v1/courseSchedule/check/teacherSchedule`, {
      params: {
        teacherId: teacherId,
        startDate: dateValue,
        startTime: startTimeValue,
      },
    }).then((response) => {
      const status = response.status;
      if (status === 208) {
        toast.warning(response.data.message);
        this.setState({ isSubmit: false });
      }
    });
  };
  // Submit form
  submitForm = (values) => {
    this.setState({ isSubmit: true });
    const startTimeValue = moment(values.startTime, "LLLL").format("LT");
    const startDate = this.state.startDate;
    const dateValue = moment(startDate).format("ll");
    //  const teacherName = name?.split("(")[0];
    Api.post("/api/v1/courseSchedule/createSchedule", {
      courseId: this.state.courseId,
      weeklyOn: this.state.weekly,
      startTime: startTimeValue,
      timeZone: values.timeZone,
      endTime: values.endTime,
      totalStudentEnrolled: values.enrollstudent,
      zoomId: values.zoomLink,
      zoomPassword: values.zoomPassword,
      startDate: dateValue,
      teacherName: this.state.teacherName,
      teacherId: this.state.teacherId ? this.state.teacherId : values.teacherId,
      speciality: this.state.speciality,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          Api.post("api/v1/teacherUpcomingSchedule", {
            courseScheduleId: response.data.scheduleDetails.id,
            teacherId: this.state.teacherId,
          });
          this.setState({ isSubmit: false });
          this.props.history.goBack();
        } else {
          toast.error(response.data.message);
          this.setState({ isSubmit: false });
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
          this.setState({ isSubmit: false });
        }
        this.setState({ isSubmit: false });
      });
  };

  // Set End Time
  setEndTime = (e, { setFieldValue }) => {
    var hours = e.getHours() + 1;
    var minutes = e.getMinutes();
    hours = hours % 24;
    var strTime = hours + ":" + minutes;
    const endTimeValue = moment(strTime, "hh:mm").format("LT");
    setFieldValue("endTime", endTimeValue);
    return strTime;
  };

  // Date Format
  setDateFormat = (e) => {
    const startDateValue = moment(e).format("LLLL");
    this.setState({ startDate: startDateValue });
  };

  render() {
    const { isSubmit, courseName, isLoading, teacherList } = this.state;
    const today = new Date();

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Container>
              <Row className="mt-3">
                <Col sm={12}>
                  <div className="mb-4">
                    <h4>{courseName}</h4>
                  </div>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      weekly: "",
                      startTime: "",
                      endTime: "",
                      enrollstudent: "",
                      timeZone: "America/Chicago",
                      zoomLink: "",
                      zoomPassword: "",
                      startDate: "",
                      teacherName: "",
                    }}
                    validationSchema={courseScheduleSchema}
                    onSubmit={(values) => this.submitForm(values)}
                  >
                    {(formik) => {
                      const { values, setFieldValue, handleChange, handleSubmit, handleBlur, isValid } = formik;
                      return (
                        <div>
                          <Form onSubmit={handleSubmit}>
                            <Row>
                              <Col xs={12} sm={6} md={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Weekly On</Label>
                                  <Select
                                    value={values.weekly}
                                    placeholder="Choose Day..."
                                    onChange={(e) => {
                                      setFieldValue("weekly", e);
                                      this.setState({ weekly: e.value });
                                    }}
                                    options={options}
                                  />
                                  <ErrorMessage
                                    name="weekly"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} sm={6} md={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Maximum Enroll Count</Label>
                                  <FormControl
                                    type="type"
                                    name="enrollstudent"
                                    id="enrollstudent"
                                    placeholder="Maximum Student Allowed"
                                    value={values.enrollstudent}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-styles"
                                  />
                                  <ErrorMessage
                                    name="enrollstudent"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Start Time</Label>
                                  <br />
                                  <KeyboardTimePicker
                                    variant="standard"
                                    className="start-time-style"
                                    style={{ paddingLeft: 10 }}
                                    placeholder="Select Start Time"
                                    helperText={""}
                                    InputProps={{
                                      disableUnderline: true,
                                    }}
                                    value={values.startTime}
                                    name="startTime"
                                    onChange={(e) => {
                                      setFieldValue("startTime", e);
                                      this.setState({ startTime: e });
                                      this.setEndTime(e, { setFieldValue });
                                    }}
                                    keyboardIcon={
                                      <FontAwesomeIcon icon={faClock} size="sm" color="grey" style={{ padding: 0 }} />
                                    }
                                  />
                                  <ErrorMessage
                                    name="startTime"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} sm={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>End Time</Label>
                                  <br />
                                  <FormControl
                                    variant="standard"
                                    disabled={true}
                                    className="start-time-style"
                                    style={{
                                      paddingLeft: 10,
                                      backgroundColor: "white",
                                    }}
                                    placeholder="Select End Time"
                                    helperText={""}
                                    InputProps={{
                                      disableUnderline: true,
                                    }}
                                    value={values.endTime}
                                    onChange={(time) => {
                                      setFieldValue("endTime", time);
                                    }}
                                    keyboardIcon={
                                      <FontAwesomeIcon icon={faClock} size="sm" color="grey" style={{ padding: 0 }} />
                                    }
                                  />
                                  <ErrorMessage
                                    name="endTime"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Time Zone</Label>
                                  <TimezoneSelect
                                    value={values.timeZone}
                                    placeholder="Select Time Zone"
                                    onChange={(e) => setFieldValue("timeZone", e.value)}
                                    timezones={{
                                      "America/Chicago": "Central Time",
                                    }}
                                  />
                                  <ErrorMessage
                                    name="timeZone"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} sm={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Start Date</Label>
                                  <br />
                                  <KeyboardDatePicker
                                    variant="standard"
                                    className="start-time-style"
                                    style={{ paddingLeft: 10 }}
                                    minDate={today}
                                    placeholder="Select Start Date"
                                    helperText={""}
                                    InputProps={{
                                      disableUnderline: true,
                                    }}
                                    format="MMM dd yyyy"
                                    value={values.startDate}
                                    onChange={(e) => {
                                      setFieldValue("startDate", e);
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
                                    name="startDate"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6} md={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label>Zoom Link</Label>
                                  <FormControl
                                    type="type"
                                    // name="zoomLink"
                                    id="zoomLink"
                                    placeholder="Zoom Link"
                                    value={values.zoomLink}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-styles"
                                  />
                                  <ErrorMessage
                                    name="zoomLink"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} sm={6} md={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label>Zoom Password</Label>
                                  <FormControl
                                    type="type"
                                    // name="zoomPassword"
                                    id="zoomPassword"
                                    placeholder="Zoom Password"
                                    value={values.zoomPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-styles"
                                  />
                                  <ErrorMessage
                                    name="zoomPassword"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6} md={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label>Teachers</Label>
                                  <Select
                                    value={values.teacherName}
                                    placeholder="Assign Teachers..."
                                    onChange={(e) => {
                                      if (e.label === "None") {
                                        setFieldValue("teacherName", null);
                                        this.setState({ teacherId: "" });
                                      } else {
                                        setFieldValue("teacherName", e);
                                        this.checkTeacherSchedule(e);
                                        this.setState({
                                          teacherName: e.name,
                                          teacherId: e.value,
                                          speciality: e.speciality,
                                        });
                                      }
                                    }}
                                    options={[
                                      { value: null, label: "None" },
                                      {
                                        options: teacherList.map((list) => ({
                                          value: list.id,
                                          label: (
                                            <div className="d-flex justify-content-start align-items-center">
                                              <Avatar round size="38" className="d-flex justify-content-center">
                                                <p className="dropdown-option mb-0">
                                                  {list?.firstName.substring(0, 1)}
                                                  {list.middleName
                                                    ? list?.middleName.substring(0, 1)
                                                    : list?.lastName.substring(0, 1)}
                                                </p>
                                              </Avatar>
                                              <div className="dropdown-names">
                                                {`${list.firstName + " " + list.middleName + " " + list.lastName}`}
                                              </div>
                                            </div>
                                          ),
                                          name: ` ${list.firstName} ${list.middleName} ${list.lastName}`,
                                          speciality: `${list.speciality}`,
                                        })),
                                      },
                                    ]}
                                  />
                                  <ErrorMessage
                                    name="teacherName"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-3">
                              <Button
                                type="submit"
                                fullWidth
                                disabled={!isValid || isSubmit}
                                variant="contained"
                                className={`${!isValid || this.state.isSubmit ? "create-disable" : "create-active"}`}
                              >
                                CREATE
                              </Button>
                            </div>
                          </Form>
                        </div>
                      );
                    }}
                  </Formik>
                </Col>
              </Row>
            </Container>
          </MuiPickersUtilsProvider>
        )}
      </div>
    );
  }
}
