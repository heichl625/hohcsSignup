import React, {useState, useEffect} from 'react';
import CreateCourse from './CreateCourse';
import AuthorizedList from './AuthorizedList';
import CourseDetail from './CourseDetail';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import qs from 'qs';



export default function Admin(props){

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

    const isAuthorized = props.authorized || false;
    const isCreate = props.create || false;

    const [courses, setCourses] = useState(initialCourse);
    const [selectedID, setSelectedID] = useState();
    const [period, setPeriod] = useState("今天");
    const [isLoaded, setIsLoaded] = useState(false);
    const [noCourse, setNoCourse] = useState(false);
    const [authorized, setAuthorized] = useState(isAuthorized);
    const [create, setCreate] = useState(isCreate);

    useEffect(() => {

        if(!isLoaded){
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
        switch(selectedKey){
            case "0":
                setAuthorized(false);
                setCreate(true);
                setSelectedID();
                break;
            case "1":
                setPeriod("過往");
                setAuthorized(false);
                setCreate(false);
                setIsLoaded(false);
                setSelectedID();
                break;
            case "2":
                setPeriod("今天");
                setAuthorized(false);
                setCreate(false);
                setIsLoaded(false);
                setSelectedID();
                break;
            case "3":
                setPeriod("未來");
                setAuthorized(false);
                setCreate(false);
                setIsLoaded(false);
                setSelectedID();
                break;
            case "4":
                setCreate(false);
                setAuthorized(true);
                setSelectedID();
                break;
            default:
                break;
        }
        
    }

    function handleSidebarClick(selectedKey){
        setSelectedID(selectedKey);
    }


    return (
        <div>
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="/admin">課程報名系統</Navbar.Brand>
                <Nav className="mr-auto" defaultActiveKey="" onSelect={(selectedKey) => handleClick(selectedKey)} >
                  <Nav.Link eventKey="0">新增課程</Nav.Link>
                  <Nav.Link eventKey="1">以往課程</Nav.Link>
                  <Nav.Link eventKey="2">今天課程</Nav.Link>
                  <Nav.Link eventKey="3">未來課程</Nav.Link>
                  <Nav.Link eventKey="4">授權名單</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/">返回報名表格</Nav.Link>
                </Nav>
        </Navbar>
            {(!authorized && !create) && <div className="sidebar">

                <h4 className="sidebarTitle">{period}課程</h4>
                { noCourse && <p className="noCourse">暫沒有課程</p> }

                <Nav defaultActiveKey="" className="flex-column" onSelect={(selectedKey) => setSelectedID(selectedKey)}>

                    {!noCourse&& courses.map(course => {
                        const date = new Date(course.date);
                        return <Nav.Link eventKey={course._id} className="courseLink">{course.courseName} {date.toLocaleDateString()}</Nav.Link>
                    })}

                </Nav>
            
            </div>}
            
            {!selectedID && create && <CreateCourse />}
            {!selectedID && authorized && <AuthorizedList />}
            {console.log("admin: " + selectedID)}
            { selectedID && <CourseDetail selectedCourse={courses.find(course => course._id === selectedID)}/> }
                
        
    </div>
    );
}