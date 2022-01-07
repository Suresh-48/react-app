import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Style
import "../../css/CourseMenu.scss";

const CourseSideMenu = (props) => {
  const [courseId, setcourseId] = useState(props.courseId);
  const [lessonId, setlessonId] = useState(props.lessonId);

  return (
    <div>
      {courseId && lessonId ? (
        <div className="sidenav">
          <NavLink
            exact
            to={{
              pathname: `/course/lesson/edit/${lessonId}`,
              state: { lessonId: lessonId, courseId: courseId },
            }}
            activeClassName="main-nav-active"
          >
            Edit Lesson
          </NavLink>
          <NavLink
            exact
            to={{
              pathname: `/quiz/add/${lessonId}`,
              state: {
                lessonId: lessonId,
                courseId: courseId,
              },
            }}
            activeClassName="main-nav-active"
          >
            Quiz
          </NavLink>
          <NavLink
            exact
            to={{
              pathname: `/homework/add/${lessonId}`,
              state: {
                lessonId: lessonId,
                courseId: courseId,
              },
            }}
            activeClassName="main-nav-active"
          >
            Home Work
          </NavLink>
        </div>
      ) : (
        <div className="sidenav">
          <NavLink
            exact
            to={{
              pathname: `/course/edit/${courseId}`,
              state: { courseId: courseId },
            }}
            activeClassName="main-nav-active"
          >
            Edit
          </NavLink>
          <NavLink
            exact
            to={{
              pathname: `/course/lesson`,
              state: { courseId: courseId },
            }}
            activeClassName="main-nav-active"
          >
            Lesson
          </NavLink>
          <NavLink
            exact
            to={{
              pathname: "/course/schedule",
              state: { courseId: courseId },
            }}
            activeClassName="main-nav-active"
          >
            Schedule
          </NavLink>
        </div>
      )}
    </div>
  );
};
export default CourseSideMenu;
