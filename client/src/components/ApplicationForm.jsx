import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import qs from 'qs';

function ApplicationForm(){


    const [courseList, setCourseList] = useState([{}]);

    const [newValue, setNewValue] = useState({
        username: "",
        email: "",
        staffid: "CS",
        post: "",
        dept: "",
        course: "",
    });
    
    const [isDataObtained, setIsDataObtained] = useState(false);
   

    const fields = ["姓名", "電郵", "職員編號", "職位", "單位", "報讀課程"];
    var role = "";

    useEffect( () => {

        if(!isDataObtained){

            const futureCourseURL = "/futureCourse";
            const futureCourseOptions = {
                method: "GET",
                headers: {
                  "Accept": "application/json",
                }
            };

            fetch(futureCourseURL, futureCourseOptions)
            .then(res => res.json())
            .then(res => {
                if(res.length > 0){
                        setCourseList(res);
                        setNewValue(prevValue => {
                        
                            return{
                                ...prevValue,
                                course: res[0]
                            }
                        })
                    }
                console.log(newValue.course);
                setIsDataObtained(true);
            }).catch(err => {
                console.log("futureCourse: " + err);
            });

        }

        
    })

    function enroll(course){

        const url = "/enroll";
        const options = {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify({
                "courseID": course._id, 
                "enrollment": newValue,
                "courseName": course.courseName,
                "registeredBy": localStorage.getItem("email")
            })
        };

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                alert("成功報讀課程");
                clearInput();
            }else{
                alert("未能成功報讀課程, 請稍後再嘗試");
            }
        }).catch(err => {
            console.log("enroll: " + err);
        });
    }

    function waitinglist(){

        const url = "/waitinglist";
        const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify({
                "enrollment": newValue,
                "registeredBy": localStorage.getItem("email")
            })
        };

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                alert("課程名額暫滿，你將會加進後備名單。如最後能夠成功報讀，屆時將會以公司電郵通知");
                clearInput();
            }else{
                alert("發生錯誤，請稍後再嘗試");
            }
        }).catch(err => {
            console.log("waitinglist: " + err);
        });
    }


    function checkQuota(){

        if(newValue.email !== ""){

            console.log("CourseID: " + newValue.course);
            const url = "/checkQuota";
            const options = {
                method: "POST",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: qs.stringify({
                    "courseID": newValue.course
                })
            };

            fetch(url, options)
            .then(res => {
                if(res.status === 200){
                    return res.json()
                }else{
                    alert("發生錯誤，請稍後再嘗試");
                    return "error";
                }
            })
            .then(res => {
                console.log(res);
                if(res.quota === 0){
                    waitinglist();
                }else if(res !== "error"){
                    enroll(res);
                }
            }).catch(err => {
                console.log("Login: " + err);
            });
        }else{
            alert("請輸入有效資料");
        }
    }


    function handleSubmit(event){

        event.preventDefault();
        checkQuota();
        //enroll();
    }

    function clearInput(){

        setNewValue(prevValue => {
                    
            return {
                ...prevValue,
                username: "",
                email: "",
                staffid: "",
                post: "",
                dept: ""
            }

        });

    }


    function handleChange(event){

        const {name, value} = event.target;

        console.log(value);

        setNewValue(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }; 
        });

    }

    return (
        <div>
    <Header />
    <img src="https://www.hohcs.org.hk/App/Modules/Admin/Tpl/Static/upload/image/20170418/20170418125117_21846.png" className="formIcon"/>

    <p className="reminderText">如替其他同事報名，請填上同事資料</p>
    <p className="reminderText">於提交名單前須先取得主管批淮</p>

    
    <Form className="inputForm" onSubmit={handleSubmit}>
    
        <div className="inputRow">
            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">英文名稱:</Form.Label>
                    <Form.Control placeholder={fields[0]} size="lg" onChange={handleChange} value={newValue.username} name="username" required></Form.Control>
                </FormGroup>
            </div>

            <div className="inputItem"></div>

            <div className="inputItem">
                <FormGroup className="inputItem">
                    <Form.Label className="inputLabel">電郵:</Form.Label>
                    <InputGroup>
                        <Form.Control placeholder={fields[1]} size="lg" name="email" type="text" onChange={handleChange} value={newValue.email} className="input" required></Form.Control>
                        <InputGroup.Append>
                            <InputGroup.Text>@hohsc.org.hk</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup> 
                </FormGroup>
            </div>
        </div>
            
        <div className="inputRow">

            <div className="inputItem">

                <FormGroup>
                    <Form.Label className="inputLabel">職員編號:</Form.Label>
                    <Form.Control placeholder={fields[2]} size="lg" onChange={handleChange} value={newValue.staffid} name="staffid" required></Form.Control>
                </FormGroup>
            </div>

            <div className="inputItem"></div>

            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">職位簡稱（英文）:</Form.Label>
                    <Form.Control placeholder={fields[3]} size="lg" onChange={handleChange} value={newValue.post} name="post" required></Form.Control>
                </FormGroup>
            </div>

        </div>
            

        <div className="inputRow">

            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">單位簡稱（英文）:</Form.Label>
                    <Form.Control placeholder={fields[4]} size="lg" onChange={handleChange} value={newValue.dept} name="dept" required></Form.Control>
                </FormGroup>
            </div>

            <div className="inputItem"></div>

            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">報讀課程:</Form.Label>
                    <Form.Control size="lg" onChange={handleChange} name="course" as="select" className="courseSelection" required>
                        <option>請選擇課程</option>
                        {courseList.length > 0 && courseList.map(course => {
                            var date = new Date(course.date);
                        return <option value={course._id}>{course.courseName} {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</option>
                        })}
                    </Form.Control>
                </FormGroup>
            </div>

        </div>

        <div className="btnWrapper">
            <Button variant="primary" size="lg" type="submit" className="submitBtn">提交</Button>

            <Button variant="danger" size="lg" onClick={clearInput} className="clearBtn">清除所有資料</Button>
        </div>

    </Form>
    <Footer role={role}/>
    </div>
    );
}

export default ApplicationForm;