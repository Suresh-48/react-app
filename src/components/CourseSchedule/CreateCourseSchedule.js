import React, { Component } from "react";
import { Container, Row, Col, FormControl, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Select from "react-select";
import TimezonePicker from "react-bootstrap-timezone-picker";
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
import { customStyles } from "../core/Selector.js";

// Validation
const courseScheduleSchema = Yup.object().shape({
  weekly: Yup.string().required("Day Is Required"),

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
      teacherNameSelect: "",
      teacherId: null,
      speciality: "",
      lessonLength: [],
      enrollstudent: "",
    };
  }
  // Log out
  logout = () => {
    setTimeout(() => {
      localStorage.clear(this.props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  componentDidMount() {
    this.getCourseData();
    this.getApprovedTeacher();
    this.getLessonData();
  }

  // Get Course Data
  getCourseData = () => {
    const token = localStorage.getItem("sessionId");
    Api.get(`api/v1/course/${this.state.courseId}`, { headers: { token: token } })
      .then((res) => {
        const data = res.data.data;
        this.setState({
          duration: data?.duration,
          isLoading: false,
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

  getLessonData = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/courseLesson/lessonlist", {
      params: {
        courseId: this.state.courseId,
        token: token,
      },
    })
      .then((response) => {
        const lessonList = response.data.lessonList.length;
        this.setState({ lessonLength: lessonList });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Get Approved  Teachers
  getApprovedTeacher = () => {
    const token = localStorage.getItem("sessionId");
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
    const token = localStorage.getItem("sessionId");
    Api.get(`/api/v1/courseSchedule/check/teacherSchedule`, {
      params: {
        teacherId: teacherId,
        startDate: dateValue,
        startTime: startTimeValue,
        token: token,
      },
    })
      .then((response) => {
        const status = response.status;
        if (status === 208) {
          toast.warning(response.data.message);
          this.setState({ isSubmit: false });
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
  // Submit form
  submitForm = (values) => {
    const token = localStorage.getItem("sessionId");
    this.setState({ isSubmit: true });
    const startTimeValue = moment(values.startTime, "LLLL").format("LT");
    const startDate = this.state.startDate;

    const dateValue = moment(startDate).format("ll");
    //  const teacherName = name?.split("(")[0];
    if (this.state.lessonLength === 0) {
      toast.error("Without creating lesson schedule can't be created");
      this.setState({ isSubmit: false });
    } else {
      Api.post("/api/v1/courseSchedule/createSchedule", {
        courseId: this.state.courseId,
        weeklyOn: this.state.weekly,
        startTime: startTimeValue,
        timeZone: values.timeZone,
        endTime: values.endTime,
        totalStudentEnrolled: values.enrollstudent,
        startDate: dateValue,
        teacherName: this.state.teacherName,
        teacherId: this.state.teacherId ? this.state.teacherId : values.teacherId,
        speciality: this.state.speciality,
        token: token,
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            Api.post("api/v1/teacherUpcomingSchedule", {
              courseScheduleId: response.data.scheduleDetails.id,
              teacherId: this.state.teacherId,
              token: token,
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
          const errorStatus = error?.response?.status;
          if (errorStatus === 401) {
            this.logout();
            toast.error("Session Timeout");
          }
          this.setState({ isSubmit: false });
        });
    }
  };

  // Set End Time
  setEndTime = (e, { setFieldValue }) => {
    var hours = e.getHours() + 1;
    var minutes = e.getMinutes();
    hours = hours % 24;
    var strTime = hours + ":" + minutes;
    const endTimeValue = moment(strTime, "hh:mm").format("LT");
    this.setState({ endTime: endTimeValue });
    setFieldValue("endTime", endTimeValue);
    return strTime;
  };

  // Date Format
  setDateFormat = (e, setFieldValue) => {
    const startTimeValue = moment(e).format("LLLL");
    this.setState({ startDate: startTimeValue });
    const dayValue = moment(e).format("dddd");
    this.setState({ weekly: dayValue });
    setFieldValue("weekly", dayValue);
    this.setState({ weekly: dayValue });
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
                  <h5 className="mb-3 text-center">Course schedule create</h5>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      weekly: this.state.weekly,
                      startTime: this.state.startTime,
                      endTime: this.state.endTime,
                      enrollstudent: this.state.enrollstudent,
                      timeZone: "America/Chicago",
                      startDate: this.state.startDate,
                      teacherName: this.state.teacherNameSelect,
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
                                      this.setDateFormat(e, setFieldValue);
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
                              <Col xs={12} sm={6} md={6}>
                                {" "}
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Weekly On</Label>
                                  <FormControl
                                    type="text"
                                    id="weekly"
                                    disabled={true}
                                    placeholder="weekly on"
                                    value={this.state.weekly}
                                    onChange={(e) => {
                                      setFieldValue("weekly", e);
                                    }}
                                    className="form-styles"
                                  />
                                  <ErrorMessage
                                    name="weekly"
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
                                    value={this.state.endTime}
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
                                {" "}
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Maximum Enroll Count</Label>
                                  <FormControl
                                    type="type"
                                    name="enrollstudent"
                                    id="enrollstudent"
                                    placeholder="Maximum Student Allowed"
                                    value={this.state.enrollstudent}
                                    onChange={(e) => {
                                      setFieldValue("enrollstudent", e.target.value);
                                      this.setState({ enrollstudent: e.target.value });
                                    }}
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
                              <Col xs={12} sm={6}>
                                <Form.Group className="form-row mb-3">
                                  <Label notify={true}>Time Zone</Label>
                                  <br />
                                  <TimezonePicker
                                    absolute={true}
                                    value={values.timeZone}
                                    placeholder="Select timezone..."
                                    onChange={(e) => setFieldValue("timeZone", e)}
                                    disabled
                                  />
                                  <ErrorMessage
                                    name="timeZone"
                                    component="span"
                                    className="error text-danger error-message"
                                  />
                                </Form.Group>{" "}
                              </Col>
                            </Row>

                            <Row>
                              <Col>
                                <Form.Group className="form-row mb-3">
                                  <Label>Teachers</Label>
                                  <Select
                                    value={this.state.teacherNameSelect}
                                    placeholder="Assign Teachers..."
                                    styles={customStyles}
                                    onChange={(e) => {
                                      if (e.label === "None") {
                                        setFieldValue("teacherName", null);
                                        this.setState({ teacherId: "" });
                                      } else {
                                        setFieldValue("teacherName", e);
                                        this.setState({ teacherNameSelect: e });
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
                                            <div>
                                              {list.imageUrl ? (
                                                <div className="d-flex justify-content-start align-items-center">
                                                  <Avatar src={list.imageUrl} alt="" round={true} />
                                                  <div className="dropdown-names">
                                                    {`${list.firstName +
                                                      " " +
                                                      list.middleName +
                                                      " " +
                                                      list.lastName +
                                                      " "}`}
                                                  </div>
                                                </div>
                                              ) : (
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
                                                    {`${list.firstName +
                                                      " " +
                                                      list.middleName +
                                                      " " +
                                                      list.lastName +
                                                      " "}`}
                                                  </div>
                                                </div>
                                              )}
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
                            <div style={{ display: "flex", justifyContent: "flex-end" }} className="mb-3 mt-5">
                              <div className="d-flex">
                                <Button
                                  className="Kharpi-cancel-btn me-3 px-4 py-3"
                                  onClick={() => this.props.history.goBack()}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  disabled={!isValid || isSubmit}
                                  variant="contained"
                                  className={`${!isValid || this.state.isSubmit ? "create-disable" : "create-active"}`}
                                >
                                  CREATE SCHEDULE
                                </Button>
                              </div>
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
