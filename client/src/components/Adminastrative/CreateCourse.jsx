import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import qs from 'qs'



export default function CreateCourse(){

    const[newCourse, setNewCourse] = useState({
        courseName: "",
        date: "",
        time: "",
        venue: "",
        quota: 0,
        tutor: "",
        description: ""

    })

    const[isCreated, setIsCreated] = useState(false);

    function handleChange(event){

        const {name, value} = event.target;

        setNewCourse(prevValue => {
            return{
                ...prevValue,
                [name]: value
            }
        });

    }

    function handleCreate(event){
        event.preventDefault();
        
        const url = '/createcourse';
        const options = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify(newCourse)
        };

        fetch(url, options)
        .then(res => {
            if(res){
                alert("成功新增課程");
                setIsCreated(true);
            }
        })

    }

    return (
        <React.Fragment>

        <div className="createCourse">
            <h1 className="createCourseTitle">新增課程</h1>

            <Form onSubmit={handleCreate}>

                <div className="inputForm">
                    <div className="inputRow">
                        <Form.Group className="inputItem">
                            <Form.Label className="inputLabel">課程名稱:</Form.Label>
                            <Form.Control placeholder="請輸入課程名稱" className="input" name="courseName" type="text" onChange={handleChange} value={newCourse.cousreName}></Form.Control>
                        </Form.Group>
                        <div className="inputItem"></div>
                        <Form.Group className="inputItem">
                            <Form.Label className="inputLabel">上課日期:</Form.Label>
                            <Form.Control placeholder="請輸入上課日期" className="input" name="date" type="date" onChange={handleChange} value={newCourse.date}></Form.Control>
                        </Form.Group>
                    </div>


                        <div className="inputRow">
                            <Form.Group className="inputItem">
                                <Form.Label className="inputLabel">上課時間:</Form.Label>
                                <Form.Control placeholder="請輸入上課時間" className="input" name="time" type="time" onChange={handleChange} value={newCourse.time}></Form.Control>
                            </Form.Group>
                            <div className="inputItem"></div>
                            <Form.Group className="inputItem">
                                <Form.Label className="inputLabel">上課地點:</Form.Label>
                                <Form.Control placeholder="請輸入上課地點" className="input" name="venue" type="text" onChange={handleChange} value={newCourse.venue}></Form.Control>
                            </Form.Group>
                        </div>

                        <div className="inputRow">
                            <Form.Group className="inputItem">
                                <Form.Label className="inputLabel">課程名額:</Form.Label>
                                <Form.Control placeholder="請輸入課程名額" className="input" name="quota" type="number" onChange={handleChange} value={newCourse.quota}></Form.Control>
                            </Form.Group>
                            <div className="inputItem"></div>
                            <Form.Group className="inputItem">
                                <Form.Label className="inputLabel">課程導師:</Form.Label>
                                <Form.Control placeholder="請輸入課程導師" className="input" name="tutor" type="text" onChange={handleChange} value={newCourse.tutor}></Form.Control>
                            </Form.Group>
                        </div>
                        <div className="inputRow">
                            <Form.Group className="inputItem">
                                <Form.Label className="inputLabel courseDescriptionText">課程簡介:</Form.Label>
                                <FormControl as="textarea" aria-label="With textarea" rows="4" name="description" onChange={handleChange} value={newCourse.description}/>
                            </Form.Group>
                        </div>
                    <Button variant="primary" size="lg" className="createBtn" type="submit">新增課程</Button>

                    { isCreated && <Redirect to="/admin"/> }

                </div>

            </Form>
        </div>
    </React.Fragment>
    );
}