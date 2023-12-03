import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

import './App.css'

function App() {
  let [count, setCount] = useState(0)
  const [show, setShow] = useState(false);
  
  function err(){ 
              if (show) {
                return (
                  <Alert variant="danger" onClose={closefn} dismissible>
                  <Alert.Heading>Note!</Alert.Heading>
                  <p>
                   MAX Counter Value Reached!!
                  </p>
                </Alert>
                );
                }}
   
  function closefn(){
    setShow(false)
    setCount(count=0)
  }
  
  const increasefn=()=>{
    count > 9? setShow(true):setCount(count+1)
  }
  const decreasefn=()=>{
    count < -9? setShow(true):setCount(count-1)
     
  }
  return (
    <>
    <div>{show && err()}</div>
    <h1>Project 2 | Counter using UseSTATE HOOK</h1>
      <div>
        
        

      <Card className="row justify-content-center">
      <Card.Body >
        <Card.Title><h1>Counter Value</h1></Card.Title>
        <p>(max= 10, min= -10)</p>
        <Card.Text as="div">
          <h1> {count}</h1>
         
        </Card.Text>
        
      </Card.Body>
      
    </Card>
    <hr></hr>
    <Button className="btnclass" variant="primary" onClick={increasefn}>Couner Increase +</Button>
    <br></br>
    <br></br>
    <Button className="btnclass" variant="secondary" onClick={decreasefn}>Couner Decrease -</Button>
    <br></br>
 
      </div>
    </>


  )





}

export default App
  

 
 