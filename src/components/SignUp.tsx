import { useState } from 'react';
import { signUpWithEmail } from '../utils/supabaseAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Space, Image } from 'antd';
import babyHeavenLogo from '../assets/BABY-HEAVEN-LOGO.jpg';
import "../sass/pages/SignUp.scss";
const { Title, Text } = Typography;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const { success, error } = await signUpWithEmail(email, password);
    if (success) {
      navigate("/dashboard/home");
    } else {
      alert(error);
    }
  };

  return (
    <div className="sign-in-container">
      <Space direction="vertical" align="center" style={{ padding: "100px 0" }}>
        <Image src={babyHeavenLogo} alt="Baby Heaven Logo" width={300} />
        <Title level={2}>Sign Up</Title>
        <Form
          name="sign-up"
          initialValues={{ remember: true }}
          onFinish={handleSignUp}
          style={{ width: "300px" }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Sign Up
            </Button>
          </Form.Item>

          <Form.Item>
            <Text>
              Already have an account? <Link to="/sign-in">Sign In</Link>
            </Text>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default SignUp;
