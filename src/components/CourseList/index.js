import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Collapse,
  Spinner,
  Button,
} from 'react-bootstrap'
import { Tab, Tabs } from '@material-ui/core'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { toast } from 'react-toastify'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

// Api
import Api from '../../Api'

// Styles
import '../../css/CourseList.scss'

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisV } from '@fortawesome/free-solid-svg-icons'

const theme = createTheme({
  palette: {
    primary: {
      light: '#717174',
      main: '#717174',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
})

export default class CourseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      publish: [],
      draft: [],
      archive: [],
      open: false,
      cardOpen: false,
      userDetailsId: '',
      value: 0,
      cardId: '',
      publishCurrentPage: 1,
      draftCurrentPage: 1,
      archiveCurrentPage: 1,
      postsPerPage: 9,
      isLoading: true,
    }
  }

  handlePublishPageClick = (data) => {
    let selected = data.selected + 1
    this.setState({ publishCurrentPage: selected })
  }

  handleDraftPageClick = (data) => {
    let selected = data.selected + 1
    this.setState({ draftCurrentPage: selected })
  }

  // Convert Description
  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) }
    } catch (exp) {
      return { __html: 'Error' }
    }
  }

  //get publish course data
  getPublishCourse = () => {
    Api.get('api/v1/course/publish').then((res) => {
      const data = res.data.data.data
      this.setState({ publish: data, isLoading: false })
    })
  }

  componentDidMount() {
    this.getPublishCourse()
    this.getDraftCourse()
    this.getArchiveCourse()
  }

  //change publish and draft course type
  changeCourseType = (type) => {
    Api.patch('api/v1/course/type', {
      courseId: this.state.cardId,
      type: type,
    })
      .then((response) => {
        this.getPublishCourse()
        this.getDraftCourse()
        this.getArchiveCourse()
        this.setState({ open: false })
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage
          const errorRequest = error.response.request
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message
          }
          this.setState({ open: false })
          toast.error(error.response.data.message)
        }
      })
  }

  //get draft course data
  getDraftCourse = () => {
    Api.get('api/v1/course/Draft').then((res) => {
      const data = res.data.data.data
      this.setState({ draft: data })
    })
  }

  //get archive course data
  getArchiveCourse = () => {
    Api.get('api/v1/course/archive').then((res) => {
      const data = res.data.data.data
      this.setState({ archive: data })
    })
  }

  render() {
    const {
      postsPerPage,
      publish,
      publishCurrentPage,
      draft,
      archive,
      archiveCurrentPage,
      draftCurrentPage,
      isLoading,
    } = this.state

    // Get publish current posts
    const publishLastpage = publishCurrentPage * postsPerPage
    const publishFirstPage = publishLastpage - postsPerPage
    const publishCourses = publish.slice(publishFirstPage, publishLastpage)
    const publishPageNumbers = []

    for (let i = 1; i <= Math.ceil(publish.length / postsPerPage); i++) {
      publishPageNumbers.push(i)
    }

    // Get publish current posts
    const draftLastpage = draftCurrentPage * postsPerPage
    const draftFirstPage = draftLastpage - postsPerPage
    const draftCourses = draft.slice(draftFirstPage, draftLastpage)
    const draftPageNumbers = []
    for (let i = 1; i <= Math.ceil(draft.length / postsPerPage); i++) {
      draftPageNumbers.push(i)
    }

    // Get archive current posts
    const archiveLastPage = archiveCurrentPage * postsPerPage
    const archiveFirstPage = archiveLastPage - postsPerPage
    const archiveCourses = archive.slice(archiveFirstPage, archiveLastPage)
    const archivePageNumbers = []
    for (let i = 1; i <= Math.ceil(archive.length / postsPerPage); i++) {
      archivePageNumbers.push(i)
    }

    return (
      <ThemeProvider theme={theme}>
        <Container className="pt-3 mb-3">
          {isLoading === true ? (
            <div className="d-flex position-absolute top-50 start-50 translate-middle">
              <Spinner animation="grow" variant="primary" />
              <span>
                <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
              </span>
            </div>
          ) : (
            <div>
              <div className="create-course-button">
                <h3 className="course-title">Courses</h3>
                <Button
                  className="create-button-style py-1"
                  variant="primary"
                  onClick={() => this.props.history.push('/course/add')}
                >
                  <FontAwesomeIcon icon={faPlus} size="lg" className="mx-1" />{' '}
                  Create Course
                </Button>
              </div>

              <div>
                <Tabs
                  value={this.state.value}
                  indicatorColor="primary"
                  onChange={(event, newValue) => {
                    this.setState({ value: newValue })
                  }}
                >
                  <Tab
                    label={
                      <Row>
                        <Col>
                          <p className="tab-title">Published </p>
                        </Col>
                        <Col className="tab-count-style">
                          <p className="tab-count">{publish?.length}</p>
                        </Col>
                      </Row>
                    }
                    style={{ width: '33.3%' }}
                    value={0}
                  />

                  <Tab
                    label={
                      <Row>
                        <Col>
                          <p className="tab-title">Drafted </p>
                        </Col>
                        <Col className="tab-count-style">
                          <p className="tab-count">{draft?.length}</p>
                        </Col>
                      </Row>
                    }
                    style={{ width: '33.3%' }}
                    value={1}
                  />
                  <Tab
                    label={
                      <Row>
                        <Col>
                          <p className="tab-title">Archive</p>
                        </Col>
                        <Col className="tab-count-style">
                          <p className="tab-count">{archive?.length}</p>
                        </Col>
                      </Row>
                    }
                    style={{ width: '33.3%' }}
                    value={2}
                  />
                </Tabs>
                <hr />
                {this.state.value === 0 ? (
                  <div>
                    {publish?.length !== 0 ? (
                      <Row className="mt-3">
                        {publishCourses.map((course, key) => (
                          <Col
                            xs={12} sm={6} md={6} lg={4}
                            style={{ marginTop: 10 }}
                          >
                            <Card className="card-height-style">
                              <div className="image-content">
                                {course?.imageUrl === undefined ||
                                course?.imageUrl === null ? (
                                  <img
                                    className="image-heigh"
                                    src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                                    alt="Snow"
                                    width={'100%'}
                                    height={'100%'}
                                  />
                                ) : (
                                  <img
                                    className="image-heigh"
                                    src={course?.imageUrl}
                                    alt="Snow"
                                    width={'100%'}
                                    height={'100%'}
                                  />
                                )}
                                <div class="top-right">
                                  <FontAwesomeIcon
                                    icon={faEllipsisV}
                                    size="sm"
                                    color={'black'}
                                    onClick={() =>
                                      this.setState({
                                        open: !this.state.open,
                                        cardId: course.id,
                                      })
                                    }
                                    style={{ cursor: 'pointer' }}
                                  />
                                  {this.state.cardId === course.id ? (
                                    <Collapse
                                      in={this.state.open}
                                      className="collapse-show-text-width"
                                    >
                                      <div className="collapse-style">
                                        <Link
                                          to={{
                                            pathname: `/course/detail/${course?.aliasName}`,
                                            state: { courseId: course?.id },
                                          }}
                                          className="navigate-edit-text-link"
                                        >
                                          View
                                        </Link>
                                        <hr />
                                        <Link
                                          to={{
                                            pathname: `/course/edit/${course?.id}`,
                                            state: {
                                              courseId: course?.id,
                                              aliasName: course?.aliasName,
                                            },
                                          }}
                                          className="navigate-edit-text-link"
                                        >
                                          Edit
                                        </Link>
                                        <hr />
                                        <Link
                                          to="#"
                                          className="navigate-edit-text-link"
                                          onClick={() =>
                                            this.changeCourseType('Archive')
                                          }
                                        >
                                          Archive
                                        </Link>
                                        <hr />
                                        <Link
                                          to="#"
                                          className="navigate-edit-text-link"
                                          onClick={() =>
                                            this.changeCourseType('Draft')
                                          }
                                        >
                                          Draft
                                        </Link>
                                      </div>
                                    </Collapse>
                                  ) : null}
                                </div>
                              </div>
                              <Card.Body className="card-body-alignments">
                                <Card.Title  className="truncate-text">
                                  {course?.name}
                                </Card.Title>
                                <Card.Text>
                                  <p
                                    className="ellipsis-text"
                                    dangerouslySetInnerHTML={this.convertFromJSONToHTML(
                                      course?.description,
                                    )}
                                  ></p>
                                </Card.Text>
                              </Card.Body>
                              <Card.Footer>
                                {/* <Row className="card-footer-header">
                                  <Col
                                    className="d-flex"
                                    xs={12}
                                    md={12}
                                    lg={6}
                                    sm={12}
                                  >
                                    <div className="footer-price-style ">
                                      <p className="amount-text">
                                        ${course?.actualAmount}
                                      </p>
                                      <p className="mb-0">
                                        ${course?.discountAmount}
                                      </p>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={12} lg={6} sm={12}>
                                    <div className="footer-enroll-style ">
                                      <p className="enroll-text">Enrolled :</p>
                                      <p className="mb-0">
                                        {' '}
                                        {course?.totalEnrolledStudent ===
                                        undefined
                                          ? 0
                                          : course?.totalEnrolledStudent}
                                        /20
                                      </p>
                                    </div>
                                  </Col>
                                </Row> */}
                                <div className="row card-footer-header">
                                  <Col xs={12} sm={12} md={5}>
                                    <div className="footer-price-style ">
                                      <p className="amount-text">
                                        ${course?.actualAmount}
                                      </p>
                                      <p className="mb-0">
                                        ${course?.discountAmount}
                                      </p>
                                    </div>
                                  </Col>
                                  <Col>
                                    <div className="footer-enroll-style ">
                                      <p className="enroll-text">Enrolled :</p>
                                      <p className="mb-0">
                                        {' '}
                                        {course?.totalEnrolledStudent ===
                                          undefined
                                          ? 0
                                          : course?.totalEnrolledStudent}
                                        /20
                                      </p>
                                    </div>
                                  </Col>
                                </div>
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                        {publish?.length > 0 ? (
                          <div className="pagination-width">
                            <ReactPaginate
                              previousLabel={'Previous'}
                              nextLabel={'Next'}
                              breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={publishPageNumbers?.length}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={3}
                              onPageChange={this.handlePublishPageClick}
                              containerClassName={'pagination'}
                              activeClassName={'active'}
                              pageClassName={'page-item'}
                              pageLinkClassName={'page-link'}
                              previousClassName={'page-item'}
                              previousLinkClassName={'page-link'}
                              nextClassName={'page-item'}
                              nextLinkClassName={'page-link'}
                            />
                          </div>
                        ) : null}
                      </Row>
                    ) : (
                      <div>
                        <p className="no-record-position-style">
                          No Record Found
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {this.state.value === 1 ? (
                      <div>
                        {draft?.length !== 0 ? (
                          <Row className="card-row mt-3">
                            {draftCourses.map((course, key) => (
                              <Col
                                xs={12} sm={6} md={6} lg={4}
                                style={{ marginTop: 10 }}
                              >
                                <Card className="card-height-style">
                                  <div className="image-content">
                                    {course?.imageUrl === undefined ||
                                    course?.imageUrl === null ? (
                                      <img
                                        className="image-heigh"
                                        src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                                        alt="Snow"
                                        width={'100%'}
                                        height={'100%'}
                                      />
                                    ) : (
                                      <img
                                        className="image-heigh"
                                        src={course?.imageUrl}
                                        alt="Snow"
                                        width={'100%'}
                                        height={'100%'}
                                      />
                                    )}
                                    <div class="top-right">
                                      {' '}
                                      <FontAwesomeIcon
                                        icon={faEllipsisV}
                                        size="sm"
                                        color={'black'}
                                        onClick={() =>
                                          this.setState({
                                            open: !this.state.open,
                                            cardId: course.id,
                                          })
                                        }
                                        style={{ cursor: 'pointer' }}
                                      />
                                      {this.state.cardId === course.id ? (
                                        <Collapse
                                          in={this.state.open}
                                          className="collapse-show-text-width"
                                        >
                                          <div className="collapse-style">
                                            <Link
                                              to={{
                                                pathname: `/course/detail/${course?.aliasName}`,
                                                state: { courseId: course?.id },
                                              }}
                                              className="navigate-edit-text-link"
                                              onClick={() =>
                                                localStorage.setItem(
                                                  'checkoutCourseId',
                                                  course?.id,
                                                )
                                              }
                                            >
                                              View
                                            </Link>
                                            <hr />
                                            <Link
                                              className="navigate-edit-text-link"
                                              to={{
                                                pathname: `/course/edit/${course?.id}`,
                                                state: {
                                                  courseId: course?.id,
                                                  aliasName: course?.aliasName,
                                                },
                                              }}
                                            >
                                              Edit
                                            </Link>
                                            <hr />
                                            <Link
                                              to="#"
                                              className="navigate-edit-text-link"
                                              onClick={() =>
                                                this.changeCourseType('Archive')
                                              }
                                            >
                                              Archive
                                            </Link>
                                            <hr />
                                            <Link
                                              to="#"
                                              className="navigate-edit-text-link"
                                              onClick={() =>
                                                this.changeCourseType('Publish')
                                              }
                                            >
                                              Publish
                                            </Link>
                                          </div>
                                        </Collapse>
                                      ) : null}
                                    </div>
                                  </div>
                                  <Card.Body>
                                    <Card.Title className="course-name">
                                      {course?.name}
                                    </Card.Title>
                                    <Card.Text>
                                      <p
                                        className="ellipsis-text"
                                        dangerouslySetInnerHTML={this.convertFromJSONToHTML(
                                          course?.description,
                                        )}
                                      ></p>
                                    </Card.Text>
                                  </Card.Body>
                                  <Card.Footer>
                                    <Row className="card-footer-header">
                                      <Col
                                        className="d-flex"
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        sm={12}
                                      >
                                        <div className="footer-price-style ">
                                          <p className="amount-text">
                                            ${course?.actualAmount}
                                          </p>
                                          <p className="mb-0">
                                            ${course?.discountAmount}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col xs={12} md={12} lg={6} sm={12}>
                                        <div className="footer-enroll-style ">
                                          <p className="enroll-text">
                                            Enrolled :
                                          </p>
                                          <p className="mb-0">4/20</p>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Footer>
                                </Card>
                              </Col>
                            ))}
                            {draft?.length > 0 ? (
                              <div className="pagination-width">
                                <ReactPaginate
                                  previousLabel={'previous'}
                                  nextLabel={'next'}
                                  breakLabel={'...'}
                                  breakClassName={'break-me'}
                                  pageCount={draftPageNumbers?.length}
                                  marginPagesDisplayed={2}
                                  pageRangeDisplayed={3}
                                  onPageChange={this.handleDraftPageClick}
                                  containerClassName={'pagination'}
                                  activeClassName={'active'}
                                  pageClassName={'page-item'}
                                  pageLinkClassName={'page-link'}
                                  previousClassName={'page-item'}
                                  previousLinkClassName={'page-link'}
                                  nextClassName={'page-item'}
                                  nextLinkClassName={'page-link'}
                                />
                              </div>
                            ) : null}
                          </Row>
                        ) : (
                          <div>
                            <p className="no-record-position-style">
                              No Record Found
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {archive?.length !== 0 ? (
                          <Row className="card-row mt-3">
                            {archiveCourses.map((course, key) => (
                              <Col
                                xs={12} sm={6} md={6} lg={4}
                                style={{ marginTop: 10 }}
                              >
                                <Card className="card-height-style">
                                  <div className="image-content">
                                    {course?.imageUrl === undefined ||
                                    course?.imageUrl === null ? (
                                      <img
                                        className="image-heigh"
                                        src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                                        alt="Snow"
                                        width={'100%'}
                                        height={'100%'}
                                      />
                                    ) : (
                                      <img
                                        className="image-heigh"
                                        src={course?.imageUrl}
                                        alt="Snow"
                                        width={'100%'}
                                        height={'100%'}
                                      />
                                    )}
                                    <div class="top-right">
                                      {' '}
                                      <FontAwesomeIcon
                                        icon={faEllipsisV}
                                        size="sm"
                                        color={'black'}
                                        onClick={() =>
                                          this.setState({
                                            open: !this.state.open,
                                            cardId: course?.id,
                                          })
                                        }
                                        style={{ cursor: 'pointer' }}
                                      />
                                      {this.state.cardId === course?.id ? (
                                        <Collapse
                                          in={this.state.open}
                                          className="collapse-show-text-width"
                                        >
                                          <div className="collapse-style">
                                            <Link
                                              to={{
                                                pathname: `/course/detail/${course?.aliasName}`,
                                                state: { courseId: course?.id },
                                              }}
                                              className="navigate-edit-text-link"
                                              onClick={() =>
                                                localStorage.setItem(
                                                  'checkoutCourseId',
                                                  course?.id,
                                                )
                                              }
                                            >
                                              View
                                            </Link>
                                            <hr />
                                            <Link
                                              to={{
                                                pathname: `/course/edit/${course?.id}`,
                                                state: {
                                                  courseId: course?.id,
                                                  aliasName: course?.aliasName,
                                                },
                                              }}
                                              className="navigate-edit-text-link"
                                            >
                                              Edit
                                            </Link>
                                            <hr />
                                            <Link
                                              to="#"
                                              className="navigate-edit-text-link"
                                              onClick={() =>
                                                this.changeCourseType('Publish')
                                              }
                                            >
                                              Publish
                                            </Link>
                                            <hr />
                                            <Link
                                              to="#"
                                              className="navigate-edit-text-link"
                                              onClick={() =>
                                                this.changeCourseType('Draft')
                                              }
                                            >
                                              Draft
                                            </Link>
                                          </div>
                                        </Collapse>
                                      ) : null}
                                    </div>
                                  </div>
                                  <Card.Body>
                                    <Card.Title className="course-name">
                                      {course?.name}
                                    </Card.Title>
                                    <Card.Text>
                                      <p
                                        className="ellipsis-text"
                                        dangerouslySetInnerHTML={this.convertFromJSONToHTML(
                                          course?.description,
                                        )}
                                      ></p>
                                    </Card.Text>
                                  </Card.Body>
                                  <Card.Footer>
                                    <Row className="card-footer-header">
                                      <Col
                                        className="d-flex"
                                        xs={12}
                                        md={12}
                                        lg={6}
                                        sm={12}
                                      >
                                        <div className="footer-price-style ">
                                          <p className="amount-text">
                                            ${course?.actualAmount}
                                          </p>
                                          <p className="mb-0">
                                            ${course?.discountAmount}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col xs={12} md={12} lg={6} sm={12}>
                                        <div className="footer-enroll-style">
                                          <p className="enroll-text">
                                            Enrolled :
                                          </p>
                                          <p className="mb-0">4/20</p>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Footer>
                                </Card>
                              </Col>
                            ))}
                            {archive?.length > 0 ? (
                              <div className="pagination-width">
                                <ReactPaginate
                                  previousLabel={'previous'}
                                  nextLabel={'next'}
                                  breakLabel={'...'}
                                  breakClassName={'break-me'}
                                  pageCount={archivePageNumbers?.length}
                                  marginPagesDisplayed={2}
                                  pageRangeDisplayed={3}
                                  onPageChange={this.handlearchivePageClick}
                                  containerClassName={'pagination'}
                                  activeClassName={'active'}
                                  pageClassName={'page-item'}
                                  pageLinkClassName={'page-link'}
                                  previousClassName={'page-item'}
                                  previousLinkClassName={'page-link'}
                                  nextClassName={'page-item'}
                                  nextLinkClassName={'page-link'}
                                />
                              </div>
                            ) : null}
                          </Row>
                        ) : (
                          <div>
                            <p className="no-record-position-style">
                              No Record Found
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </ThemeProvider>
    )
  }
}
