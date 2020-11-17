import React, { useState} from "react";
import axios from "axios";
import Todos from "./todos";
import Posts from "./posts";
import Comments from "./comments";
import Photos from "./photos";

const GetComponent = (props) => {
    const [input, setInput] = useState({});
    const [data, setData] = useState([]);
    const [route, setRoute] = useState({});
    const [errorMsg, setErrorMsg] = useState({});

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }
    const fetchData = async (e) => {
        setData(null); 
        try {
            const response = await axios.get(`https://jsonplaceholder.typicode.com/${input}`)
            const shortenedInput = input.includes("/") ? input.split("/")[0] : input;
            setRoute(shortenedInput);
            setData(response.data);
        } catch (err) {
            if(err !== null) {
                if (err.response) {
                    if(err.response.status === 404){
                        setErrorMsg("Server returned 404. Wrong input?");
                    }
                } else if (err.request) {
                    // tänne jotain request error juttua
                } else {
                    setErrorMsg(null);
                    return;
                }
            } 
        };
        
    }

    const showData = () => {
        if(data !== null) {
            if( route === "todos") {
                return <Todos data={data} />
            } else if (route === "posts") {
                return <Posts data={data} />
                } else if (route === "comments") {
                    return <Comments data={data} />
                } else if (route === "photos") {
                    return <Photos data={data} />
                }
            }
            console.log(errorMsg);
            if(typeof errorMsg === "string"){
                return (
                    <div class="error">
                        <p>{errorMsg}</p>
                    </div>
                )
            } else {
                return (
                    <p>Nada</p>
                )
            }
    }

    return (
        <div>
            <input onChange={handleInputChange} />
            <button onClick={fetchData}>Click to Fetch Data</button>
            {showData()}
        </div>
    )
}

export default GetComponent;