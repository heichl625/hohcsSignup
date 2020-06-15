import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import CourseDetail from './CourseDetail';
import WaitingList from './WaitingList';

export default function EnrollDetail(props){

    console.log(props.courseDetail);
    const [enrollRecords, setEnrollRecords] = useState([]);
    const [waitinglist, setWaitingList] = useState(false);
    const [isBack, setIsBack] = useState(false);

    useEffect(() => {
        setEnrollRecords(props.courseDetail.records);
    })

    function backBtnClicked(){
        setIsBack(true);
    }

    function waitinglistBtnClicked(){
        setWaitingList(true);
    }

    if(isBack){
        return <CourseDetail selectedCourse={props.course}/>
    }

    if(waitinglist){
        console.log(props.course._id)
        return <WaitingList courseID={props.course._id} courseDetail={props.courseDetail} course={props.course}/>
    }

    return (

        <Card className="detailCard">
            <Card.Header className="enrollHeaderWrapper">
                <Button className="backBtn" onClick={backBtnClicked}>返回查看課程資料</Button>
                <h1 className="enrollDetailTitle">{props.courseDetail.courseName}</h1>
                <Button className="waitinglistBtn" onClick={waitinglistBtnClicked}>查看後補名單</Button>
            </Card.Header>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>職員編號</th>
                        <th>姓名</th>
                        <th>電郵</th>
                        <th>單位</th>
                        <th>職位</th>
                      </tr>
                    </thead>
                    <tbody>

                         {enrollRecords && enrollRecords.map(record => {
                            return (
                                <tr>
                                    <td>{record.staffid}</td>
                                    <td>{record.username}</td>
                                    <td>{record.email}</td>
                                    <td>{record.dept}</td>
                                    <td>{record.post}</td>
                                </tr>
                            );
                        })}
                      
                    </tbody>
                </Table>
                <p>總報名人數： { enrollRecords && enrollRecords.length}</p>
          </Card.Body>
        </Card>

    );
}