const Todos = (props) => {
    const {
        data
    } = props;
    
    const singleTodo = () => (
        <div class="row">
            <label class="todoRow">
                <input type="checkbox" id={data.title} name={data.title} checked={data.completed} />
                <span class="label-body">{data.title}</span>
            </label>
        </div>
    );

    const todoArray = () => (
        data.map((item, index) => (
            <div key={index} className = "todoArray" class="row">
                <label class="todoRow">
                    <input type="checkbox" id={item.title} name={item.title} checked={item.completed} />
                    <span class="label-body">{item.title}</span>
                </label>
            </div>
        ))
    );

    if(Array.isArray(data)) {
        return todoArray();
        
    }
    else {
        return singleTodo();
    }

};

export default Todos;
