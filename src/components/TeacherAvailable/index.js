import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Row, Form, Col, Overlay, Tooltip, FormControl } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Button from "@restart/ui/esm/Button";
import { Formik } from "formik";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import ReactDOM from "react-dom";
import moment from "moment-timezone";

// Component
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

// Styles
import "../../css/Calendar.scss";

const localizer = momentLocalizer(moment);

function TeacherAvailable(props) {
  const [teacherId, setteacherId] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "Not Available",
    start: "",
    end: "",
  });
  const [titleValue, settitleValue] = useState({
    value: "Not Available",
    label: "Not Available",
  });
  const [schedule, setschedule] = useState([]);
  const [Open, setOpen] = useState(false);
  const [show, setshow] = useState(false);
  const [isSubmit, setisSubmit] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  // Onchange value
  function handleSelect({ start, end }) {
    setNewEvent({ start, end });
    setOpen(true);
  }

  // Close Modal Popup
  function handleClose() {
    setOpen(false);
  }

  // Overlay for tooltip
  function Event(event) {
    const [showTooltip, setShowTooltip] = useState(false);

    const closeTooltip = () => {
      setShowTooltip(!showTooltip);
    };
    const openTooltip = () => {
      setShowTooltip(!showTooltip);
    };
    const ref = useRef(null);

    const getTarget = () => {
      return ReactDOM.findDOMNode(ref.current);
    };

    const eventData = event.event;

    return (
      <div ref={ref}>
        <span onMouseEnter={openTooltip} onMouseLeave={closeTooltip}>
          {event.title}
        </span>
        <Overlay rootClose target={getTarget} show={showTooltip} placement="top">
          <Tooltip id="test">
            <span>
              <div>{eventData.title}</div>
            </span>
          </Tooltip>
        </Overlay>
      </div>
    );
  }

  // get Teacher availability list
  const getAvailabilityList = () => {
    const teacherId = localStorage.getItem("teacherId");
    Api.get(`api/v1/teacherAvailability/list`, {
      params: {
        teacherId: teacherId,
      },
    }).then((response) => {
      const scheduleValue = response.data.data.availabilityList;
      setschedule(scheduleValue);
      for (let i = 0; i < scheduleValue.length; i++) {
        scheduleValue[i].start = moment.utc(scheduleValue[i].start).toDate();
        scheduleValue[i].end = moment.utc(scheduleValue[i].end).toDate();
      }
      setisLoading(false);
    });
  };

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    setteacherId(teacherId);
    getAvailabilityList();
  }, []);

  // Conformation Alert
  function alertConformation() {
    setshow(true);
    setOpen(false);
  }

  function closeShow() {
    setshow(false);
  }

  // Submit form
  function submitForm() {
    setshow(false);
    setisSubmit(true);
    setisLoading(true);
    const startTime = moment(newEvent.start).format("LT");
    const endTime = moment(newEvent.end).format("LT");
    const title = `${titleValue.value}(${startTime}-${endTime})`;
    Api.post(`api/v1/teacherAvailability`, {
      teacherId: teacherId,
      startTime: startTime,
      endTime: endTime,
      start: newEvent.start,
      end: newEvent.end,
      title: title,
    }).then((response) => {
      setOpen(false);
      setisSubmit(false);
      getAvailabilityList();
    });
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pt-1">
          <Calendar
            tooltipAccessor={null}
            components={{ event: Event }}
            selectable={true}
            localizer={localizer}
            events={schedule}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={(event) => handleSelect(event)}
            style={{ height: 500, margin: "50px" }}
          />
          <Modal show={Open} backdrop="static" centered>
            <Modal.Body>
              <Row className="my-4 mx-2">
                <h5 className="d-flex justify-content-center align-items-center mb-4">NOT AVAILABLE</h5>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    titleValue: {
                      value: "Not Available",
                      label: "Not Available",
                    },
                    start: "",
                    end: "",
                  }}
                  onSubmit={(values) => alertConformation()}
                >
                  {(formik) => {
                    const { handleSubmit, setFieldValue, handleChange, handleBlur } = formik;
                    return (
                      <div>
                        <Form className="category-form-style" onSubmit={handleSubmit}>
                          <Row className="mt-1">
                            <Col sm={12}>
                              <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                                <Form.Label notify={true} className="label-top">
                                  Not Available
                                </Form.Label>
                                <FormControl
                                  type="type"
                                  name="notavailable"
                                  disabled="true"
                                  value={titleValue.value}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="form-width"
                                />
                              </Form.Group>
                            </Col>
                            <Col sm={12}>
                              <Form.Group className="form-row mb-3">
                                <Form.Label notify={true} className="label-top">
                                  Start Date
                                </Form.Label>
                                <DatePicker
                                  className="picker-input"
                                  showTimeSelect
                                  dateFormat="dd-MM-yyyy hh:mm a"
                                  placeholderText="Start Date"
                                  selected={newEvent.start}
                                  onChange={(start) => {
                                    setFieldValue("start", start);
                                    setNewEvent({ ...newEvent, start });
                                  }}
                                />
                              </Form.Group>
                            </Col>
                            <Col sm={12}>
                              <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                                <Form.Label notify={true} className="label-top">
                                  End Date
                                </Form.Label>
                                <DatePicker
                                  showTimeSelect
                                  dateFormat="dd-MM-yyyy hh:mm a"
                                  placeholderText="End Date"
                                  className="picker-input"
                                  selected={newEvent.end}
                                  onChange={(end) => {
                                    setFieldValue("end", end);
                                    setNewEvent({ ...newEvent, end });
                                  }}
                                />
                              </Form.Group>
                            </Col>
                            <div className="d-flex justify-content-end mt-2">
                              <Button
                                className="cancel-button"
                                variant="contained"
                                color="#fff"
                                style={{ width: "100%", borderRadius: 5 }}
                                onClick={() => handleClose()}
                              >
                                Close
                              </Button>
                              <Button
                                className="ms-2 submit-button"
                                variant="contained"
                                disabled={isSubmit}
                                onClick={handleSubmit}
                              >
                                Submit
                              </Button>
                            </div>
                          </Row>
                        </Form>
                      </div>
                    );
                  }}
                </Formik>
              </Row>
            </Modal.Body>
          </Modal>
          <Modal show={show} centered className="modal-main-content" onHide={() => closeShow()}>
            <Modal.Body id="contained-modal-title-vcenter">
              <div className="delete-content my-4">
                <div className="mb-2">
                  <h6 className="alert-text">Are You Sure want to add Not Available Time,</h6>
                  <br />
                  <p className="d-flex justify-content-center">This can't be Changed Or Delete in Future</p>
                </div>
                <Row>
                  <Col>
                    <Button className="delete-cancel" variant="light" onClick={() => closeShow()}>
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <Button className="confirmation-button" variant="light" onClick={() => submitForm()}>
                      Submit
                    </Button>
                  </Col>
                </Row>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default TeacherAvailable;
