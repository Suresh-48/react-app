import React, { Component } from 'react'
import { Container, Carousel, Button, Row, Col } from 'react-bootstrap'

// SCSS
import '../../css/LandingPage.scss'

// API
import Api from '../../Api'

// Components
import CourseCard from '../../components/core/CourseCard'
import Loader from '../core/Loader'

export default class LandingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courseData: [],
      isLoading: true,
      courseList: '',
      overallCount: '',
    }
  }

  componentDidMount = () => {
    this.getCourseDetails()
  }

  // Get Course Details
  getCourseDetails = () => {
    Api.get('api/v1/course/landingScreen').then((res) => {
      const data = res.data.data
      const courseCount = res.data.overallCourseCount
      this.setState({
        courseData: data,
        courseList: data.length,
        isLoading: false,
        overallCount: courseCount,
      })
    })
  }

  render() {
    const { isLoading, courseData } = this.state

    return (
      <Container fluid className="p-0 mt-5">
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZtgwR7GnR9vuV5xcLw-z4z-or39X0JsIECA&usqp=CAU"
                  alt="First slide"
                  height="400"
                  width="100%"
                />
                <Carousel.Caption>
                  <h3>Where Kids Love Learning</h3>
                  <Button variant="success">Start Now</Button>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvDbnh2bfELvkgZNlYP5Zp1Iu7IYG02pME6Q&usqp=CAU"
                  alt="First slide"
                  height="400"
                  width="100%"
                />
                <Carousel.Caption>
                  <h3>Where Kids Love Learning</h3>
                  <Button variant="success">Start Now</Button>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
            <Container className="session-top">
              <Row className="justify-content-md-center mb-3">
                <Col md="auto">
                  <h1>
                    Over {this.state.overallCount} Interactive Online Classes
                  </h1>
                </Col>
              </Row>
              {courseData?.length > 0 && (
                <Row>
                  <div className="d-flex justify-content-end mb-3">
                    <Button
                      variant="primary"
                      className="viewall-button-style"
                      onClick={() => this.props.history.push('/course/search')}
                    >
                      View All Courses
                    </Button>
                  </div>

                  {courseData &&
                    courseData.map((course, index) => (
                      <Col xs={12} sm={6} md={6} lg={4} className="mb-5 mt-3">
                        <CourseCard course={course} key={index} />
                      </Col>
                    ))}
                </Row>
              )}
            </Container>
          </div>
        )}
      </Container>
    )
  }
}
