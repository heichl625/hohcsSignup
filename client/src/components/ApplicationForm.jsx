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
        staffid: "",
        post: "",
        dept: "",
        course: "",
    });
    
    const [isDataObtained, setIsDataObtained] = useState(false);
   

    const fields = ["姓名", "電郵", "職員編號", "職位", "單位", "報讀課程"];
    var role = "";

    function getFutureCourses(){

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
    
                        const date = new Date(res[0].date);
                        const dateStr = date.toLocaleDateString();
    
                        return{
                            ...prevValue,
                            course: res[0].courseName + " " + dateStr
                        }
                    })
                }
            setIsDataObtained(true);
        }).catch(err => {
            console.log("futureCourse: " + err);
        });
    }

    useEffect( () => {

        if(!isDataObtained){
            const url = "/user";
            const options = {
                method: "POST",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: qs.stringify({"username": localStorage.getItem("username")})
            };

            fetch(url, options)
            .then(res => res.json())
            .then(res => {

                role = res.role;

                if(role === "admin"){
                    localStorage.setItem("isAdmin", true);
                }

                setNewValue({
                    username: res.name,
                    email: res.username,
                    staffid: res.staffid,
                    post: res.post,
                    dept: res.dept,
                    course: "",
                })
            }).catch(err => {
                console.log("user: " + err);
            });
            getFutureCourses();
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
                "registeredBy": localStorage.getItem("username")
            })
        };

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                alert("成功報讀課程");
                clearInput();
                // setNewValue(prevValue => {
                    
                //     return {
                //         ...prevValue,
                //         username: "",
                //         email: "",
                //         staffid: "",
                //         post: "",
                //         dept: ""
                //     }

                // });
            }else{
                alert("未能成功報讀課程, 請稍後再嘗試");
            }
        }).catch(err => {
            console.log("enroll: " + err);
        });
    }



    function waitinglist(courseName, courseDate){

        const url = "/waitinglist";
        const options = {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify({
                "courseName": courseName,
                "courseDate": courseDate,
                "enrollment": newValue,
                "registeredBy": localStorage.getItem("username")
            })
        };

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                alert("課程名額暫滿，你將會加進後備名單。如最後能夠成功報讀，屆時將會以公司電郵通知");
                clearInput();
                // setNewValue(prevValue => {
                    
                //     return {
                //         ...prevValue,
                //         username: "",
                //         email: "",
                //         staffid: "",
                //         post: "",
                //         dept: ""
                //     }

                // });
            }else{
                alert("發生錯誤，請稍後再嘗試");
            }
        }).catch(err => {
            console.log("waitinglist: " + err);
        });
    }


    function checkQuota(){

        const courseInfo = newValue.course.split(' ');

        const courseName = newValue.course.split(' ')[0];
        console.log("name: " + courseName);
        const courseDate = newValue.course.split(' ')[1];
        console.log("name: " + courseDate);

        const url = "/checkQuota";
        const options = {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify({
                "courseName": courseName,
                "courseDate": courseDate
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
                waitinglist(courseName, courseDate);
            }else if(res !== "error"){
                enroll(res);
            }
        }).catch(err => {
            console.log("Login: " + err);
        });
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
                dept: "",
                course: ""
            }

        });

    }


    function handleChange(event){

        const {name, value} = event.target;

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

    
    <Form className="inputForm" onSubmit={handleSubmit}>
    
        <div className="inputRow">
            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">名稱:</Form.Label>
                    <Form.Control placeholder={fields[0]} size="lg" onChange={handleChange} value={newValue.username} name="username"></Form.Control>
                </FormGroup>
            </div>

            <div className="inputItem"></div>

            <div className="inputItem">
                <FormGroup className="inputItem">
                    <Form.Label className="inputLabel">電郵:</Form.Label>
                    <InputGroup>
                        <Form.Control placeholder={fields[1]} size="lg" name="email" type="text" onChange={handleChange} value={newValue.email} className="input"></Form.Control>
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
                    <Form.Control placeholder={fields[2]} size="lg" onChange={handleChange} value={newValue.staffid} name="staffid"></Form.Control>
                </FormGroup>
            </div>

            <div className="inputItem"></div>

            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">職位:</Form.Label>
                    <Form.Control placeholder={fields[3]} size="lg" onChange={handleChange} value={newValue.post} name="post"></Form.Control>
                </FormGroup>
            </div>

        </div>
            

        <div className="inputRow">

            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">單位:</Form.Label>
                    <Form.Control placeholder={fields[4]} size="lg" onChange={handleChange} value={newValue.dept} name="dept"></Form.Control>
                </FormGroup>
            </div>

            <div className="inputItem"></div>

            <div className="inputItem">
                <FormGroup>
                    <Form.Label className="inputLabel">報讀課程:</Form.Label>
                    <Form.Control size="lg" onChange={handleChange} value={newValue.course} name="course" as="select">
                        <option>請選擇課程</option>
                        {courseList.length > 0 && courseList.map(course => {
                            var date = new Date(course.date);
                            return <option>{course.courseName} {date.toLocaleDateString()}</option>
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