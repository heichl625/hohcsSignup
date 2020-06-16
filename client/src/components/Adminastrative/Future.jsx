import React, { useState, useEffect } from 'react';
import Navigator from './Navigator';
import CourseDetail from './CourseDetail';
import Nav from "react-bootstrap/Nav";

export default function Future(){

    const initialCourse = [{
        _id: "",
        couseName: "",
        date: "",
        time: "",
        venue: "",
        quota: 0,
        tutor: "",
        description: ""
    }];

    const[courses, setCourses] = useState(initialCourse);
    const [selectedID, setSelectedID] = useState("");
    const [courseToParse, setCourseToParse] = useState(initialCourse[0]);

    useEffect(() => {

        const url = '/adminFutureCourse';
        const options = {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
        };

        fetch(url, options)
        .then(res => res.json())
        .then(res => {
            if(courses === initialCourse){
                
                setCourses(res);
            }
        })

        setCourseToParse(courses.find(course => course._id === selectedID));
    })

    return (
        <div>

        <Navigator />

        <div className="sidebar">

            <h4 className="sidebarTitle">未來課程</h4>

                <Nav defaultActiveKey="" className="flex-column" onSelect={(selectedKey) => setSelectedID(selectedKey)}>

                    {courses.map(course => {
                        const date = new Date(course.date);
                        return <Nav.Link eventKey={course._id} className="courseLink">{course.courseName} {date.toLocaleDateString()}</Nav.Link>
                    })}

                    {courses.length === 0 && <p className="noCourse">沒有未來課程</p>}
                
                </Nav>

        </div>

        { selectedID && <CourseDetail selectedCourse={courseToParse}/> }

    );

    </div>
    );

}