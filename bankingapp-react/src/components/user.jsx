const User = (props) => {
    const { data } = props;
    return (
        <tr key={data.id} className="user">
            <th>{data.id}</th>
            <th>{data.name}</th>
            <th>{data.balance}</th>
        </tr>
    )
}

export default User;