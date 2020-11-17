const Comments = (props) => {
    const {
        data
    } = props;

    const commentStyle = {
        border: "1px solid black", 
        borderRadius: "5px",
        textAlign: "justify",
    };

    const singleComment = () => (
        <div class="comment">
            <div class="row">
                <div class="six columns">
                    <p><b>Name:</b> {data.name}</p>
                </div>
                <div class="six columns">
                    <p><b>Email:</b> {data.email}</p>
                </div>
            </div>
            <div class="row" style={commentStyle}>
                <p>{data.body}</p>
            </div>
        </div>
    );
    
    const commentArray = () => (
        data.map((item, index) => (
            <div key={index} className = "commentsArray">
                <div class="row">
                    <div class="six columns">
                        <p><b>Name:</b> {item.name}</p>
                    </div>
                    <div class="six columns">
                        <p><b>Email:</b> {item.email}</p>
                    </div>
                </div>
                <div class="row" style={commentStyle}>
                    <p>{item.body}</p>
                </div>
            </div>
        ))
    );

    if(Array.isArray(data)) {
        return commentArray();
        
    }
    else {
        return singleComment();
    }
};

export default Comments;