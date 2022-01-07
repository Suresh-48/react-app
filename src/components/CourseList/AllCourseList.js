import React, { Component } from 'react'
import Multiselect from 'multiselect-react-dropdown'
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import { Slider } from '@material-ui/core'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

// Styles
import '../../css/AllCourseList.scss'

// Api
import Api from '../../Api'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

// Component
import Loader from '../core/Loader'

export default class AllCourseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courseList: [],
      data: [],
      category: [],
      search: '',
      currentPage: 1,
      postPerPage: 8,
      isLoading: true,
      range: [0, 500],
    }
  }

  onSelected = (selectedList) => {
    this.setState({ data: selectedList })
  }
  onRemove = (selectedList) => {
    this.setState({ data: selectedList })
  }

  // Convert Description
  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) }
    } catch (exp) {
      return { __html: 'Error' }
    }
  }

  // Get category list option
  getCategory = () => {
    Api.get('api/v1/category').then((res) => {
      this.setState({ category: res.data.data.data })
    })
  }

  //handle Pagination
  handlePageClick = (data) => {
    let selected = data.selected + 1
    this.setState({ currentPage: selected })
  }

  componentDidMount = () => {
    this.getCategory()
    this.courseFilter()
  }

  //filter course list data
  courseFilter = (search) => {
    const { data, range } = this.state
    Api.post('api/v1/course/filter', {
      filter: data,
      range: range,
      search: search === undefined ? '' : search,
    }).then((res) => {
      const data = res.data.data
      const assending = data.sort((a, b) => a - b)
      this.setState({ courseList: assending, isLoading: false })
    })
  }

  render() {
    const {
      currentPage,
      postPerPage,
      courseList,
      isLoading,
      range,
    } = this.state

    // Pagination
    const lastPage = currentPage * postPerPage
    const firstPage = lastPage - postPerPage
    const courseDataList = courseList.slice(firstPage, lastPage)
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(courseList?.length / postPerPage); i++) {
      pageNumbers.push(i)
    }

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Container fluid style={{ marginTop: '0%' }}>
            <Row>
              <Col xs={5} sm={3} md={3} className="filter-container">
                <div className="mt-1 pb-5 position-fixed sidebar-style">
                  <div className="d-flex justify-content-end mt-3">
                    <FontAwesomeIcon
                      icon={faFilter}
                      size="lg"
                      color="#1d1464"
                    />
                    <p className="fs-6 fw-bold">Filter</p>
                  </div>
                  <div className="d-block justify-content-center">
                    <h6 className="filter-type-name">Filter With Category</h6>
                    <Multiselect
                      options={this.state.category}
                      onSelect={this.onSelected}
                      onRemove={this.onRemove}
                      displayValue="name"
                      placeholder="Select Category"
                      avoidHighlightFirstOption={true}
                      style={{ backgroundColor: 'white' }}
                    />
                    <div className="mt-5">
                      <h6 className="filter-type-name">
                        Filter With Payment Range
                      </h6>
                      <Slider
                        getAriaLabel={() => 'Minimum distance'}
                        min={0}
                        max={1000}
                        value={this.state.range}
                        onChange={(event, newValue) => {
                          this.setState({ range: newValue })
                        }}
                        valueLabelDisplay="auto"
                      />
                      <div className="slider-count">
                        <p>{range[0]}</p>
                        <p>{range[1]}</p>
                      </div>
                    </div>
                    <div className="mt-3 mb-3">
                      <h6 className="filter-type-name">Filter With Search</h6>
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control input-font-style"
                          onChange={(e) => {
                            this.setState({ search: e.target.value })
                            this.courseFilter(e.target.value)
                          }}
                          placeholder="Search"
                          aria-label="Dollar amount (with dot and two decimal places)"
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end ">
                      <Button
                        variant="primary"
                        className="apply-button "
                        onClick={() => this.courseFilter()}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={7} sm={9} md={9} className="d-flex mt-1">
                {isLoading === true ? (
                  <div className="d-flex position-absolute top-50 start-50 ">
                    <Spinner animation="grow" variant="primary" />
                    <span>
                      <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
                    </span>
                  </div>
                ) : courseDataList.length > 0 ? (
                  <Row style={{ marginLeft: 30 }}>
                    <h3 className="d-flex justify-content-center align-items-center mt-2">
                      All Courses
                    </h3>
                    <Row className="mt-3">
                      {courseDataList.map((course, key) => (
                        <Col
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          style={{ marginTop: 10 }}
                        >
                          <Card className="all-course-card-height" key={key}>
                            <div className="image-content">
                              {course?.imageUrl === undefined ||
                              course?.imageUrl === null ? (
                                <img
                                  className="image-height-card"
                                  src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                                  alt="Snow"
                                />
                              ) : (
                                <img
                                  className="image-height-card"
                                  src={course?.imageUrl}
                                  alt="Snow"
                                  width={'100%'}
                                  height={'100%'}
                                />
                              )}
                            </div>
                            <Card.Body className="card-body-alignments">
                              <Card.Title className="truncate-text">
                                {course?.name}
                              </Card.Title>
                              <Card.Text>
                                {/* <TextTruncate
                              line={3}
                              truncateText="…"
                              text={course?.description}
                            /> */}
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
                                  className="d-flex p-0"
                                  xs={12}
                                  md={12}
                                  lg={12}
                                  sm={12}
                                >
                                  <div className="style-footer-price">
                                    <p className="amount-text">
                                      ${course?.actualAmount}
                                    </p>
                                    <p className="mb-0 ">
                                      ${course?.discountAmount}
                                    </p>
                                  </div>
                                </Col>
                                <Col
                                  xs={12}
                                  className="p-0"
                                  md={12}
                                  lg={12}
                                  sm={12}
                                >
                                  <div className="style-footer-price ">
                                    <Link
                                      className="link-nav-style"
                                      to={{
                                        pathname: `/course/detail/${course?.aliasName}`,
                                        state: { courseId: course?.id },
                                      }}
                                    >
                                      View Detail
                                    </Link>
                                  </div>
                                </Col>
                              </Row>
                            </Card.Footer>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <Row className="mt-3">
                      <div className="pagination-width">
                        <ReactPaginate
                          previousLabel={'Previous'}
                          nextLabel={'Next'}
                          breakLabel={'...'}
                          breakClassName={'break-me'}
                          pageCount={pageNumbers?.length}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={this.handlePageClick}
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
                    </Row>
                  </Row>
                ) : (
                  <div className="d-flex position-absolute top-50 start-50">
                    <h5>No Course Available Here</h5>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}
