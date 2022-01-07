import React, { Component } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Select from "react-select";
import TimezoneSelect from "react-timezone-select";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { KeyboardTimePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// Api
import Api from "../../Api.js";

// Component
import Loader from "../core/Loader";
import Label from "../../components/core/Label";

// Styles
import "../../css/CreateCourseSchedule.scss";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";

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

  // teacherName: Yup.object().required("Required Field").nullable(),

  timeZone: Yup.string().required("Time Zone Is Required"),
});

const options = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
];

export default class EditCourseSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      endTime: "",
      isLoading: true,
      courseName: this.props?.location?.state?.courseId?.name,
      courseScheduleId: this.props?.location?.state?.id,
      details: [],
      timeZone: "",
      weekly: "",
      time: "",
      weeklyId: "",
      isSubmit: "",
      startDate: "",
      teacherList: [],
      teacherName: "",
      teacherId: null,
      teacherNameValue: "",
    };
  }

  //get course schedule data
  getCourseScheduleData = () => {
    const { courseScheduleId } = this.state;
    Api.get(`/api/v1/courseSchedule/get/schedule`, {
      params: {
        courseScheduleId: courseScheduleId,
      },
    }).then((res) => {
      const data = res.data.scheduleOne;
      const dateFormat = moment(data.startTime, ["LT"]).format("LLLL");
      this.setState({
        details: data,
        startTime: dateFormat,
        timeZone: data.timeZone,
        isLoading: false,
        weekly: { value: data.weeklyOn, label: data.weeklyOn },
        weeklyId: data.weeklyOn,
        startDate: data.startDate,
        teacherNameValue: data?.teacherId?._id,
        teacherName: data?.teacherId?._id
          ? {
              value: data?.teacherId?._id,
              label: (
                <div className="d-flex justify-content-start align-items-center">
                  <Avatar round size="38" className="d-flex justify-content-center">
                    <p className="dropdown-option mb-0">
                      {data?.teacherId?.firstName.substring(0, 1)}
                      {data?.teacherId?.middleName
                        ? data?.teacherId?.middleName.substring(0, 1)
                        : data?.teacherId?.lastName.substring(0, 1)}
                    </p>
                  </Avatar>
                  <div className="dropdown-names">
                    {`${
                      data?.teacherId?.firstName +
                      " " +
                      data?.teacherId?.middleName +
                      " " +
                      data?.teacherId?.lastName +
                      " "
                    }`}
                  </div>
                </div>
              ),
            }
          : "",
        teacherId: data?.teacherId?._id ? data?.teacherId?._id : null,
      });
    });
  };

  componentDidMount() {
    this.getCourseScheduleData();
    this.getApprovedTeacher();
  }

  // End Time
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
    const startTimeValue = moment(e).format("LLLL");
    this.setState({ startDate: startTimeValue });
  };
  // Get Approved  Teachers
  getApprovedTeacher = () => {
    Api.get(`api/v1/teacher/list`).then((res) => {
      const data = res.data.teacherList;
      this.setState({ teacherList: data, isLoading: false });
    });
  };
  // Submit form
  submitForm = (values) => {
    this.setState({ isSubmit: true });
    const { courseScheduleId, startDate } = this.state;
    const startTimeFormat = moment(values.startTime, "LLLL").format("LT");
    const dateValue = moment(startDate).format("ll");
    Api.patch(`/api/v1/courseSchedule/${courseScheduleId}`, {
      courseId: this.state.details.courseId,
      weeklyOn: this.state.weeklyId,
      startTime: startTimeFormat,
      endTime: values.endTime,
      timeZone: values.timeZone,
      totalStudentEnrolled: values.enrollstudent,
      zoomId: values.zoomLink,
      zoomPassword: values.zoomPassword,
      startDate: dateValue,
      teacherName: this.state.teacherNameValue,
      teacherId: this.state.teacherId,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          this.setState({ isSubmit: false });
          Api.post("api/v1/teacherUpcomingSchedule", {
            courseScheduleId: courseScheduleId,
            teacherId: this.state.teacherId,
          });
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

  render() {
    const { details, isLoading, isSubmit, courseName, teacherList } = this.state;
    const today = new Date();
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div>
          {isLoading ? (
            <Loader />
          ) : (
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div className="mb-4">
                    <h4>{courseName}</h4>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      weekly: this.state.weekly,
                      startTime: this.state.startTime,
                      endTime: details.endTime,
                      timeZone: "America/Chicago",
                      enrollstudent: details.totalStudentEnrolled,
                      zoomLink: details.zoomId,
                      zoomPassword: details.zoomPassword,
                      teacherName: this.state.teacherName !== "" ? this.state.teacherName : "",
                    }}
                    validationSchema={courseScheduleSchema}
                    onSubmit={(values) => this.submitForm(values)}
                  >
                    {(formik) => {
                      const { values, handleChange, handleSubmit, setFieldValue, handleBlur, isValid } = formik;
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
                                      this.setState({
                                        weekly: e,
                                        weeklyId: e.value,
                                      });
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
                                    onChange={(e) => {
                                      setFieldValue("startTime", e);
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
                                    value={this.state.startDate}
                                    onChange={(e) => {
                                      setFieldValue("startDate", e);
                                      this.setDateFormat(e);
                                    }}
                                    keyboardIcon={
                                      <FontAwesomeIcon icon={faClock} size="sm" color="grey" style={{ padding: 0 }} />
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
                                        this.setState({
                                          teacherId: null,
                                        });
                                      } else {
                                        setFieldValue("teacherName", e);
                                        this.setState({
                                          teacherName: e,
                                          teacherNameValue: e.name,
                                          teacherId: e.value,
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
                                                {`${
                                                  list.firstName + " " + list.middleName + " " + list.lastName + " "
                                                }`}
                                              </div>
                                            </div>
                                          ),
                                          name: ` ${list.firstName} ${list.middleName} ${list.lastName}`,
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
                                className={`${
                                  !isValid || this.state.isSubmit ? "save-changes-disable" : "save-changes-active"
                                }`}
                              >
                                SAVE CHANGES
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
          )}
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}
