import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import RegisterWaitinglistRecord from './RegisterWaitinglistRecord';
import qs from 'qs';

export default function RegisterRecordDetail(props){

    const [courseID, setCourseID] = useState("");
    const [details, setDetails] = useState();
    const [noResult, setNoResult] = useState();
    const [loaded, setLoaded] = useState(false);
    const [waitingList, setWaitingList] = useState(false);

    useEffect(() => {

        if(!loaded || courseID !== props.selectedCourse._id){

            setCourseID(props.selectedCourse._id);

            const url = '/register-record';
            const options = {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: qs.stringify({
                    courseID: props.selectedCourse._id,
                    email: localStorage.getItem("email")
                })
            };

            fetch(url, options)
            .then(res => {
                if(res.status !== 403){
                    return res.json();
                }else{
                    return "error";
                }
            })
            .then(res => {
                
                if(res !== "error"){
                    setNoResult(false);
                    setDetails(res);
                }else{
                    setNoResult(true);
                    setDetails();
                }
            })

            setLoaded(true);
        }
    })

    function handleDelete(enrollment){

        console.log(enrollment);

        const url = "/deleteEnrollment";
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({
                courseID: courseID,
                enrollment: enrollment
            })
        }

        fetch(url, options)
        .then(res => {
            console.log(res);
            if(res.status === 200){
                alert("此紀錄已刪除");
                setLoaded(false);
            }else{
                alert("未能刪除此紀錄，請稍後再嘗試");
            }
        })

    }

    function handleClick(){
        setWaitingList(true);
    }

    if(waitingList){
        return <RegisterWaitinglistRecord selectedCourse={props.selectedCourse}/>
    }

    return(

        <React.Fragment>

            <Card className="detailCard">
                <Card.Header className="cardDetailWrapper">
                    <h1 className="courseTitle">{props.selectedCourse && props.selectedCourse.courseName}</h1>
                    <Button className="waitinglistBtn" onClick={handleClick}>查看後補名單</Button>
                </Card.Header>
                <Card.Body>
                {noResult && <p>你並沒有此課程的報名紀錄</p>}
                <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>職員編號</th>
                        <th>姓名</th>
                        <th>電郵</th>
                        <th>單位</th>
                        <th>職位</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        {details && details.map(detail => {
                            return <tr>
                                <td>{detail.staffid}</td>
                                <td>{detail.username}</td>
                                <td>{detail.email}</td>
                                <td>{detail.dept}</td>
                                <td>{detail.post}</td>
                                <td><Button variant="danger" onClick={() => {handleDelete(detail)}} className="recordDelBtn">刪除記錄</Button></td>
                            </tr>
                        })}
                    </tbody>
                </Table>
          </Card.Body>
        </Card>
            
    </React.Fragment>

    );

}