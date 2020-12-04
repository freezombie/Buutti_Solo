import { withContext } from "./AppContext";
import { Form, Input, InputNumber, Button } from "antd";
import { useHistory } from "react-router-dom";

function Signup(props) {
    const history = useHistory();
    const onFinish = (values) => {  
        props.signup(values)
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
            name ="signup"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ deposit: 10 }}
            >
                <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your ID!" }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                label="Initial deposit (Min: 10)"
                name="deposit"
                rules={[{ required: true, message: "Please input your initial deposit!"}]}
                >
                <InputNumber min={10} />
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

export default withContext(Signup);