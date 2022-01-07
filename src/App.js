import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ToastContainer } from "react-toastify";

// ReactToastify CSS
import "react-toastify/dist/ReactToastify.min.css";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// History
import history from "./history";

//containers
import PublicLayout from "./container/PublicLayout/PublicLayout";

// Home
import Home from "./components/Home";

// Landing Page
import LandingPage from "./components/LandingPage";

// SetPassword
import SetPassword from "./components/SetPassword";

// Reset Password
import ResetPassword from "./components/ResetPassword";

// Parent Signup
import ParentSignup from "./components/ParentSignup";

// Student Signup
import StudentSignup from "./components/StudentSignup";

// Admin Login
import AdminLogin from "./components/AdminLogin";

// Login
import Login from "./components/Login";

//Parent
import EditParentDetails from "./components/EditParentDetails";

//Student
import EditStudentDetails from "./components/EditStudentDetails";

//Parents List
import ParentsList from "./components/ParentsList";

import ParentDashboard from "./components/Dashboard/ParentDashboard";

import StudentDashboard from "./components/Dashboard/StudentDashboard";

import EditCourses from "./components/EditCourses";

import CourseList from "./components/CourseList";

import Dashboard from "./components/Dashboard";

import StudentList from "./components/StudentList";

import CourseCheckout from "./components/CourseCheckout";

import CourseDetail from "./components/Courses/CourseDetail";

// Page 404
import Page404 from "./components/Page404";

import ParentStudent from "./components/ParentStudent/index";

//All Course List With Filter Option
import AllCourseList from "./components/CourseList/AllCourseList";

// student details
import StudentDetails from "./components/StudentDetails";

// About Us
import AboutUs from "./components/AboutUs";

// Help
import Help from "./components/Help";

// Course Category
import CourseCategory from "./components/CourseCategory";

// Course Creation
import CoursesCreation from "./components/Courses/CourseCreation";

//course Lesson
import CourseLesson from "./components/CourseLesson";

import CreateCourseLessons from "./components/CourseLesson/CreateCourseLessons";
import EditCourseLessons from "./components/CourseLesson/EditCourseLessons";
// Course Schedule
import CourseSchedule from "./components/CourseSchedule";

// Create Course Schedule
import CreateCourseSchedule from "./components/CourseSchedule/CreateCourseSchedule";

// Edit Course Schedule
import EditCourseSchedule from "./components/CourseSchedule/EditCourseSchedule";

//Edit Admin Details
import EditAdminDetails from "./components/EditAdminDetails";

import TeacherSignup from "./components/TeacherSignup";

// Course Menu
import CourseSideMenu from "./components/CourseSideMenu";

// Parent Upcoming Schedule For All Student  and Student Upcoming List
import UpcomingSchedule from "./components/UpcomingSchedule";

import AdminPaymentList from "./components/AdminPaymentList";

//Edit Teacher Detail
import EditTeacherDetails from "./components/EditTeacherDetails";

import TeacherList from "./components/TeacherList";

import AdminStudentsList from "./components/AdminStudentsList";

// Admin Upcoming Schedule List For Student
import UpcomingScheduleList from "./components/UpcomingScheduleList";

import TeacherPublicProfile from "./components/TeacherPublicProfile";

import UpcomingTeacherScheduleList from "./components/UpcomingTeacherScheduleList";

// Admin Create Quiz
import CreateQuiz from "./components/CreateQuiz";

// Admin Create HomeWork
import CreateHomeWork from "./components/CreateHomeWork";

// Quiz List Page
import ListOfQuiz from "./components/ListOfQuiz";

// HomeWork List Page
import HomeWorkListTable from "./components/HomeWorkListTable";

// Quiz
import Quiz from "./components/Quiz";

//Quiz Preview
import QuizPreview from "./components/QuizPreview";

// HomeWork
import HomeWork from "./components/HomeWork";

//Quiz Review
import TeacherQuizReview from "./components/TeacherQuizReview";

//Homework Review
import TeacherHomeworkReview from "./components/TeacherHomeworkReview";

//HomeWork Preview
import HomeWorkPreview from "./components/HomeWorkPreview";

// Home Work Answer
import HomeWorkAnswer from "./components/HomeWorkAnswer";

//Teacher Course List
import TeacherCourseList from "./components/TeacherCourseList";

// Admin Quiz
import AdminQuiz from "./components/AdminQuizAndHomework/AdminQuiz";

// Admin Home work
import AdminHomework from "./components/AdminQuizAndHomework/AdminHomework";

// Quiz Review for Teacher
import QuizReview from "./components/QuizReview";

