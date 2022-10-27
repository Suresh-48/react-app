import React, { Component } from "react";
import Multiselect from "multiselect-react-dropdown";
import { Container, Row, Col, Button, Spinner, FormControl, Form, InputGroup, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Slider } from "@material-ui/core";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Label from "../../components/core/Label";

// Styles
import "../../css/AllCourseList.scss";

// Api
import Api from "../../Api";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter } from "@fortawesome/free-solid-svg-icons";

// Component
import Loader from "../core/Loader";
import CourseCard from "../../components/core/CourseCard";
import { toast } from "react-toastify";

export default class AllCourseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      landingPageCategoryList: this.props?.location?.state,
      courseList: [],
      data: [],
      category: [],
      search: "",
      currentPage: 1,
      postPerPage: 8,
      isLoading: true,
      range: [0, 500],
      spinner: false,
      searchModalOpen: false,
    };
  }

  onSelected = (selectedList) => {
    this.setState({ data: selectedList });
    // this.setState({ search: "" });
    // this.courseFilter();
  };
  onRemove = (selectedList) => {
    this.setState({ data: selectedList });
  };

  // Convert Description
  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  logout = () => {
    setTimeout(() => {
      localStorage.clear(this.props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Get category list option
  getCategory = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/category", {
      headers: {
        token: token,
      },
    }).then((res) => {
      this.setState({ category: res.data.data.data, isLoading: false, spinner: false });
      console.log("first category", res.data.data.data);
    });
  };

  //handle Pagination
  handlePageClick = (data) => {
    let selected = data.selected + 1;
    this.setState({ currentPage: selected });
  };

  componentDidMount() {
    this.getCategory();
    this.courseFilter();
  }

  //filter course list data
  courseFilter = (searchData) => {
    const userId = localStorage.getItem("userId");
    const { data, range, search, landingPageCategoryList } = this.state;
    let categoryList = [];
    categoryList.push(landingPageCategoryList);
    const token = localStorage.getItem("sessionId");
    Api.post("api/v1/course/filter", {
      userId: userId,
      filter: landingPageCategoryList ? categoryList : data,
      range: range,
      search: searchData === undefined ? search : searchData,
      token: token,
    })
      .then((res) => {
        const data = res.data.data;
        const assending = data.sort((a, b) => a - b);
        this.setState({
          courseList: assending,
          isLoading: false,
          spinner: false,
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

  handleChange = (e) => {
    this.setState({ search: e });
  };

  spinnerLoader = () => {
    this.setState({ spinner: !this.state.spinner });
  };

  render() {
    const { currentPage, postPerPage, courseList, isLoading, range } = this.state;

    // Pagination
    const lastPage = currentPage * postPerPage;
    const firstPage = lastPage - postPerPage;
    const courseDataList = courseList.slice(firstPage, lastPage);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(courseList?.length / postPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <div>
        {isLoading ? null : (
          <div className=" ms-4 search-col mt-4">
            <h4 className="d-flex align-items-center">Courses</h4>
            <Form className="d-flex mt-2">
              <div>
                <Form.Group className="search-col">
                  <Label>Search By Course Name</Label>
                  <FormControl
                    type="text"
                    name="name"
                    onChange={(e) => {
                      this.handleChange(e.target.value);
                      this.courseFilter(e.target.value);
                    }}
                    className="form-width"
                    placeholder="Search By Course Name"
                  />
                </Form.Group>
              </div>
              <div className="mt-4 ">
                <InputGroup
                  className=" mx-2 filter-ico"
                  onClick={() => {
                    this.setState({ searchModalOpen: true });
                  }}
                >
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faFilter} />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </Form>
          </div>
        )}
        {isLoading ? (
          <Loader />
        ) : (
          <Container fluid style={{ marginTop: "0%" }}>
            <Row>
              <Col className="d-flex mt-1 h-100">
                {isLoading === true ? (
                  <div className="d-flex position-absolute top-50 start-50 ">
                    <Spinner animation="grow" variant="primary" />
                    <span>
                      <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
                    </span>
                  </div>
                ) : courseDataList.length > 0 ? (
                  <Row style={{ marginLeft: 10 }}>
                    <Row className="mt-3">
                      {courseDataList.map((course, index) => (
                        <Col xs={12} sm={4} md={4} lg={4} xl={4}>
                          <CourseCard
                            course={course}
                            key={index}
                            onClick={this.spinnerLoader}
                            reload={this.courseFilter}
                          />
                        </Col>
                      ))}
                    </Row>
                    <Row className="mt-3">
                      <div className="pagination-width">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          breakClassName={"break-me"}
                          pageCount={pageNumbers?.length}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          onPageChange={this.handlePageClick}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                          pageClassName={"page-item"}
                          pageLinkClassName={"page-link"}
                          previousClassName={"page-item"}
                          previousLinkClassName={"page-link"}
                          nextClassName={"page-item"}
                          nextLinkClassName={"page-link"}
                        />
                      </div>
                    </Row>
                    {this.state.spinner && (
                      <div className="spanner">
                        <Spinner animation="grow" variant="light" />
                        <span>
                          <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
                        </span>
                      </div>
                    )}
                  </Row>
                ) : (
                  <div class="position-absolute top-50 start-50 center-alignment">No Courses Available Here</div>
                )}
              </Col>
            </Row>
          </Container>
        )}
        <Modal
          show={this.state.searchModalOpen}
          centered
          backdrop="static"
          onHide={() => {
            this.setState({ searchModalOpen: false });
            this.setState({ search: "" });
          }}
          size="md"
        >
          <Modal.Header closeButton className="border-bottom-0">
            <h5 className="filter-head-cls">Apply Filters</h5>
          </Modal.Header>
          <Modal.Body className="p-4 pt-0">
            <div>
              <div className="d-block justify-content-center">
                <p className="filter-type-name mb-1">Category</p>
                <div>
                  <Multiselect
                    options={this.state.category}
                    onSelect={this.onSelected}
                    onRemove={this.onRemove}
                    displayValue="name"
                    placeholder="Select Category"
                    avoidHighlightFirstOption={true}
                    style={{ backgroundColor: "white" }}
                  />
                </div>

                <div className="mt-4">
                  <p className="filter-type-name mb-1">Search by name</p>
                  <div className="input-group">
                    <input
                      type="text"
                      value={this.state.search}
                      className="form-control input-font-style"
                      onChange={(e) => {
                        this.setState({ search: e.target.value });
                        this.courseFilter(e.target.value);
                      }}
                      placeholder="Search"
                      aria-label="Dollar amount (with dot and two decimal places)"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="filter-type-name mb-0">Price Range</p>
                  <Slider
                    className="range-clr mx-2"
                    getAriaLabel={() => "Minimum distance"}
                    min={0}
                    max={1000}
                    value={this.state.range}
                    onChange={(event, newValue) => {
                      this.setState({ range: newValue });
                    }}
                    valueLabelDisplay="auto"
                  />
                  <div className="slider-count m-0">
                    <p>${range[0]}</p>
                    <p>${range[1]}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <Button
                      variant="danger"
                      onClick={() => {
                        this.setState({ search: "", data: [""] });
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="Kharpi-cancel-btn mx-3"
                      variant="light"
                      onClick={() => {
                        this.setState({ searchModalOpen: false, search: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="Kharpi-save-btn"
                      onClick={() => {
                        this.courseFilter();
                        this.setState({ searchModalOpen: false, search: "" });
                      }}
                    >
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
