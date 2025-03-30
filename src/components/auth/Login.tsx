import { Form, Input, Button, Card, notification } from "antd";
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
    try {
      const response = await mutation.mutateAsync(values);

      // Check if response exists and has expected structure
      if (response && typeof response === "object") {
        // console.log("Login successful, response:", response);

        // First set the authentication state
        login();

        // Show success notification
        notification.success({
          message: "",
          description: "Login successful!",
          placement: "top",
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
        notification.error({
          message: "",
          description: "Login failed: Invalid response format",
          placement: "top",
        });
      }
    } catch (error: any) {
      console.error("Login error details:", error);

      const errorMessage = "Login failed. Please check your credentials.";

      notification.error({
        message: "",
        description: errorMessage,
        placement: "top",
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
          autoComplete='on'
          layout='vertical'
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
