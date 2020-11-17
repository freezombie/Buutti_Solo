const Posts = (props) => {
    const {
        data
    } = props;

    const singlePost = () => (
        <div class="row">
            <h1>{data.title}</h1>
            <p>{data.body}</p>
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

