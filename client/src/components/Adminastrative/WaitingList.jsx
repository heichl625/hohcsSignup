import React, {useState, useEffect} from 'react';
import EnrollDetail from './EnrollDetail';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Parser } from 'json2csv';
import qs from 'qs';

export default function WaitingList(props){

    const courseID = props.courseID;
    const [isBack, setIsBack] = useState(false);
    const [records, setRecords] = useState([]);

    useEffect(() => {

        const url = '/waitinglistByCourseID';
        const options = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({
                courseID: courseID
            })
        };

        fetch(url, options)
        .then(res => res.json())
        .then(res => {
            if(records.length === 0){
                setRecords(res.records);
            }
        })
    })

    function backBtnClicked(){
        setIsBack(true);
    }

    function handleExport(){

        console.log(records);

        const fields = ["username", "email", "staffid", "dept", "post", "registeredBy"];
        const options = { fields }

        const parser = new Parser(options);
        const csv = parser.parse(records);

        download(csv);

    }

    function download(data){

        const blob = new Blob([data], {type: "text/csv"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', props.courseDetail.courseName + "_waitinglist.csv");
        document.body.append(a)
        a.click();
        document.body.removeChild(a);

    }

    if(isBack){
        return <EnrollDetail courseDetail={props.courseDetail} course={props.course}/>
    }

    return (

        <React.Fragment>

        <Card className="detailCard">
            <Card.Header className="enrollHeaderWrapper">
                <Button className="backBtn" onClick={backBtnClicked}>返回查看報名名單</Button>
                <h1 className="enrollDetailTitle">{props.courseDetail.courseName} (後補名單)</h1>
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

                         {records && records.map(record => {
                            return (
                                <tr>
                                    <td>{record.staffid}</td>
                                    <td>{record.username}</td>
                                    <td>{record.email}</td>
                                    <td>{record.dept}</td>
                                    <td>{record.post}</td>
                                </tr>
                            )
                        })}
                      
                    </tbody>
                </Table>
                <div className="cardBottom">
                    <p className="enrollNum">總候補人數： { records && records.length}</p>
                    <Button className="exportBtn" variant="primary" onClick={handleExport}>匯出候補名單(.csv)</Button>
                </div>
          </Card.Body>
        </Card>
        </React.Fragment>

    ); 

}