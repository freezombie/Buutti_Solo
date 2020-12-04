const SomeComponent = (props) => {
    const {
        text,
        action
    } = props;
    return (
        <div>
            {text}
            <button onClick={action}>Click Me</button>
        </div>
    )
}

export default SomeComponent