import axios from "axios";
import React, { useState } from "react";
import User from "./user.jsx";

const Users = () => {
    // this whole thing is for testing purposes.
    const [data, setData] = useState(null);

    const getData = async () => {
        const url = "http://localhost:5000/accounts/all";
        const response = await axios.get(url);
        setData(response.data);
    }
    console.log(data);
    getData();
    return (
    data ?
        <div className="usersContainer">
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Balance</th>
            </tr>
        {data.map((item,index) => (
            <User data={item}/>
        ))}
        </table>
    </div> : <p>waiting for data</p>
    );
}

export default Users;