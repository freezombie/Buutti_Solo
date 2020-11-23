import { withContext } from "./AppContext";
import { Form, Input, Button } from "antd";
import { useHistory } from "react-router-dom";

function Login(props) {
    const history = useHistory();
    const onFinish = (values) => {
        console.log(values);    
        props.login(values)
            .then(() => {
                if(props.user) {
                    history.push("/myaccount");
                }
            })
    }
    const onFinishFailed = () => {
        console.log("On Finish failed");
    }
    return (
        <div id="frontpageForm">
            <Form 
            name ="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            >
                <Form.Item
                label="ID"
                name="id"
                rules={[{ required: true, message: "Please input your ID!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>        
    )
}

export default withContext(Login);