// Admin Can View Teacher Not Availablility List in Calendar View
import CalendarView from "./components/CalendarView";

// Teacher Application
import TeacherApplicationForm from "./components/TeacherApplicationForm";

// Teacher Available
import TeacherAvailable from "./components/TeacherAvailable";

// Student List For Each Class
import EachClassStudentList from "./components/EachClassStudentList";

//Completed Course List
import CompletedCourseList from "./components/CompletedCourseList";

// Corse History
import CourseHistory from "./components/CourseHistory";

//Student Transcript
import StudentTranscript from "./components/StudentTranscript";

//Admin Can View Student Upcoming Schedule List
import AdminStudentUpcomingScheduleList from "./components/AdminStudentUpcomingScheduleList";

// Edit Quiz
import EditQuiz from "./components/CreateQuiz/EditQuiz";

// Edit Home Work
import EditHomeWork from "./components/CreateHomeWork/EditHomeWork";

function App() {
  return (
    <div>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={true}
        pauseOnHover={false}
        toastClassName="toastRequestSuccess"
        bodyClassName="toastBody"
        closeButton={false}
      />
      <Router history={history}>
        <Switch>
          <PublicLayout exact name="Login" path="/login" component={Login} />

          <Route exact path="/" component={Home}>
            <Redirect to="/login" />
          </Route>

          <PublicLayout exact name="Dashboard" path="/dashboard" component={Dashboard} />

          {/* <Route exact path="/dashboard" component={Dashboard} /> */}

          <PublicLayout exact name="ParentDashboard" path="/parent-dashboard" component={ParentDashboard} />

          <PublicLayout exact name="StudentDashboard" path="/student-dashboard" component={StudentDashboard} />

          <PublicLayout exact name="AdminLogin" path="/admin-login" component={AdminLogin} />

          <PublicLayout exact name="LandingPage" path="/landing-page" component={LandingPage} />

          <PublicLayout exact name="Course Creation" path="/course/add" component={CoursesCreation} />

          <PublicLayout exact name="SetPassword" path="/set-password" component={SetPassword} />

          <PublicLayout exact name="ResetPassword" path="/reset-password" component={ResetPassword} />

          <Route path="/parent/signup" component={ParentSignup} />

          <Route path="/student/signup" component={StudentSignup} />

          <PublicLayout exact name="EditParentDetails" path="/edit-parent-details" component={EditParentDetails} />

          <PublicLayout exact name="TeacherList" path="/teacher/list" component={TeacherList} />

          <PublicLayout
            exact
            name="EditStudentDetails"
            path="/edit/student/details/:id"
            component={EditStudentDetails}
          />

          <PublicLayout exact name="EditAdminDetails" path="/admin/details" component={EditAdminDetails} />

          <PublicLayout exact name="ParentsList" path="/parents/list" component={ParentsList} />

          <PublicLayout exact name="EditCourses" path="/course/edit/:id" component={EditCourses} />

          <PublicLayout exact name="CourseList" path="/course/list" component={CourseList} />

          <PublicLayout exact name="StudentList" path="/student/list/:id" component={StudentList} />

          <PublicLayout exact name="CourseCheckout" path="/course/checkout/:name" component={CourseCheckout} />

          <PublicLayout exact name="CourseCategory" path="/course/category" component={CourseCategory} />

          <PublicLayout exact name="CourseDetail" path="/course/detail/:id" component={CourseDetail} />

          <PublicLayout exact name="AllCourseList" path="/course/search" component={AllCourseList} />

          <PublicLayout exact name="StudentDetails" path="/student/detail/:id" component={StudentDetails} />

          <PublicLayout exact name="Page404" path="/page404" component={Page404} />

          <PublicLayout exact name="ParentStudent" path="/parent/student" component={ParentStudent} />

          <PublicLayout exact name="Help" path="/help" component={Help} />

          <PublicLayout exact name="About Us" path="/about-us" component={AboutUs} />

          <PublicLayout exact name="Forgot Password" path="/forgot/password" component={ResetPassword} />

          <PublicLayout exact name="CourseLesson" path="/course/lesson" component={CourseLesson} />

          <PublicLayout exact name="CreateCourseLessons" path="/course/lesson/add" component={CreateCourseLessons} />

          <PublicLayout exact name="CourseSchedule" path="/course/schedule" component={CourseSchedule} />

          <PublicLayout exact name="About Us" path="/about-us" component={AboutUs} />

          <PublicLayout exact name="CourseLesson" path="/course/lesson" component={CourseLesson} />

          <PublicLayout exact name="EditCourseLessons" path="/course/lesson/edit/:id" component={EditCourseLessons} />

          <PublicLayout exact name="CourseSchedule" path="/course/schedule" component={CourseSchedule} />

          <PublicLayout
            exact
            name="CreateCourseSchedule"
            path="/course/schedule/add"
            component={CreateCourseSchedule}
          />

          <PublicLayout exact name="EditCourseSchedule" path="/course/schedule/update" component={EditCourseSchedule} />

          <PublicLayout exact name="TeacherSignup" path="/teacher/signup" component={TeacherSignup} />

          <PublicLayout exact name="CourseSideMenu" path="/courses/edit" component={CourseSideMenu} />

          <PublicLayout exact name="Upcoming Schedule" path="/upcoming/schedule" component={UpcomingSchedule} />

          <PublicLayout exact name="EditTeacherDetails" path="/teacher/edit/:id" component={EditTeacherDetails} />

          <PublicLayout exact name="Admin Payment List" path="/payment/list" component={AdminPaymentList} />

          <PublicLayout exact name="Admin Students List" path="/students/list" component={AdminStudentsList} />

          <PublicLayout
            exact
            name="Upcoming Schedule List"
            path="/upcoming/schedule/:id"
            component={UpcomingScheduleList}
          />
          <PublicLayout
            exact
            name="Teacher Public Profile"
            path="/teacher/profile/public"
            component={TeacherPublicProfile}
          />

          <PublicLayout
            exact
            name="Upcoming Teacher Schedule List"
            path="/upcoming/teacher/schedule/list"
            component={UpcomingTeacherScheduleList}
          />

          <PublicLayout exact name="CreateQuiz" path="/quiz/add/:id" component={CreateQuiz} />
          <PublicLayout exact name="CreateHomeWork" path="/homework/add/:id" component={CreateHomeWork} />

          <PublicLayout exact name="ListOfQuiz" path="/test/link" component={ListOfQuiz} />

          <PublicLayout exact name="HomeWorkListTable" path="/homework/link" component={HomeWorkListTable} />

          <PublicLayout exact name="Quiz" path="/quiz" component={Quiz} />

          <PublicLayout exact name="TeacherQuizReview" path="/teacher/review/quiz" component={TeacherQuizReview} />

          <PublicLayout
            exact
            name="TeacherApplicationForm"
            path="/teacher/application/form"
            component={TeacherApplicationForm}
          />

          <PublicLayout
            exact
            name="TeacherHomeworkReview"
            path="/teacher/review/homework"
            component={TeacherHomeworkReview}
          />

          <PublicLayout exact name="QuizPreview" path="/quiz/preview" component={QuizPreview} />

          <PublicLayout exact name="HomeWork" path="/homework" component={HomeWork} />

          <PublicLayout exact name="HomeWorkPreview" path="/homework/preview" component={HomeWorkPreview} />

          <PublicLayout exact name="HomeWorkAnswer" path="/homework/answers" component={HomeWorkAnswer} />

          <PublicLayout exact name="TeacherCourseList" path="/teacher/schedule/:id" component={TeacherCourseList} />
          <PublicLayout exact name="AdminQuiz" path="/admin/quiz" component={AdminQuiz} />
          <PublicLayout exact name="AdminHomework" path="/admin/homework" component={AdminHomework} />
          <PublicLayout exact name="QuizReview" path="/quiz/review" component={QuizReview} />
          <PublicLayout exact name="CalendarView" path="/teacher/not-available" component={CalendarView} />
          <PublicLayout exact name="TeacherAvailable" path="/not-available/time" component={TeacherAvailable} />
          <PublicLayout
            exact
            name="EachClassStudentList"
            path="/class/student/list/:id"
            component={EachClassStudentList}
          />
          <PublicLayout
            exact
            name="CompletedCourseList"
            path="/completed/course/list"
            component={CompletedCourseList}
          />
          <PublicLayout exact name="CourseHistory" path="/course/history" component={CourseHistory} />
          <PublicLayout exact name="StudentTranscript" path="/student/transcript/:id" component={StudentTranscript} />
          <PublicLayout
            exact
            name="AdminStudentUpcomingScheduleList"
            path="/upcoming/schedule/list/:id"
            component={AdminStudentUpcomingScheduleList}
          />
          <PublicLayout exact name="EditQuiz" path="/quiz/edit" component={EditQuiz} />
          <PublicLayout exact name="EditHomeWork" path="/homework/edit" component={EditHomeWork} />
          {/* <Route path="/course/:id" component={Home} />

          <Route path="/course/add" component={Home} />

          <Route path="/course/edit/:id" component={Home} /> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
