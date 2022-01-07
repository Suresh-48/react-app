import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Avatar from "react-avatar";
import Loader from "../../components/core/Loader";

//Api
import Api from "../../Api";

// Styles
import "../../css/TeacherPublicProfile.scss";

export default class TeacherPublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: this.props?.location?.state?.teacherId,
      teacherDetail: "",
      isLoading: true,
    };
  }

  getTeacherDetail = () => {
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

  componentDidMount = () => {
    this.getTeacherDetail();
  };

  render() {
    const { teacherDetail, isLoading } = this.state;
    return (
      <div>
        <Container>
          {isLoading ? (
            <Loader />
          ) : (
            <Row>
              <Col sm={4} md={3} xs={12} className="px-4">
                <div>
                  <div className="d-flex justify-content-center mt-5">
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
                  <p className="user-name">{teacherDetail?.firstName + " " + teacherDetail?.lastName}</p>
                  <div>
                    <div className="d-grid justify-content-start mb-0">
                      <p className="label-style">Speciality: </p>
                      <p>{teacherDetail?.speciality}</p>
                    </div>
                    <div className="d-grid justify-content-start mb-0">
                      <p className="label-style">Email: </p>
                      <p>{teacherDetail?.email}</p>
                    </div>
                    {/* {teacherDetail?.address1 ? (
                      <div className="d-grid justify-content-start">
                        <p className="label-style">Address: </p>
                        <p className="mb-0">
                          {teacherDetail?.address1 + "," + " " + teacherDetail?.address2 + "," + " "}
                        </p>
                        <p className="mb-0">{teacherDetail?.city + "," + " " + teacherDetail?.state + "," + " "}</p>
                        <p className="mb-0">{teacherDetail?.zipCode + "."}</p>
                      </div>
                    ) : (
                      null
                    )} */}
                  </div>
                </div>
              </Col>
              <Col md={9} className="mt-2">
                {teacherDetail?.aboutUs === undefined ? null : (
                  <div>
                    <p className="aboutUs-label-style">About Me :</p>
                    <div dangerouslySetInnerHTML={this.convertFromJSONToHTML(teacherDetail?.aboutUs)}></div>
                  </div>
                )}
                <div>
                  <p className="aboutUs-label-style">Speciality Description :</p>
                  <div dangerouslySetInnerHTML={this.convertFromJSONToHTML(teacherDetail?.specialityDescription)}></div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}
