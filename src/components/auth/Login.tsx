import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [form] = Form.useForm();
  const mutation = useLogin();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    console.log("Starting login process with values:", values);
    try {
      const response = await mutation.mutateAsync(values);
      console.log("Raw API response:", response);

      // Check if response exists and has expected structure
      if (response && typeof response === "object") {
        console.log("Login successful, response:", response);

        // First set the authentication state
        login();

        // Show success message
        message.success({
          content: "Login successful!",
          duration: 3,
        });

        // Reset form
        form.resetFields();

        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          console.log("Navigating to dashboard...");
          navigate("/dashboard", { replace: true });
        }, 100);
      } else {
        console.warn("Unexpected response format:", response);
        message.error({
          content: "Login failed: Invalid response format",
          duration: 3,
        });
      }
    } catch (error: any) {
      console.error("Login error details:", error);
      // Check if error has a response from the server
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";

      message.error({
        content: errorMessage,
        duration: 3,
      });
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
