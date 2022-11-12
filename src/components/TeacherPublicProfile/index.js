import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Avatar from "react-avatar";
import Loader from "../../components/core/Loader";
//Api
import Api from "../../Api";

// Styles
import "../../css/TeacherPublicProfile.scss";
import { toast } from "react-toastify";

export default class TeacherPublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: this.props?.location?.state?.teacherId,
      teacherDetail: "",
      isLoading: true,
    };
  }

  //logout
  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  getTeacherDetail = () => {
    const token = localStorage.getItem("sessionId");
    Api.get(`api/v1/teacher/${this.state.teacherId}`).then((response) => {
      const data = response.data.data.getOne;
      this.setState({ teacherDetail: data, isLoading: false });
    });
  };

  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  componentDidMount() {
    this.getTeacherDetail();
  }

  render() {
    const { teacherDetail, isLoading } = this.state;
    return (
      <div className="p-4">
        <Container>
          {isLoading ? (
            <Loader />
          ) : (
            <Row>
              <Col sm={4} md={3} xs={12}>
                <div className="me-4">
                  <div className="d-flex justify-content-center mt-5 teacher-profile-public-alignment">
                    {teacherDetail?.imageUrl ? (
                      <img className="profile-image-size" src={teacherDetail?.imageUrl} alt="" />
                    ) : (
                      <Avatar
                        name={`${teacherDetail.firstName} ${teacherDetail.lastName}`}
                        size="150"
                        round={true}
                        color="silver"
                      />
                    )}
                  </div>
                  <div className="teacher-profile-public-alignment">
                    <p className="user-name justify-content-start mt-5 ">
                      {teacherDetail?.firstName + " " + teacherDetail?.lastName}
                    </p>
                    <p variant="secondary" className="teacher-specality">
                      Email:{`${teacherDetail?.email}`}
                    </p>
                    <p variant="secondary" className="teacher-specality text-left">
                      Speciality:
                      {`${teacherDetail?.speciality ? teacherDetail?.speciality : "-"}`}
                    </p>
                  </div>
                </div>
              </Col>
              <Col md={9} className="ps-5 mt-2">
                <div className="about-me">
                  {teacherDetail?.aboutUs === undefined ? (
                    <div>
                      <p className="aboutUs-label-style">About Me :</p>
                      <p>"Yet to be Updated"</p>
                    </div>
                  ) : (
                    <div>
                      <p className="aboutUs-label-style">About Me :</p>
                      <div dangerouslySetInnerHTML={this.convertFromJSONToHTML(teacherDetail?.aboutUs)}></div>
                    </div>
                  )}
                </div>
                {teacherDetail?.specialityDescription === undefined ? (
                  <div>
                    <p className="aboutUs-label-style">Speciality Description :</p>
                    <p>"Yet to be Updated"</p>
                  </div>
                ) : (
                  <div>
                    <p className="aboutUs-label-style">Speciality Description :</p>
                    <div
                      dangerouslySetInnerHTML={this.convertFromJSONToHTML(teacherDetail?.specialityDescription)}
                    ></div>
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}
