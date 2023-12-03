import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const increasefn = () => {
    if (count >= 4) {
      setShowAlert(true);
    } else {
      setCount(count + 1);
    }
  };

  const decreasefn = () => {
    setCount(count - 1);
  };

  const fnalert = () => {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat
          porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit
          amet fermentum.
        </p>
      </Alert>
    );
  };

  return (
    <>
      <h1>Project 2 | Counter using UseSTATE HOOK</h1>
      <div>
        <Card className="row justify-content-center">
          <Card.Body>
            <Card.Title>
              <h1>Counter Value</h1>
            </Card.Title>
            <p>(max= 10, min= -5)</p>
            <Card.Text as="div">
              <h1> {count}</h1>
            </Card.Text>
          </Card.Body>
        </Card>
        <hr />
        {showAlert && fnalert()}
        <Button variant="primary" onClick={increasefn}>
          Counter Increase +
        </Button>
        <br />
        <br />
        <Button variant="secondary" onClick={decreasefn}>
          Counter Decrease -
        </Button>
        <br />
        <Button variant="secondary" onClick={() => setShowAlert(true)}>
          Alert -
        </Button>
      </div>
    </>
  );
}

export default App;
