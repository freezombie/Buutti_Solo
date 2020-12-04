import React, {useEffect, useState} from "react";
import axios from "axios";

const Posts = (props) => {
    const {
        data,
        setData,
    } = props;
    let newId = data.id;
    const [currPostId, setCurrPostId] = useState(data.id);
    useEffect(() => {
        async function fetchData() {
            console.log(currPostId);
            if (currPostId) 
            {
                const res = await axios.get(`https://jsonplaceholder.typicode.com/posts/${currPostId}`)
                const newData = res.data;
                setData(newData);
            }
        }
        fetchData();
    }, [currPostId])

    const nextPost = () => {
        console.log("here");
        setCurrPostId(currPostId+1);
        console.log(currPostId);
    };

    const singlePost = () => (
        <div class="row">
            <h1>{data.title}</h1>
            <p>{data.body}</p>
            <button onClick={() => nextPost()}>Next Post</button>
        </div>
    );

    const postsArray = () => (
        data.map((item, index) => (
            <div key={index} className = "postsArray" class="row">
                <div class="row">
                    <h1>{item.title}</h1>
                    <p>{item.body}</p>
                </div>
            </div>
        ))
    );

    if(Array.isArray(data)) {
        return postsArray();
        
    }
    else {
        return singlePost();
    }

};

export default Posts;

