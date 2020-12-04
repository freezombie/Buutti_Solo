import Clock from "./components/clock";
import GetComponent from "./components/GetComponent";
import React, {useState} from "react";

const App = (props) => {
  const [counter,setCounter] = useState();
  setInterval(tick,1000);
    return (
      <div className="container">
        <Clock counter={counter}/>
        <GetComponent />
      </div>
    )
  
  function tick() {
    setCounter(new Date() / 1000 | 0);
  }
};
  
  
  export default App;