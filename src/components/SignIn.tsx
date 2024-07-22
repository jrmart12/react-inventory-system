import { useState } from 'react';
import { signInWithEmail } from '../utils/supabaseAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Space, Image } from 'antd';
import babyHeavenLogo from '../assets/BABY-HEAVEN-LOGO.jpg';
const { Title, Text } = Typography;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    const { success, error } = await signInWithEmail(email, password);
    if (success) {
      navigate("/dashboard/home");
    } else {
      alert(error);
    }
  };

  return (
    <Space direction="vertical" align="center" style={{ padding: '100px 0' }}>
      <Image src={babyHeavenLogo} alt="Inventory" width={300} />
      <Title level={2}>Sign In</Title>
      <Form
        name="sign-in"
        initialValues={{ remember: true }}
        onFinish={handleSignIn}
        style={{ width: '300px' }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Sign In
          </Button>
        </Form.Item>

        <Form.Item>
          <Link to="/forgot-password">Forgot password?</Link>
        </Form.Item>

        <Form.Item>
          <Text>Don't have an account? <Link to="/sign-up">Sign Up</Link></Text>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default SignIn;