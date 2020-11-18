import React, {useEffect, useState} from "react";
const clockStyle = {
    borderRadius: "25px",
    background: "#282828",
    padding: "20px",
    width: "150px",
    height: "20px",
    textAlign: "center",
    color: "white",
    border: "4px solid #73AD21",
};

const Clock = (props) => {
    const [time, setTime] = useState(null);

    useEffect(() => {
        setTime(new Date())
    }, [props.counter]);
    //return <div>{props.counter}</div>
    return <div style={clockStyle}>{time.getHours()}:{time.getMinutes()}.{time.getSeconds()}</div>
}

export default Clock;