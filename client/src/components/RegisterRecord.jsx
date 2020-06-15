import React, {useState, useEffect} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import RegisterRecordDetail from './RegisterRecordDetail';
import qs from 'qs';

export default function RegisterRecord(){

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
    const [selectedID, setSelectedID] = useState();
    const [period, setPeriod] = useState("今天");
    const [isLoaded, setIsLoaded] = useState(false);
    const [noCourse, setNoCourse] = useState(false);

    useEffect(() => {

        if(!isLoaded){
            console.log("render");
            const url = '/course-by-date';
            const options = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: qs.stringify({
                    period: period
                })
            };

            fetch(url, options)
            .then(res => res.json())
            .then(res => {
                console.log("length: " + res.length);
                if(res.length === 0){
                    setNoCourse(true);
                    setCourses(initialCourse);
                }else{
                    if(res !== courses){
                        setCourses(res);
                    }
                    setNoCourse(false);
                }
            })
            setIsLoaded(true);
        }
    })

    function handleClick(selectedKey){
        console.log(selectedKey);
        switch(selectedKey){
            case "0":
                setPeriod("過往");
                setIsLoaded(false);
                setSelectedID();
                break;
            case "1":
                setPeriod("今天");
                setIsLoaded(false);
                setSelectedID();
                break;
            case "2":
                setPeriod("未來");
                setIsLoaded(false);
                setSelectedID();
                break;
            default:
                break;
        }
        
    }

    function handleSidebarClick(selectedKey){
        setSelectedID(selectedKey);
    }

    return(
        <React.Fragment>
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="/">靈實員工培訓課程報名系統</Navbar.Brand>
            <Nav className="mr-auto" defaultActiveKey="" onSelect={(selectedKey) => handleClick(selectedKey)}>
                <Nav.Link eventKey="0" >過往課程</Nav.Link>
                <Nav.Link eventKey="1" >今天課程</Nav.Link>
                <Nav.Link eventKey="2" >末來課程</Nav.Link>
            </Nav>
        </Navbar>
        <div className="sidebar">

            <h4 className="sidebarTitle">{period}課程</h4>
            {console.log(noCourse)}
            { noCourse && <p className="noCourse">暫沒有課程</p> }
            <Nav defaultActiveKey="" className="flex-column" onSelect={(selectedKey) => handleSidebarClick(selectedKey)}>
                {!noCourse && courses.map(course => {
                    const date = new Date(course.date);
                    return <Nav.Link eventKey={course._id} className="courseLink">{course.courseName} {date.toLocaleDateString()}</Nav.Link>
                })}
            </Nav>

        </div>
        
        {selectedID && <RegisterRecordDetail selectedCourse={courses.find(course => course._id === selectedID)} />}

        </React.Fragment>
    );

}