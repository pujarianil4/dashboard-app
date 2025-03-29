import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "../../hooks/useLogin";
import "./Login.scss";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [form] = Form.useForm();
  const mutation = useLogin();

  const onFinish = async (values: LoginFormValues) => {
    message.success("Login successful!");
    // console.log("Starting login process...");
    try {
      const response = await mutation.mutateAsync(values);
      console.log("Login response:", response);

      if (response) {
        console.log("Login successful, showing success message");
        message.success("Login successful!");
        form.resetFields();
      } else {
        console.log("Login response is empty");
        message.error("Login failed: No response from server");
      }
    } catch (error) {
      console.error("Login error details:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className='login-container'>
      <Card title='Login' className='login-card'>
        <Form
          form={form}
          name='login'
          onFinish={onFinish}
          autoComplete='off'
          layout='vertical'
          initialValues={{
            email: "kishore@endl.app",
            password: "G7m@xQ2w!",
          }}
        >
          <Form.Item
            name='email'
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder='Email' size='large' />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Password'
              size='large'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={mutation.isPending}
              block
              size='large'
            >
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
