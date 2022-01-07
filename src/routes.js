// User
import Login from "./components/Login";

// Home
import Home from "./components/Home";

// Home
import Dashboard from "./components/Dashboard";

// About Us
import AboutUs from "./components/AboutUs";

// Help
import Help from "./components/Help";

// Parent Dashboard
import ParentDashboard from "./components/Dashboard/ParentDashboard";

// Student Dashboard
import StudentDashboard from "./components/Dashboard/StudentDashboard";

// Admin Login
import AdminLogin from "./components/AdminLogin";

// Landing Page
import LandingPage from "./components/LandingPage";

// Set Password
import SetPassword from "./components/SetPassword";

// Reset Password
import ResetPassword from "./components/ResetPassword";

// Parent Signup
import ParentSignup from "./components/ParentSignup";

// Student Signup
import StudentSignup from "./components/StudentSignup";

// Edit Parent Details
import EditParentDetails from "./components/EditParentDetails";

// Edit Student Details
import EditStudentDetails from "./components/EditStudentDetails";

// Parent List
import ParentsList from "./components/ParentsList";

// Edit Courses
import EditCourses from "./components/EditCourses";

// Course List
import CourseList from "./components/CourseList";

// Admin See Student List with based on Parent ID
import StudentList from "./components/StudentList";

// Course Checkout
import CourseCheckout from "./components/CourseCheckout";

// Course Category
import CourseCategory from "./components/CourseCategory";

// Course Details
import CourseDetail from "./components/Courses/CourseDetail";

// All Course List
import AllCourseList from "./components/CourseList/AllCourseList";

// Student Details
import StudentDetails from "./components/StudentDetails";

// Page 404
import Page404 from "./components/Page404";

// ParentStudent
import ParentStudent from "./components/ParentStudent";

// Course Creation
import CoursesCreation from "./components/Courses/CourseCreation";

//Course Lesson
import CourseLesson from "./components/CourseLesson";

//Create Course Lesson
import CreateCourseLessons from "./components/CourseLesson/CreateCourseLessons";

//Edit Course Lesson
import EditCourseLessons from "./components/CourseLesson/EditCourseLessons";

// Course Schedule
import CourseSchedule from "./components/CourseSchedule";

// Create Course Schedule
import CreateCourseSchedule from "./components/CourseSchedule/CreateCourseSchedule";

// Edit Course Schedule
import EditCourseSchedule from "./components/CourseSchedule/EditCourseSchedule";

// Edit Admin Details
import EditAdminDetails from "./components/EditAdminDetails";

// Teacher Signup
import TeacherSignup from "./components/TeacherSignup";

// Course Menu
import CourseSideMenu from "./components/CourseSideMenu";

// Parent Upcoming Schedule For All Student  and Student Upcoming List
import UpcomingSchedule from "./components/UpcomingSchedule";

// Admin Payment List
import AdminPaymentList from "./components/AdminPaymentList";

//Edit Teacher Detail
import EditTeacherDetails from "./components/EditTeacherDetails";

// Admin Teacher List
import TeacherList from "./components/TeacherList";

// Admin see Student List without parent
import AdminStudentsList from "./components/AdminStudentsList";

// Admin Upcoming Schedule List For Student and Teacher, Upcoming Schedule List for Teacher
import UpcomingScheduleList from "./components/UpcomingScheduleList";

//Teacher Public Profile
import TeacherPublicProfile from "./components/TeacherPublicProfile";

//Over All upcoming course schedule list for Admin and particular teacher all upcoming schedule list for Teacher
import UpcomingTeacherScheduleList from "./components/UpcomingTeacherScheduleList";

// Admin Can Create Quiz
import CreateQuiz from "./components/CreateQuiz";

// Admin Can Create HomeWork
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

// HomeWork Answer
import HomeWorkAnswer from "./components/HomeWorkAnswer";
//TeacherDetails
import TeacherDetails from "./components/TeacherDetails";

//Teacher Course List
import TeacherCourseList from "./components/TeacherCourseList";

