import TiCardLarge from "../../../tiCardLarge/tiCardLarge";
import {
  Form,
  Steps,
  Button,
  Select,
  Textarea,
  Upload,
  Radio,
  Swiper,
} from "tdesign-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { CloseCircleIcon } from "tdesign-icons-react";
import "./ticketDetailBase.css";
// import axios from 'axios';

import axios from "../../../user/axiosInstance";
import { cos } from "../../../cos";
import { useNavigate } from "react-router-dom";

const { StepItem } = Steps;
const { Option } = Select;
const { FormItem } = Form;
const { SwiperItem } = Swiper;
const Bucket = window.sessionStorage.getItem("Bucket");
const Region = window.sessionStorage.getItem("Region");

// 附件
function TiImg(props) {
  let [urlList, setUrlList] = useState([]);
  const [showMsk, setShowMsk] = useState(false);
  function closeMask() {
    setShowMsk(false);
  }
  const fetchUrlList = async function () {
    if (props.data) {
      let nameList = props.data.split(",");
      let promises = nameList.map((name) => getObject(name));
      let results = await Promise.all(promises);
      setUrlList(results);
      async function getObject(item) {
        return new Promise((resolve, reject) => {
          cos.getObject(
            {
              Bucket: Bucket /* 填入您自己的存储桶，必须字段 */,
              Region: Region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
              Key:
                "ticket/" +
                item /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
              DataType: "blob",
            },
            function (err, data) {
              if (err) reject(err);
              resolve(URL.createObjectURL(data.Body));
            }
          );
        });
      }
    }
  };
  const content = urlList.map((url, index) => (
    <div className="ti-small-img" key={index}>
      <img
        src={url}
        onClick={() => {
          setShowMsk(true);
        }}
      />
    </div>
  ));
  useEffect(() => {
    fetchUrlList();
  }, [props.data]);
  return (
    <>
      {content}
      {showMsk ? (
        <ShowImg
          data={urlList}
          handleClick={() => {
            closeMask();
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}

// 遮罩
function ShowImg(props) {
  return (
    <div className="ti-mask">
      <BasicSwiper data={props.data} />
      <CloseCircleIcon
        size="35px"
        style={{
          position: "absolute",
          right: "10vw",
          top: "6vh",
          color: "white",
          cursor: "pointer",
        }}
        onClick={props.handleClick}
      />
    </div>
  );
}
// 图片大图预览
function BasicSwiper(props) {
  return (
    <div className="ti-swiper-wrapper">
      <Swiper autoplay={false} className="ti-swiper">
        {props.data.map((item, index) => (
          <SwiperItem key={index}>
            <div className="ti-swiper-item-block">
              <img src={item}></img>
            </div>
          </SwiperItem>
        ))}
      </Swiper>
    </div>
  );
}

//流转历史
export function TicketProcess(props) {
  let status = props.data.status;
  if (status === "超时" || status === "驳回") {
    status = 0;
  } else if (status === "审批通过") {
    status = 2;
  } else {
    status = 1;
  }
  console.log("status", status);
  return status === 0 ? (
    <TiCardLarge title="工单进度" className="ti-info">
      <Steps>
        {/* <StepItem title="创建" /> */}
        <StepItem title="进行中" />
        <StepItem status="error" title="未通过" />
      </Steps>
    </TiCardLarge>
  ) : (
    <TiCardLarge title="工单进度" className="ti-info">
      <Steps current={status - 1}>
        {/* <StepItem title="创建" /> */}
        <StepItem title="进行中" />
        <StepItem title="完成" />
      </Steps>
    </TiCardLarge>
  );
}

export function TicketContent(props) {
  return (
    <TiCardLarge title="工单内容" className="ti-info">
      <div className="ti-info-block">
        <div className="ti-info-item">
          <span className="ti-info-item-title">标题：</span>
          <span className="ti-info-item-content">{props.data.orderName}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">内容：</span>
          <span className="ti-info-item-content">{props.data.content}</span>
        </div>
        {/* <div className="ti-info-item">
                    <span className="ti-info-item-title">附件：</span>
                    <div className="ti-info-item-content">
                        {
                            props.data.attachment ?                       
                                <TiImg data={props.data.attachment} />
                             : ''
                        }
                    </div>
                </div> */}
      </div>
    </TiCardLarge>
  );
}

export function TicketBase(props) {
  return (
    <TiCardLarge title="基本信息" className="ti-info">
      <div className="ti-info-block ti-base-info">
        <div className="ti-info-item">
          <span className="ti-info-item-title">工单ID：</span>
          <span className="ti-info-item-content">{props.data.id}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">创建者：</span>
          <span className="ti-info-item-content">{props.data.createUser}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">创建时间：</span>
          <span className="ti-info-item-content">{props.data.createTime}</span>
        </div>
        {/*<div className="ti-info-item">*/}
        {/*    <span className="ti-info-item-title">所属部门：</span>*/}
        {/*    <span className="ti-info-item-content">{props.data.dept_name}</span>*/}
        {/*</div>*/}
        {/*<div className="ti-info-item">*/}
        {/*    <span className="ti-info-item-title">分类：</span>*/}
        {/*    <span className="ti-info-item-content">{props.data.category_name}</span>*/}
        {/*</div>*/}
      </div>
    </TiCardLarge>
  );
}

export function TicketHistory(props) {
  const [showMsk, setShowMsk] = useState(false);
  const [urlList, setUrlList] = useState([]);
  const fetchUrlList = async function (attachment) {
    if (attachment) {
      let nameList = attachment.split(",");
      let promises = nameList.map((name) => getObject(name));
      let results = await Promise.all(promises);
      setUrlList(results);
      async function getObject(item) {
        return new Promise((resolve, reject) => {
          cos.getObject(
            {
              Bucket: Bucket /* 填入您自己的存储桶，必须字段 */,
              Region: Region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
              Key:
                "ticket/" +
                item /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
              DataType: "blob",
            },
            function (err, data) {
              if (err) reject(err);
              resolve(URL.createObjectURL(data.Body));
            }
          );
        });
      }
    }
  };

  function closeMask() {
    setShowMsk(false);
  }
  let processList = props.data.process_list;
  let status = props.data.status;
  let stepsList;
  let content;
  if (processList && processList.length > 0) {
    stepsList = processList.map((item, index) => {
      let attachment;
      if (item.attachment) {
        attachment = (
          <Button
            size={"small"}
            onClick={() => {
              setShowMsk(true);
              fetchUrlList(item.attachment);
            }}
          >
            查看附件
          </Button>
        );
      }
      if (status === 2 && index === processList.length - 1) {
        if (item.to) {
          return (
            <StepItem
              title={`由${item.from}完成，并且指派给${item.to}`}
              content={item.desc}
              key={index}
            >
              {attachment}
            </StepItem>
          );
        } else {
          return (
            <StepItem
              title={`由${item.from}完成`}
              content={item.desc}
              key={index}
            >
              {attachment}
            </StepItem>
          );
        }
      } else {
        return (
          <StepItem
            title={`由${item.from}指派给${item.to}`}
            content={item.desc}
            key={index}
          >
            {attachment}
          </StepItem>
        );
      }
    });
  }
  if (stepsList) {
    content = (
      <>
        <TiCardLarge title="流转历史" className="ti-info">
          <Steps layout="vertical" theme="dot" current={0}>
            {stepsList}
          </Steps>
        </TiCardLarge>
        {showMsk ? (
          <ShowImg
            data={urlList}
            handleClick={() => {
              closeMask();
            }}
          />
        ) : (
          ""
        )}
      </>
    );
  }
  return <>{content}</>;
}

export function TicketDistribute(props) {
  const formRef = useRef();
  const onReset = (e) => {};
  // 提交表单
  const onSubmit = (e) => {
    if (e.validateResult === true) {
      let formValues = formRef.current.getFieldsValue(true);
      let parmas = Object.assign({}, formValues, { ticket_id: props.data.id });

      // api
      //   .post("/admin/v1/ticket/distribute", parmas)
      //   .then((data) => {
      //     api.dialog.alert({
      //       title: "系统消息",
      //       msg: "操作成功",
      //     });
      //   })
      //   .catch((err) => {
      //     api.message.error("操作失败", 2000);
      //   });
    }
  };

  const rules = {
    dept_id: [{ required: true, message: "必填", type: "error" }],
    category_id: [{ required: true, message: "必填", type: "error" }],
  };

  let departmentOptions;
  if (props.deptData && props.deptData.length > 0) {
    departmentOptions = props.deptData.map((item) => (
      <Option key={item.id} label={item.name} value={item.id} />
    ));
  }
  let categoryOptions;
  if (props.categoryData && props.categoryData.length > 0) {
    categoryOptions = props.categoryData.map((item) => (
      <Option key={item.id} label={item.name} value={item.category_id} />
    ));
  }
  let formCategory;
  if (props.data && props.data.category) {
    formCategory = (
      <FormItem
        label="分类"
        name="category_id"
        initialData={props.data.category}
      >
        <Select style={{ width: "40%" }} clearable>
          {categoryOptions}
        </Select>
      </FormItem>
    );
  }
  let formDepartment = (
    <FormItem label="分发给" name="dept_id">
      <Select style={{ width: "40%" }} clearable>
        {departmentOptions}
      </Select>
    </FormItem>
  );
  return (
    <Form
      ref={formRef}
      colon={true}
      rules={rules}
      onSubmit={onSubmit}
      onReset={onReset}
    >
      <TiCardLarge title="分配工单" className="ti-info ti-bottom">
        {formCategory}
        {formDepartment}
      </TiCardLarge>
      <div className="ti-form-submit-container">
        <div className="ti-form-submit-sub">
          <Button type="submit" content="提交"></Button>
          <Button
            type="reset"
            theme="default"
            content="取消"
            className="reset"
          ></Button>
        </div>
      </div>
    </Form>
  );
}

export function TicketTask(props) {
  const [task, setTask] = useState({});
  useEffect(() => {
    if (props.data.process_list && props.data.process_list.length > 0) {
      let index = props.data.process_list.length - 1;
      setTask(props.data.process_list[index]);
    } else {
      setTask({
        from: "客服分单",
        desc: props.data.content,
        attachment: props.data.attachment,
      });
    }
  }, [props.data]);
  return (
    <TiCardLarge title="任务详情" className="ti-info">
      <div className="ti-info-block">
        <div className="ti-info-item">
          <span className="ti-info-item-title">派发人：</span>
          <span className="ti-info-item-content">{task.from}</span>
        </div>
        <div className="ti-info-item">
          <span className="ti-info-item-title">内容：</span>
          <span className="ti-info-item-content">{task.desc}</span>
        </div>
        {/* <div className="ti-info-item">
                    <span className="ti-info-item-title">附件：</span>
                    <div className="ti-info-item-content">
                        {
                            task.attachment ?                       
                                <TiImg data={task.attachment} />
                             : ''
                        }
                    </div>
                </div> */}
      </div>
    </TiCardLarge>
  );
}

export function TicketHandle(props) {
  const formRef = useRef();
  const user_id = window.sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  // 提交表单

  const [positionId, setpositionId] = useState("");

  const workstation_onChange = (value) => {
    setpositionId(value);
  };

  // 结束工单按钮
  const onSubmitComplete = (e) => {
    let ticketId = props.data.id;
    let flag = true;
    axios
      .get(
        `/process/completeTask?flag=${flag}&orderId=${ticketId}`
      )
      .then((res) => {
        if (res.data.code === 1) {
          alert("结束成功");
          navigate("/");
        } else {
          // 更新失败，处理错误情况
          console.log("更新失败");
        }
      })
      .catch((error) => {
        // 处理请求错误
        console.log("请求错误", error);
      });
  };

  // 分发工单提交按钮
  const onSubmit = (e) => {
    if (e.validateResult === true) {
      let formValues = formRef.current.getFieldsValue(true);
      console.log(formValues);
      let { desc, attachment, handler } = formValues;
      let attachmentList = attachment
        ? attachment.map((item) => `${user_id}_${item.uid}_${item.name}`)
        : [];
      attachment = attachmentList.join(",");
      let parmas = Object.assign(
        {},
        { desc, attachment, handler },
        { ticket_id: props.data.id }
      );
      //    console.log('params', parmas)

      // 审核或结束工单
      let ticketId = props.data.id;
      let positionName = props.data.positionName;
      if (formValues.complete === 0 || formValues.complete === 1) {
        console.log("formValues.complete", formValues.complete);
        let flag = true;
        if (formValues.complete === 0) flag = false;
        axios
          .get(
            `/process/completeTask?flag=${flag}&orderId=${ticketId}`
          )
          .then((res) => {
            if (res.data.code === 1) {
              alert("审核成功");
              navigate("/");
            } else {
              // 更新失败，处理错误情况
              console.log("更新失败");
              alert("审核失败");
              navigate("/");
            }
          })
          .catch((error) => {
            // 处理请求错误
            console.log("请求错误", error);
            alert("审核失败");
            navigate("/");
          });
      } else if (user_id === "2") {
        // api.dialog.alert({
        //     title: '系统消息',
        //     msg: '转单必须选择指派人',
        // })
        console.log("指派给：positionId", positionId);

        if (positionId === "") {
          alert("请选择协助单位！");
        } else {
          axios
            .post(
              `http://localhost:8080/process/setAssignee?orderId=${ticketId}&positionId=${positionId}`
            )
            .then((res) => {
              console.log("res paifa", res);
              if (res.data.code === 1) {
                alert("派发工单成功");
                navigate("/");
              } else {
                // 更新失败，处理错误情况
                console.log("提交失败");
                alert("提交失败");
                navigate("/");
              }
            })
            .catch((error) => {
              // 处理请求错误
              alert("请选择指派单位");
              console.log("请求错误", error);
            });
        }
      }
    }
  };
  const rules = {
    desc: [{ required: true, message: "必填", type: "error" }],
    attachment: [],
    handler: [],
    complete: [],
  };
  const uploadObj = useCallback((file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = () => {
        var body = dataURLtoBlob(reader.result);
        let name = user_id + "_" + file.uid + "_" + file.name;
        cos.putObject(
          {
            Bucket: Bucket /* 填入您自己的存储桶，必须字段 */,
            Region: Region /* 存储桶所在地域，例如ap-beijing，必须字段 */,
            Key:
              "ticket/" +
              name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
            StorageClass: "STANDARD",
            Body: body, // 上传文件对象
            onProgress: function (progressData) {},
          },
          function (err, data) {
            if (data) {
              resolve({
                status: "success",
                response: {
                  url: file.url,
                  name: name,
                },
              });
            } else {
              resolve({
                status: "fail",
                error: "上传失败",
              });
            }
          }
        );
      };
    });
  });
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(",");
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  const employeeList = props.employeeData;
  // let options = []
  const options = employeeList.map((item) => ({
    label: item.positionName,
    value: item.id,
  }));

  // if (employeeList && employeeList.length > 0) {
  //     options = employeeList.map(item=>
  //         <Option key={item.id} label={item.positionName} value={item.positionName} />
  //     )
  // }

  return (
    <TiCardLarge title="处理工单" className="ti-info">
      <Form ref={formRef} colon={true} rules={rules} onSubmit={onSubmit}>
        {/* <FormItem label="内容" name="desc">
                    <Textarea 
                        placeholder="请输入内容" 
                        maxlength={200}
                    />
                </FormItem> */}
        {console.log("userid:", user_id)}
        {user_id === "1" ? (
          <FormItem label="是否通过" name="complete">
            <Radio.Group defaultValue={0}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </Radio.Group>
          </FormItem>
        ) : (
          <div>
            <FormItem label="转发给" name="handler">
              <Select
                value={positionId}
                onChange={workstation_onChange}
                style={{ width: "40%" }}
                clearable
                options={options}
              />
            </FormItem>
            {/* <FormItem label="结束工单" name="complete">
                            <Radio.Group defaultValue={0}>
                                <Radio value={1}>是</Radio>
                            </Radio.Group>
                        </FormItem> */}
          </div>
        )}
        {/* <FormItem label="附件" name="attachment">
                    <Upload
                        requestMethod={uploadObj}
                        theme="image"
                        tips="允许选择多张图片文件上传，最多只能上传 3 张图片"
                        accept="image/*"
                        multiple
                        max={3}
                    />
                </FormItem> */}
        <div className="ti-handle-submit-container">
          <FormItem style={{ marginLeft: 25 }}>
            {user_id === "1" ? (
            <Button type="submit" content="审核"></Button>
            ):(
              <Button type="submit" content="分发"></Button>)
            }

            {user_id === "1" ? (
              <div />
            ) : (
              <Button
                style={{ marginLeft: 50 }}
                onClick={onSubmitComplete}
                type="button"
                content="完成工单"
              ></Button>
            )}
          </FormItem>
          {/* {user_id === "1" ? (
            <div />
          ) : (
              <Form ref={formRef} colon={true} onSubmit={onSubmitComplete}> */}
          <FormItem></FormItem>
          {/* </Form>
          )} */}
        </div>
      </Form>
    </TiCardLarge>
  );
}