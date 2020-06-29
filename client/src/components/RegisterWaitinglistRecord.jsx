import React, {useState, useEffect} from 'react';
import RegisterRecordDetail from './RegisterRecordDetail';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import qs from 'qs';

export default function RegisterWaitinglistRecord(props){

    const [loaded, setLoaded] = useState(false);
    const [details, setDetails] = useState();
    const [courseID, setCourseID] = useState("");
    const [noResult, setNoResult] = useState();
    const [isBack, setIsBack] = useState(false);

    useEffect(() => {

        if(!loaded || courseID !== props.selectedCourse._id){

            setCourseID(props.selectedCourse._id);

            const url = '/register-record-waitinglist';
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

    function handleClick(){
        setIsBack(true);
    }

    if(isBack){
        return <RegisterRecordDetail selectedCourse={props.selectedCourse}/>
    }

    return (

        <React.Fragment>

                <Card className="detailCard">
                    <Card.Header className="cardDetailWrapper">
                        <Button className="backBtn" onClick={handleClick}>返回查看報名紀錄</Button>
                        <h1 className="courseTitle">{props.selectedCourse && props.selectedCourse.courseName}</h1>
                    </Card.Header>
                    <Card.Body>
                    {noResult && <p>你並沒有此課程的後補報名紀錄</p>}
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
                            {details && details.map(detail => {
                                return <tr>
                                    <td>{detail.staffid}</td>
                                    <td>{detail.username}</td>
                                    <td>{detail.email}</td>
                                    <td>{detail.dept}</td>
                                    <td>{detail.post}</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>
              </Card.Body>
            </Card>
                        
        </React.Fragment>

    );


}