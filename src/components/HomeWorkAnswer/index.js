import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "survey-react/survey.css";
import * as Survey from "survey-react";
import HomeWorkImage from "../HomeWork/HomeWorkImage.png";
// Api
import Api from "../../Api";
import Loader from "../../components/core/Loader";
// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

class HomeWorkAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      homeworkScheduleId: this.props?.location?.state?.id,
      homeworkId: this.props?.location?.state?.homeworkId,
      lessonNumber: this.props?.location?.state?.courseLessonId?.lessonNumber,
      lessonName: this.props?.location?.state?.courseLessonId?.lessonName,
      courseName: this.props?.location?.state?.courseId?.name,
      reviewAnswer: [],
      questionCount: 0,
      answer: {
        "10+10": "20",
        "5-2": "item1",
        question1: ["item1"],
        question2: "left",
      },
      json: {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "text",
                name: "10+10",
              },
              {
                type: "radiogroup",
                name: "5-2",
                choices: [
                  {
                    value: "item1",
                    text: "3",
                  },
                  {
                    value: "item2",
                    text: "2",
                  },
                  {
                    value: "item3",
                    text: "4",
                  },
                ],
              },
              {
                type: "checkbox",
                name: "question1",
                title: "How many days do we have in a week?",
                choices: [
                  {
                    value: "item1",
                    text: "Seven",
                  },
                  {
                    value: "item2",
                    text: "Five",
                  },
                  {
                    value: "item3",
                    text: "Six",
                  },
                ],
              },
              {
                type: "text",
                name: "question2",
                title: "Which way is anti-clockwise, left or right",
              },
            ],
          },
        ],
      },
    };
  }

  getAnswer = () => {
    const { homeworkScheduleId } = this.state;
    Api.get(`api/v1/homeworkSchedule/schedule/get`, {
      params: {
        homeworkScheduleId: homeworkScheduleId,
      },
    }).then((response) => {
      const questions = response.data.getOne.homeworkId.questions;
      const answer = response.data.getOne.answers;
      const reviewAnswer = response.data.getOne.reviewAnswer;
      const questionCount = questions.pages[0].elements.length;
      this.setState({
        reviewAnswer: reviewAnswer,
        question: questions,
        answer: answer,
        isLoading: false,
        questionCount: questionCount,
      });
    });
  };

  componentDidMount() {
    this.getAnswer();
  }

  render() {
    const {
      isLoading,
      question,
      lessonNumber,
      courseName,
      lessonName,
      questionCount,
    } = this.state;
    const survey = new Survey.Model(question);
    survey.data = this.state.answer;
    survey.mode = "display";

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Container>
            <Row>
              <Col
                xs={12}
                sm={5}
                className="d-flex justiy-content-center align-items-center"
              >
                <img
                  src={HomeWorkImage}
                  alt="Snow"
                  width={"17%"}
                  height={"100%"}
                />
                <div>
                  <p className="mb-0 welcome-text">Welcome</p>
                  <h6>{`${"HomeWork   for Lesson" + lessonNumber}`}</h6>
                </div>
              </Col>
              <Col xs={12} sm={7} className="homework-heading ">
                <p className="coursename-text mb-0">{`${
                  courseName + "-" + lessonName
                }`}</p>
              </Col>
            </Row>
            <hr className="heading-bottom" />
            <Row>
              <Col xs={12} sm={8}>
                <div>
                  <Survey.Survey model={survey} />
                </div>
              </Col>
              <Col xs={12} sm={4}>
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ marginLeft: "30px" }}>Questions</th>
                      <th>Answers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(questionCount)].length > 0 &&
                      this.state.reviewAnswer?.map((list, index) => (
                        <tr>
                          <div className="d-flex justify-content-center ">
                            <tr>Q-{index + 1}</tr>
                          </div>
                          <td style={{ textAlign: "center" }}>
                            {list.answer ? (
                              <FontAwesomeIcon
                                icon={faCheck}
                                size="md"
                                color="green"
                                className="mx-1"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faTimes}
                                size="md"
                                color="#cf2b2be8"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
export default HomeWorkAnswer;
