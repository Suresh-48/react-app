import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Card, Row } from 'react-bootstrap'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

// SCSS
import '../../css/LandingPage.scss'

function CourseCard({ course, key }) {

  // Convert Description 
  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) }
    } catch (exp) {
      return { __html: 'Error' }
    }
  }

  return (
    <div key={key}>
      <Card className="landing-card-height ">
        <div className="image-content">
          <img
            className="image-height-style"
            src={course?.imageUrl}
            alt={`${course?.category?.name}`}
            width={'100%'}
          />
        </div>
        <Card.Body  className="card-body-alignments">
          <Card.Title className="truncate-text">
            {course?.name}
            </Card.Title>
          <Card.Text>
            <p className="ellipsis-text" dangerouslySetInnerHTML={
              convertFromJSONToHTML(course?.description)
            }></p>
          </Card.Text>
           <Row className="card-body-price">
              <Col xs={12} md={6} lg={6} sm={6}>
                <div className="body-price ">
                  <p className="amount-text">${course?.actualAmount}</p>
                  <p className="mb-0">${course?.discountAmount}</p>
                </div>
              </Col>
              <Col xs={12} md={6} lg={6} sm={6} className="enrolled-padding">
                <div className="body-enrolled">
                  <p className="enroll-text">Enrolled :</p>
                  <p className="mb-0">4/20</p>
                </div>
              </Col>
            </Row>
        </Card.Body>
        <Card.Footer>
          <Row>
              <Link
                to={{
                  pathname: `/course/detail/${course?.aliasName}`,
                  state: { courseId: course?.id },
                }}
                className="edit-link"
              >
                View Details
              </Link>
          </Row>
        </Card.Footer>
      </Card>
    </div>
  )
}

export default CourseCard
