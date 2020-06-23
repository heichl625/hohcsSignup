import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import CourseDetail from './CourseDetail';
import WaitingList from './WaitingList';
import { Parser } from 'json2csv';
import qs from 'qs';

export default function EnrollDetail(props){

    const [enrollRecords, setEnrollRecords] = useState();
    const [waitinglist, setWaitingList] = useState(false);
    const [isBack, setIsBack] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const [courseID, setCourseID] = useState("");
    const [noRecord, setNoRecord] = useState();

    useEffect(() => {

    //   if(!isLoad || courseID !== props.course._id){

        const url = '/enrollDetail';
          const options = {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: qs.stringify({courseID: props.course._id})
          };

          fetch(url, options)
          .then(res => res.json())
          .then(res => {
              console.log(res);
              if(res.message !== "未有報名記錄"){
                setEnrollRecords(res);
                setNoRecord(false);
              }else{
                setEnrollRecords();
                setNoRecord(true);
              }
              setIsLoad(true);
              
          })
    //   }

    //   console.log(enrollRecords);

    }, [props])

    function backBtnClicked(){
        setIsBack(true);
    }

    function waitinglistBtnClicked(){
        setWaitingList(true);
    }

    function handleExport(){

        const fields = ["username", "email", "staffid", "dept", "post", "registeredBy"];
        const options = { fields }

        const parser = new Parser(options, {withBOM: true});
        const csv = parser.parse(enrollRecords.records);

        download(csv);

    }

    function download(data){

        const blob = new Blob([data], {type: "text/csv"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', props.course.courseName + ".csv");
        document.body.append(a)
        a.click();
        document.body.removeChild(a);

    }

    if(isBack){
        return <CourseDetail selectedCourse={props.course}/>
    }

    if(waitinglist){
        return <WaitingList course={props.course}/>
    }

    return (

        <Card className="detailCard">
            <Card.Header className="enrollHeaderWrapper">
                <Button className="backBtn" onClick={backBtnClicked}>返回查看課程資料</Button>
                {/* {console.log(props.courseDetail)} */}
                <h1 className="enrollDetailTitle">{props.course.courseName}</h1>
                <Button className="waitinglistBtn" onClick={waitinglistBtnClicked}>查看後補名單</Button>
            </Card.Header>
            <Card.Body>
                { noRecord && <p>此課程未有報名記錄</p> }
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

                         {enrollRecords && enrollRecords.records.map(record => {
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
                <div className="cardBottom">
                    <p className="enrollNum">總報名人數： { enrollRecords && enrollRecords.records.length}</p>
                    <Button className="exportBtn" variant="primary" onClick={handleExport}>匯出名單(.csv)</Button>
                </div>
          </Card.Body>
        </Card>

    );
}