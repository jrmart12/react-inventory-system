
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography, Space, Image, Row, Col } from 'antd';
import babyHeavenLogo from '../assets/BABY-HEAVEN-LOGO.jpg';
import { ToolOutlined, ShoppingCartOutlined, OrderedListOutlined, BarChartOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Landing = () => {
  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/sign-in">Sign In</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/sign-up">Sign Up</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Space direction="vertical" align="center" style={{ padding: '100px 0' }}>
          <Title level={2}>Welcome to Inventory Management System</Title>
          <Text>Streamline your small business operations with our powerful inventory management solution.</Text>
          <Image src={babyHeavenLogo} alt="Baby Heaven Logo" width={500} />
        </Space>
        <Row gutter={[16, 16]} style={{ padding: '50px' }}>
          <Col span={6}>
            <Space direction="vertical" align="center">
              <ToolOutlined style={{ fontSize: '32px' }} />
              <Title level={4}>Add Products</Title>
              <Text>Easily add new products to your inventory.</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space direction="vertical" align="center">
              <ShoppingCartOutlined style={{ fontSize: '32px' }} />
              <Title level={4}>Manage Sells</Title>
              <Text>Track and manage your product sales.</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space direction="vertical" align="center">
              <OrderedListOutlined style={{ fontSize: '32px' }} />
              <Title level={4}>Order Management</Title>
              <Text>Efficiently manage orders from customers.</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space direction="vertical" align="center">
              <BarChartOutlined style={{ fontSize: '32px' }} />
              <Title level={4}>Generate Reports</Title>
              <Text>Generate detailed reports for better insights.</Text>
            </Space>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Inventory Management System by Jose Martinez ©2023</Footer>
    </Layout>
  );
};

export default Landing;
