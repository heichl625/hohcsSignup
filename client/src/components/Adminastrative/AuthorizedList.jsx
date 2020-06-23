import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import qs from 'qs';

export default function AuthorizedList() {

    const [username, setUsername] = useState("");
    const [list, setList] = useState([]);
    const [isObtained, setIsObtained] = useState(false);
    const [isClicked, setisClicked] = useState({
        clicked: false,
        email: ""
    });

    useEffect(() => {
        if(!isObtained){
            const getURL = "/get-authorized-list";
            const getOptions = {
                method: "GET",
                headers: {
                  "Accept": "application/json",
                }
            };

            fetch(getURL, getOptions)
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }else{
                    return "error";
                }
            })
            .then(res => {
                if(res !== "error"){
                    console.log(res);
                    setList(res);
                    setIsObtained(true);
                } 
            }).catch(error => {
                console.log(error);
            });
        }

        if(isClicked.clicked){

            const url = "/delete-authorized-list";
            const options = {
                method: "POST",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: qs.stringify({
                    "email": isClicked.email
                })
            };

            console.log(options.body);

            fetch(url, options)
            .then(res => {
                if(res.status === 200){
                    alert("成功從授權名單中移除此電郵");
                    setisClicked(false);
                    setIsObtained(false);
                }else{
                    alert("未能從授權名單中移除此電郵");
                }
            })

        }

    })


    function handleChange(event){

        const {value} = event.target;
        
        setUsername(value);
    }

    function handleSubmit(event){

        event.preventDefault();

        const url = "/add-authorized-list";
        const options = {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify({
                "email": username+"@hohcs.org.hk"
            })
        };

        fetch(url, options)
        .then(res => {
            if(res.status === 200){
                alert("成功新增授權電郵");
                setUsername("");
                setIsObtained(false);

            }else{
                alert("發生錯誤，請稍後再嘗試");
            }
        });

    }

    return (

        <React.Fragment>
            <Card className="authorizedCard">

                <Card.Header className="cardDetailWrapper"><h1 className="authorizedTitle">授權名單</h1></Card.Header>
                <Card.Body>
                    <Form className="authorizedForm" onSubmit={handleSubmit}>
                    <InputGroup>
                        <Form.Control type="text" className="input" placeholder="輸入電郵" name="username" onChange={handleChange} value={username}></Form.Control>
                        <InputGroup.Append>
                            <InputGroup.Text>@hohsc.org.hk</InputGroup.Text>
                        </InputGroup.Append>
                        <InputGroup.Append>
                            <Button className="addBtn" type="submit">+</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </Form>
                    <Table className="authorizedTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>己授權名單</th>
                                <th></th>
                            </tr>
                        </thead>
                        {list && list.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{item.email}</td>
                                    <td><Button className="authorizedDeleteBtn" variant="danger" onClick={() => setisClicked({
                                        clicked: true,
                                        email: item.email})}>移除</Button></td>
                                </tr>
                            )
                        })}
                    </Table>
                </Card.Body>

            </Card>
        </React.Fragment>

    )

}