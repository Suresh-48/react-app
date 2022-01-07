import React, { useState, useRef, useEffect } from "react";
import { Overlay, Tooltip } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from "react-dom";
import moment from "moment-timezone";

// Component
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

// Styles
import "../../css/Calendar.scss";

const localizer = momentLocalizer(moment);

function CalendarView(props) {
  const [teacherId, setteacherId] = useState(props?.location?.state?.rowData?.id);
  const [schedule, setschedule] = useState([]);
  const [isLoading, setisLoading] = useState(true);

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
    getAvailabilityList();
  }, []);

  return (
    <div className="pt-1">
      {isLoading ? (
        <Loader />
      ) : (
        <Calendar
          tooltipAccessor={null}
          components={{ event: Event }}
          selectable={true}
          localizer={localizer}
          events={schedule}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: "50px" }}
        />
      )}
    </div>
  );
}

export default CalendarView;
