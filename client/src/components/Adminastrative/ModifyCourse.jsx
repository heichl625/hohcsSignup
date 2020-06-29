import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import qs from 'qs'
import { useEffect } from 'react';
import CourseDetail from './CourseDetail';

export default function ModifyCourse(props){

    const [course, setCourse] = useState(props.course);
    // const [courseToParse, setCourseToParse] = useState();
    const [isModified, setIsModified] = useState(false);
    const [parseDate, setParseDate] = useState(false);
    const [redirect, setRedirect] = useState(false);

    console.log(course);

    useEffect(() => {
        if(!parseDate){

            const newDate = new Date(course.date);
            var day = newDate.getDate();
            var month = newDate.getMonth()+1;
            const year = newDate.getFullYear();

            if(day <= 9){
                day = "0" + day;
            }

            if(month <= 9){
                month = "0"+month;
            }

            setCourse( prevValue => {
                return {
                    ...prevValue,
                    date: year + "-" + month + "-" + day
                }
            })
            setParseDate(true);
        }
    })

    function handleChange(event){
        const {name, value} = event.target;

        setCourse(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        })
    }

    function handleModify(event){

        event.preventDefault();

        const url = "/modifyCourse";
        const options = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({course: course})
        }

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                return res.json();
            }else{
                return "error";
            }
        })
        .then(res => {
            if(res !== "error"){
                if(!res.msg){
                    alert("成功修改課程");
                    setIsModified(true);
                }else{
                    alert("未能修改課程，請稍後再嘗試");
                }
            }else{
                alert("未能修改課程，請稍後再嘗試");
            }
        })
        
    }


    return (
        <React.Fragment>
        <h1 className="modifyCourseTitle">修改課程資料</h1>

        <Form onSubmit={handleModify}>

            <div className="modifyForm">
                <div className="inputRow">
                    <Form.Group className="inputItem">
                        <Form.Label className="inputLabel">課程名稱:</Form.Label>
                        <Form.Control placeholder="請輸入課程名稱" className="input" name="courseName" type="text" onChange={handleChange} value={course.courseName}></Form.Control>
                    </Form.Group>
                    <div className="inputItem"></div>
                    <Form.Group className="inputItem">
                        <Form.Label className="inputLabel">上課日期:</Form.Label>
                        <Form.Control placeholder="請輸入上課日期" className="input inputDate" name="date" type="date" onChange={handleChange} value={course.date}></Form.Control>
                    </Form.Group>
                </div>

                
                    <div className="inputRow">
                        <Form.Group className="inputItem">
                            <Form.Label className="inputLabel">上課時間:</Form.Label>
                            <Form.Control placeholder="請輸入上課時間" className="input" name="time" type="time" onChange={handleChange} value={course.time}></Form.Control>
                        </Form.Group>
                        <div className="inputItem"></div>
                        <Form.Group className="inputItem">
                            <Form.Label className="inputLabel">上課地點:</Form.Label>
                            <Form.Control placeholder="請輸入上課地點" className="input" name="venue" type="text" onChange={handleChange} value={course.venue}></Form.Control>
                        </Form.Group>
                    </div>

                    <div className="inputRow">
                        <Form.Group className="inputItem">
                            <Form.Label className="inputLabel">課程名額:</Form.Label>
                            <Form.Control placeholder="請輸入課程名額" className="input" name="quota" type="number" onChange={handleChange} value={course.quota}></Form.Control>
                        </Form.Group>
                        <div className="inputItem"></div>
                        <Form.Group className="inputItem">
                            <Form.Label className="inputLabel">課程導師:</Form.Label>
                            <Form.Control placeholder="請輸入課程導師" className="input" name="tutor" type="text" onChange={handleChange} value={course.tutor}></Form.Control>
                        </Form.Group>
                    </div>
                    <div className="inputRow">
                        <Form.Group className="inputItem">
                            <Form.Label className="inputLabel courseDescriptionText">課程簡介:</Form.Label>
                            <FormControl as="textarea" aria-label="With textarea" rows="4" name="description" onChange={handleChange} value={course.description}/>
                        </Form.Group>
                    </div>
                <Button variant="primary" size="lg" className="createBtn" type="submit">修改課程</Button>
            
            </div>

        </Form>
        </React.Fragment>
    );

}