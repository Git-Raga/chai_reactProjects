import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1>Project 2 | Counter using UseSTATE HOOK</h1>
      <div>
        
        

          <Card style={{ width: '18rem' }}>
      
      <Card.Body>
        <Card.Title>Counter VALUE</Card.Title>
        <Card.Text>
          {count}
        </Card.Text>
        
      </Card.Body>
    </Card>
    <Button variant="primary">Couner Increase +</Button>
    <br></br>
    <Button variant="secondary">Couner Decrease -</Button>
      </div>
    </>
  )
}

export default App