// Admin Homework
import AdminHomework from "./components/AdminQuizAndHomework/AdminHomework";

// Admin Quiz
import AdminQuiz from "./components/AdminQuizAndHomework/AdminQuiz";

// Quiz Review for Teacher
import QuizReview from "./components/QuizReview";

// Admin Can View Teacher Not Availabl=ility List in Calendar View
import CalendarView from "./components/CalendarView";

// Teacher Application
import TeacherApplicationForm from "./components/TeacherApplicationForm";

// Teacher Available
import TeacherAvailable from "./components/TeacherAvailable";

// Student List for Each Class
import EachClassStudentList from "./components/EachClassStudentList";

// Completed Course List
import CompletedCourseList from "./components/CompletedCourseList";

//Course History
import CourseHistory from "./components/CourseHistory";

//Student Transcript
import StudentTranscript from "./components/StudentTranscript";

//Admin Can View Student Upcoming Schedule List and Parent can view student upcoming schedule list 
import AdminStudentUpcomingScheduleList from "./components/AdminStudentUpcomingScheduleList";

// Edit Quiz Question
import EditQuiz from "./components/CreateQuiz/EditQuiz";

// Edit Home Work Question
import EditHomeWork from "./components/CreateHomeWork/EditHomeWork";

// List of routes
const routes = [
  {
    path: "/",
    exact: true,
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    exact: true,
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/help",
    exact: true,
    name: "Help",
    component: Help,
  },
  {
    path: "/about-us",
    exact: true,
    name: "About Us",
    component: AboutUs,
  },
  {
    path: "/forgot/password",
    exact: true,
    name: "Forgot Password",
    component: ResetPassword,
  },
  {
    path: "/login",
    exact: true,
    name: "Login",
    component: Login,
  },
  {
    path: "/course/add",
    exact: true,
    name: "Course Creation",
    component: CoursesCreation,
  },
  {
    path: "/parent-dashboard",
    exact: true,
    name: "ParentDashboard",
    component: ParentDashboard,
  },
  {
    path: "/student-dashboard",
    exact: true,
    name: "StudentDashboard",
    component: StudentDashboard,
  },
  {
    path: "/admin-login",
    exact: true,
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/landing-page",
    exact: true,
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/set-password",
    exact: true,
    name: "SetPassword",
    component: SetPassword,
  },
  {
    path: "/reset-password",
    exact: true,
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/parent/signup",
    exact: true,
    name: "ParentSignup",
    component: ParentSignup,
  },
  {
    path: "/student/signup",
    exact: true,
    name: "StudentSignup",
    component: StudentSignup,
  },
  {
    path: "/edit-parent-details",
    exact: true,
    name: "EditParentDetails",
    component: EditParentDetails,
  },
  {
    path: "/edit/student/details/:id",
    exact: true,
    name: "EditStudentDetails",
    component: EditStudentDetails,
  },
  {
    path: "/parents/list",
    exact: true,
    name: "ParentsList",
    component: ParentsList,
  },
  {
    path: "/course/edit/:id",
    exact: true,
    name: "EditCourses",
    component: EditCourses,
  },
  {
    path: "/course/list",
    exact: true,
    name: "CourseList",
    component: CourseList,
  },
  {
    path: "/student/list/:id",
    exact: true,
    name: "StudentList",
    component: StudentList,
  },
  {
    path: "/course/checkout/:name",
    exact: true,
    name: "CourseCheckout",
    component: CourseCheckout,
  },
  {
    path: "/course/category",
    exact: true,
    name: "CourseCategory",
    component: CourseCategory,
  },
  {
    path: "/course/detail/:id",
    exact: true,
    name: "CourseDetail",
    component: CourseDetail,
  },
  {
    path: "/course/search",
    exact: true,
    name: "AllCourseList",
    component: AllCourseList,
  },
  {
    path: "/student/detail/:id",
    exact: true,
    name: "StudentDetails",
    component: StudentDetails,
  },
  {
    path: "/page404",
    exact: true,
    name: "Page404",
    component: Page404,
  },
  {
    path: "/parent/student",
    exact: true,
    name: "ParentStudent",
    component: ParentStudent,
  },
  {
    path: "/course/lesson",
    exact: true,
    name: "CourseLesson",
    component: CourseLesson,
  },
  {
    path: "/course/lesson/add",
    exact: true,
    name: "CreateCourseLessons",
    component: CreateCourseLessons,
  },
  {
    path: "/course/lesson/edit/:id",
    exact: true,
    name: "EditCourseLessons",
    component: EditCourseLessons,
  },
  {
    path: "/course/schedule",
    exact: true,
    name: "CourseSchedule",
    component: CourseSchedule,
  },
  {
    path: "/course/schedule/add",
    exact: true,
    name: "CreateCourseSchedule",
    component: CreateCourseSchedule,
  },
  {
    path: "/course/schedule/update",
    exact: true,
    name: "EditCourseSchedule",
    component: EditCourseSchedule,
  },
  {
    path: "/admin/details",
    exact: true,
    name: "EditAdminDetails",
    component: EditAdminDetails,
  },
  {
    path: "/teacher/signup",
    exact: true,
    name: "TeacherSignup",
    component: TeacherSignup,
  },
  {
    path: "/courses/edit",
    exact: true,
    name: "CourseSideMenu",
    component: CourseSideMenu,
  },

  {
    path: "/upcoming/schedule",
    exact: true,
    name: "UpcomingSchedule",
    component: UpcomingSchedule,
  },
  {
    path: "/teacher/edit/:id",
    exact: true,
    name: "EditTeacherDetails",
    component: EditTeacherDetails,
  },
  {
    path: "/payment/list",
    exact: true,
    name: "Admin Payment List",
    component: AdminPaymentList,
  },
  {
    path: "/teacher/list",
    exact: true,
    name: "teacherlist",
    component: TeacherList,
  },
  {
    path: "/students/list",
    exact: true,
    name: "Admin Students List",
    component: AdminStudentsList,
  },
  {
    path: "/upcoming/schedule/:id",
    exact: true,
    name: "UpcomingScheduleList",
    component: UpcomingScheduleList,
  },
  {
    path: "/teacher/profile/public",
    exact: true,
    name: "Techer Public Profile",
    component: TeacherPublicProfile,
  },
  {
    path: "/upcoming/teacher/schedule/list",
    exact: true,
    name: "Upcoming Teacher Schedule List",
    component: UpcomingTeacherScheduleList,
  },
  {
    path: "/quiz/add/:id",
    exact: true,
    name: "CreateQuiz",
    component: CreateQuiz,
  },
  {
    path: "/homework/add/:id",
    exact: true,
    name: "CreateHomeWork",
    component: CreateHomeWork,
  },
  {
    path: "/test/link",
    exact: true,
    name: "ListOfQuiz",
    component: ListOfQuiz,
  },
  {
    path: "/homework/link",
    exact: true,
    name: "HomeWorkListTable",
    component: HomeWorkListTable,
  },
  {
    path: "/quiz",
    exact: true,
    name: "Quiz",
    component: Quiz,
  },
  {
    path: "/quiz/preview",
    exact: true,
    name: "QuizPreview",
    component: QuizPreview,
  },
  {
    path: "/homework",
    exact: true,
    name: "HomeWork",
    component: HomeWork,
  },
  {
    path: "/teacher/review/quiz",
    exact: true,
    name: "TeacherQuizReview",
    component: TeacherQuizReview,
  },
  {
    path: "/teacher/review/homework",
    exact: true,
    name: "TeacherHomeworkReview",
    component: TeacherHomeworkReview,
  },
  {
    path: "/homework/preview",
    exact: true,
    name: "HomeWorkPreview",
    component: HomeWorkPreview,
  },
  {
    path: "/homework/answers",
    exact: true,
    name: "HomeWorkAnswer",
    component: HomeWorkAnswer,
  },
  {
    path: "/teacher/details",
    exact: true,
    name: "TeacherDetails",
    component: TeacherDetails,
  },
  {
    path: "/teacher/schedule/:id",
    exact: true,
    name: "TeacherCourseList",
    component: TeacherCourseList,
  },
  {
    path: "/admin/quiz",
    exact: true,
    name: "AdminQuiz",
    component: AdminQuiz,
  },
  {
    path: "/admin/homework",
    exact: true,
    name: "AdminHomework",
    component: AdminHomework,
  },
  {
    path: "/quiz/review",
    exact: true,
    name: "QuizReview",
    component: QuizReview,
  },
  {
    path: '/teacher/not-available',
    exact: true,
    name: "CalendarView",
    component: CalendarView,
  },
  {
    path: "/teacher/application/form",
    exact: true,
    name: "TeacherApplicationForm",
    component: TeacherApplicationForm,
  },
  {
    path: '/not-available/time',
    exact: true,
    name: "TeacherAvailable",
    component: TeacherAvailable,
  },
  {
    path: '/class/student/list/:id',
    exact: true,
    name: "EachClassStudentList",
    component: EachClassStudentList,
  },
  {
    path: '/completed/course/list',
    exact: true,
    name: "CompletedCourseList",
    component: CompletedCourseList,
  },
  {
    path: '/course/history',
    exact: true,
    name: "CourseHistory",
    component: CourseHistory,
  },
  {
    path: '/student/transcript/:id',
    exact: true,
    name: "StudentTranscript",
    component: StudentTranscript,
  },
  {
    path: '/upcoming/schedule/list/:id',
    exact: true,
    name: "AdminStudentUpcomingScheduleList",
    component: AdminStudentUpcomingScheduleList,
  },
  {
    path: '/quiz/edit',
    exact: true,
    name: "EditQuiz",
    component: EditQuiz,
  },
  {
    path: '/homework/edit',
    exact: true,
    name: "EditHomeWork",
    component: EditHomeWork,
  }
  // {
  //   path: "/logout",
  //   exact: true,
  //   name: "Logout",
  //   component: Logout
  // },
  // {
  //   path: "/users",
  //   exact: true,
  //   name: "Users",
  //   component: Users
  // },
  // {
  //   path: "/product/categories",
  //   exact: true,
  //   name: "Product Categories",
  //   component: ProductCategory
  // },
  // {
  //   path: "/product/category/detail/:id",
  //   exact: true,
  //   name: "Product Category Detail",
  //   component: EditProductCategory
  // },
  // {
  //   path: "/product/collections",
  //   exact: true,
  //   name: "Product Collections",
  //   component: ProductCollections
  // },
  // {
  //   path: "/product/collection/detail/:id",
  //   exact: true,
  //   name: "Product collection Detail",
  //   component: EditProductCollection
  // },
  // {
  //   path: "/product/tags",
  //   exact: true,
  //   name: "Tags",
  //   component: Tag
  // },
  // {
  //   path: "/product/tag/detail/:id",
  //   exact: true,
  //   name: "Product Tag Detail",
  //   component: EditTag
  // },
  // {
  //   path: "/product/brands",
  //   exact: true,
  //   name: "Product Brands",
  //   component: ProductBrand
  // },
  // {
  //   path: "/product/brands/detail/:id",
  //   exact: true,
  //   name: "Product Brands",
  //   component: BrandDetail
  // },
  // {
  //   path: "/product/pricing",
  //   exact: true,
  //   name: "Product Pricing",
  //   component: ProductPricing
  // },
  // {
  //   path: "/product/images",
  //   exact: true,
  //   name: "Product Images",
  //   component: ProductImage
  // },
  // {
  //   path: "/orders",
  //   exact: true,
  //   name: "Product Orders",
  //   component: ProductOrder
  // },
  // {
  //   path: "/order/details/:id",
  //   exact: true,
  //   name: "Orders Details",
  //   component: OrderDetails
  // },
  // {
  //   path: "/vendor",
  //   exact: true,
  //   name: "Vendor",
  //   component: Vendor
  // },
];

export default routes;
