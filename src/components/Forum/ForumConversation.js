import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Form, Modal } from "react-bootstrap";
import Avatar from "react-avatar";
import Stack from "@mui/material/Stack";
import Api from "../../Api";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import moment from "moment-timezone";
import { FaReply } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import "../../css/Forum.scss";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../core/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import MessageIcon from "@mui/icons-material/Message";
import Button from "@mui/material/Button";

// Helpers
import { getColorCode } from "../../utils/helper";

const forumSchema = Yup.object().shape({
  descriptionValue: Yup.string().required("Description Is Required"),
});

class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aliasName: props?.location?.state?.course?.aliasName,
      courseId: props?.location?.state?.course?.id,
      userId: "",
      specialityDescription: EditorState.createEmpty(),
      forumData: [],
      show: false,
      editText: "",
      questionId: "",
      value: "",
      colorList: [],
      userColor: "",
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

  handleModal() {
    this.setState({ show: !this.state.show });
  }

  componentDidMount = () => {
    this.getForum();
  };

  getForum = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("sessionId");

    this.setState({ userId: userId });
    Api.get("api/v1/forum/list", {
      params: {
        courseId: this.state.courseId,
        token: token,
      },
    })
      .then((response) => {
        this.setState({ forumData: response?.data?.forumList });
        const forumCount = this.state.forumData?.length;
        const colorData = this.getForumColor(forumCount);
        this.setState({ colorList: colorData });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  getForumColor = () => {
    let userIds = [];
    const userData = this.state.forumData;

    userData?.forEach((list) => {
      const userId = list?.userId?._id;
      if (userIds.indexOf(userId) < 0) {
        userIds?.push(userId);
      }
    });

    let forumUserColors = [];
    userIds?.forEach((userId) => {
      forumUserColors.push({
        userId: userId,
        color: getColorCode(),
      });
    });

    return forumUserColors;
  };

  getUserColorCode(colors, userId) {
    let color = "";

    colors.forEach((userColor) => {
      if (userColor?.userId === userId) {
        color = userColor.color;
      }
    });

    return color;
  }
  deleteMessage(value) {
    const questionId = value;
    const token = localStorage.getItem("sessionId");
    Api.delete("api/v1/forum/delete", {
      params: {
        id: questionId,
        token: token,
      },
    })
      .then((response) => {
        toast.success("Questions Deleted Successfully");
        this.getForum();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  }

  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  onChangeDescription = ({ setFieldValue }, e) => {
    const editedText = convertToRaw(e.getCurrentContent());
    setFieldValue("descriptionValue", editedText.blocks[0].text);
  };

  updateQuestion = (values) => {
    const userId = localStorage.getItem("userId");
    const convertedData = JSON.stringify(convertToRaw(this.state.editText.getCurrentContent()));

    let tempDate = new Date();
    let date =
      tempDate.getFullYear() +
      "-" +
      (tempDate.getMonth() + 1) +
      "-" +
      tempDate.getDate() +
      " " +
      tempDate.getHours() +
      ":" +
      tempDate.getMinutes() +
      ":" +
      tempDate.getSeconds();

    const newdate = moment(date).format("MMMM Do YYYY, h:mm:ss a");
    const token = localStorage.getItem("sessionId");

    Api.patch("/api/v1/forum/edit", {
      user: userId,
      questionId: this.state.questionId,
      question: convertedData,
      createdAt: newdate,
      token: token,
    })
      .then((response) => {
        this.getForum();
        toast.success("Questions Updated Successfully");
        window.location.reload();
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  //Submit Form
  submitForm = (values) => {
    const userId = localStorage.getItem("userId");
    const convertedData = JSON.stringify(convertToRaw(this.state.description.getCurrentContent()));

    let tempDate = new Date();
    let date =
      tempDate.getFullYear() +
      "-" +
      (tempDate.getMonth() + 1) +
      "-" +
      tempDate.getDate() +
      " " +
      tempDate.getHours() +
      ":" +
      tempDate.getMinutes() +
      ":" +
      tempDate.getSeconds();

    const newdate = moment(date).format("MMMM Do YYYY, h:mm:ss a");
    const token = localStorage.getItem("sessionId");
    Api.post("/api/v1/forum", {
      user: userId,
      courseId: this.state.courseId,
      question: convertedData,
      createdAt: newdate,
      token: token,
    })
      .then((response) => {
        const status = response.status;
        if (status === 201) {
          this.setState({ description: "" });
          toast.success("Forum Created Successfully Wait Untill Amdin Approve Your Questions");
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  render() {
    const { forumData, userId, value } = this.state;

    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <Container>
            <div className="d-flex justify-content-center ">
              <h4 style={{ marginTop: "15px" }}>{this.state.aliasName} </h4>
            </div>
            <Row>
              <Col className="my-3  ">
                {forumData?.length > 0 ? (
                  forumData?.map((list, i) => (
                    <Stack direction="row">
                      {list?.userId?.role === "student" ? (
                        list?.userId?.studentId?.imageUrl ? (
                          <div>
                            <Avatar
                              src={list?.userId?.studentId?.imageUrl}
                              size="45"
                              style={{ minWidth: "fit-content" }}
                              round={true}
                            />
                          </div>
                        ) : (
                          <Avatar
                            name={`${list?.userId?.firstName} ${list?.userId?.lastName}`}
                            size="45"
                            round={true}
                            color={`${this.getUserColorCode(this.state.colorList, list?.userId?._id)}`}
                          />
                        )
                      ) : list?.userId?.role === "parent" ? (
                        list?.userId?.parentId?.imageUrl ? (
                          <div>
                            <Avatar
                              src={list?.userId?.parentId?.imageUrl}
                              size="45"
                              style={{ minWidth: "fit-content" }}
                              round={true}
                            />
                          </div>
                        ) : (
                          <Avatar
                            name={`${list?.userId?.firstName} ${list?.userId?.lastName}`}
                            size="45"
                            round={true}
                            color={`${this.getUserColorCode(this.state.colorList, list?.userId?._id)}`}
                          />
                        )
                      ) : list?.userId?.teacherId?.imageUrl ? (
                        <div>
                          <Avatar
                            src={list?.userId?.teacherId?.imageUrl}
                            size="45"
                            style={{ minWidth: "fit-content" }}
                            round={true}
                          />
                        </div>
                      ) : (
                        <Avatar
                          name={`${list?.userId?.firstName} ${list?.userId?.lastName}`}
                          size="45"
                          round={true}
                          color={`${this.getUserColorCode(this.state.colorList, list?.userId?._id)}`}
                        />
                      )}
                      <div style={{ width: "100%", marginTop: "5px" }} className="ms-2">
                        <div className="forum-forum-forum ">
                          <strong>
                            {list?.userId?.firstName} {list?.userId?.lastName}
                          </strong>
                          {list?.replyCount > 0 ? null : (
                            <Typography className="forum-container mx-5">
                              {list?.userId?._id === userId ? (
                                <div>
                                  {/* <MdEdit
                                    className="mx-1"
                                    onClick={() => {
                                      const contentState = convertFromRaw(JSON.parse(list.question));
                                      const editorState = EditorState.createWithContent(contentState);
                                      this.setState({
                                        show: true,
                                        editText: editorState,
                                        questionId: list?.id,
                                        value: list,
                                      });
                                    }}
                                  /> */}
                                  <Tooltip title="Edit">
                                    <IconButton>
                                      <ModeEditOutlineIcon
                                        onClick={() => {
                                          const contentState = convertFromRaw(JSON.parse(list.question));
                                          const editorState = EditorState.createWithContent(contentState);
                                          this.setState({
                                            show: true,
                                            editText: editorState,
                                            questionId: list?.id,
                                            value: list,
                                          });
                                        }}
                                        color="success"
                                        style={{ fontSize: "20px" }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  {/* <MdDelete
                                    style={{ color: "#ff5722" }}
                                    onClick={(e) => {
                                      this.deleteMessage(list.id);
                                    }}
                                  /> */}
                                  <Tooltip title="Delete">
                                    <IconButton>
                                      <DeleteIcon
                                        color="error"
                                        style={{ fontSize: "20px" }}
                                        onClick={(e) => {
                                          this.deleteMessage(list.id);
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              ) : null}
                            </Typography>
                          )}
                        </div>
                        {list?.isActive === true ? (
                          <text
                            className="forum-color-color"
                            onClick={() =>
                              this.props.history.push({
                                pathname: "/forum/conversation",
                                state: { commentsData: list },
                              })
                            }
                            dangerouslySetInnerHTML={this.convertFromJSONToHTML(`${list.question}`)}
                          ></text>
                        ) : (
                          <text
                            className="forum-color-text"
                            dangerouslySetInnerHTML={this.convertFromJSONToHTML(`${list.question}`)}
                          ></text>
                        )}

                        <div className=" forum-conversation-alignment mt-3 mb-3">
                          {list?.isActive === true ? (
                            // <div
                            //   onClick={() => {
                            //     this.props.history.push({
                            //       pathname: "/forum/conversation",
                            //       state: { commentsData: list },
                            //     });
                            //   }}
                            //   className="forum-color"
                            //   style={{ cursor: "pointer" }}
                            // >
                            //   <FaReply color="blue" className="mx-1" />
                            //   Add Comments
                            // </div>
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                className="material-table-bt-color"
                                onClick={() => {
                                  this.props.history.push({
                                    pathname: "/forum/conversation",
                                    state: { commentsData: list },
                                  });
                                }}
                                endIcon={<MessageIcon />}
                              >
                                Add Comments
                              </Button>
                            </Stack>
                          ) : null}

                          <Typography style={{ display: "flex", flexDirection: "row" }}>
                            <b style={{ color: "blue" }} className="forum-page-font me-1">
                              {list?.replyCount ? list.replyCount : 0}
                            </b>{" "}
                            <div className="forum-page-font">replies</div>
                          </Typography>

                          <div>
                            <Typography>
                              <div className="forum-page-feature"> {list?.createdAt}</div>
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Stack>
                  ))
                ) : (
                  <div>
                    <p className="mt-3 mb-2">Forum Conversation Yet to be Created...!</p>
                  </div>
                )}

                <Formik
                  initialValues={{ descriptionValue: "", description: "" }}
                  validationSchema={forumSchema}
                  onSubmit={(values) => this.submitForm(values)}
                >
                  {(formik) => {
                    const { handleSubmit, setFieldValue, values } = formik;
                    return (
                      <Form onSubmit={handleSubmit} className="mt-3">
                        <Form.Label>Message :</Form.Label>
                        <div className="teacher-description ">
                          <Editor
                            spellCheck
                            name="descriptionValue"
                            editorState={this.state.description}
                            onEditorStateChange={(e) => {
                              this.setState({ description: e });
                              this.onChangeDescription({ setFieldValue }, e);
                            }}
                            toolbar={{
                              options: ["inline", "list", "textAlign"],
                            }}
                          />
                          <ErrorMessage name="descriptionValue" component="span" className="error text-danger" />
                        </div>
                        <div className="d-flex justify-content-end ">
                          <Button type="submit" className="mt-3 px-5 mb-4 MuiButton-containedPrimary">
                            Post
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
                <Modal centered show={this.state.show} size="lg" onHide={() => this.setState({ show: false })}>
                  <div className="forum-modal">
                    <Modal.Header closeButton>
                      <div>
                        <h5> Edit Forum</h5>
                        {value?.userId?.studentId ? (
                          <div className="d-flex flex-direction-row">
                            {value?.userId?.studentId?.imageUrl ? (
                              <Avatar
                                src={value?.userId?.studentId?.imageUrl}
                                size="45"
                                style={{ minWidth: "fit-content" }}
                                round={true}
                                color="#1c1364"
                              />
                            ) : (
                              <Avatar
                                name={`${value?.userId?.firstName} ${value?.userId?.lastName}`}
                                size="45"
                                round={true}
                                color="#1c1364"
                              />
                            )}{" "}
                            <div className="d-flex align-items-center mx-2">
                              <strong>
                                {value?.userId?.firstName} {value?.userId?.lastName}
                              </strong>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {value?.userId?.parentId ? (
                              <div className="d-flex flex-direction-row">
                                {" "}
                                {value?.userId?.parentId?.imageUrl ? (
                                  <div>
                                    <Avatar
                                      src={value?.userId?.parentId?.imageUrl}
                                      size="45"
                                      style={{ minWidth: "fit-content" }}
                                      round={true}
                                      color="#1c1364"
                                    />
                                  </div>
                                ) : (
                                  <Avatar
                                    name={`${value?.userId?.firstName} ${value?.userId?.lastName}`}
                                    size="45"
                                    round={true}
                                    color="#1c1364"
                                  />
                                )}
                                <div className="d-flex align-items-center mx-2">
                                  <strong>
                                    {value?.userId?.firstName} {value?.userId?.lastName}
                                  </strong>
                                </div>
                              </div>
                            ) : (
                              <div className="d-flex flex-direction-row">
                                {value?.userId?.teacherId ? (
                                  <div>
                                    {value?.userId?.teacherId?.imageUrl ? (
                                      <Avatar
                                        src={value?.userId?.teacherId?.imageUrl}
                                        size="45"
                                        style={{ minWidth: "fit-content" }}
                                        round={true}
                                        color="#1c1364"
                                      />
                                    ) : (
                                      <Avatar
                                        name={`${value?.userId?.firstName} ${value?.userId?.lastName}`}
                                        size="45"
                                        round={true}
                                        color="#1c1364"
                                      />
                                    )}
                                    <div className="d-flex align-items-center mx-2">
                                      <strong>
                                        {value?.userId?.firstName} {value?.userId?.lastName}
                                      </strong>
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Modal.Header>
                    <div className="teacher-description px-3 ">
                      <Editor
                        spellCheck
                        name="text"
                        editorState={this.state.editText}
                        onEditorStateChange={(e) => {
                          this.setState({ editText: e });
                        }}
                        toolbar={{
                          options: ["inline", "list", "textAlign"],
                        }}
                      />
                    </div>
                    <div className=" d-flex justify-content-end mt-2 mb-4">
                      <Button
                        name="button"
                        type="button"
                        onClick={() => this.updateQuestion()}
                        className="MuiButton-containedPrimary px-3"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Modal>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}

export default Forum;
