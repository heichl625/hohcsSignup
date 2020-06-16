import React, { useState } from 'react';
import qs from 'qs';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import EnrollDetail from './EnrollDetail';

export default function CourseDetail(props){

    var date;

    if(props.selectedCourse){
      date = new Date(props.selectedCourse.date);
    }
    const [getCourseDetail, setGetCourseDetail] = useState(false);

    const [courseDetail, setCourseDetail] = useState({});

    function handleClick(){

      const courseID = props.selectedCourse._id;

      const url = '/enrollDetail';
        const options = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({courseID: courseID})
        };

        fetch(url, options)
        .then(res => res.json())
        .then(res => {
            if(res.message === "未有報名記錄"){
              alert(res.message)
            }else{
              setGetCourseDetail(true);
              setCourseDetail(res);
            }
        })

    }

    function handleDelete(){

      const courseID = props.selectedCourse._id;

      const url = '/deleteCourse';
        const options = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({courseID: courseID})
        };

        fetch(url, options)
        .then(res => {
          if(res.status === 200){
            alert("成功刪除課程");
            window.location.reload(true);
          }else{
            alert("發生錯誤，請稍後再試");
          }
        })

    }

    if(getCourseDetail){
      return <EnrollDetail courseDetail={courseDetail} course={props.selectedCourse}/>
    }
    
    
    return(
        <div>
            <Card className="detailCard">
              <Card.Header className="cardDetailWrapper">
                    <h1 className="courseTitle">{props.selectedCourse && props.selectedCourse.courseName}</h1>
                    <Button variant="danger" className="deleteBtn" onClick={handleDelete}>刪除課程</Button>
              </Card.Header>
              <Card.Body>
                <Card.Title className="courseDescription">{props.selectedCourse && props.selectedCourse.description}</Card.Title>
                <Card.Text className="courseInfo">上課日期: {date && date.toLocaleDateString()} {props.selectedCourse && props.selectedCourse.time}</Card.Text>
                <Card.Text className="courseInfo">上課地點: {props.selectedCourse && props.selectedCourse.venue}</Card.Text>
                <Card.Text className="courseInfo">課程導師: {props.selectedCourse && props.selectedCourse.tutor}</Card.Text>
                <Card.Text className="courseInfo">尚餘名額: {props.selectedCourse && props.selectedCourse.quota}</Card.Text>
                <Button variant="primary" className="adminEnrollRecordBtn" onClick={handleClick}>查看報名情況</Button>
              </Card.Body>
            </Card>
        </div>
    );

}