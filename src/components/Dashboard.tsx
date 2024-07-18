import { Link, Outlet } from 'react-router-dom';
import { Layout, Menu, } from 'antd';
const { Header, Content } = Layout;

const Dashboard = () => {

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/dashboard/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/dashboard/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/dashboard/sells">Sales</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/dashboard/inventory-report">Inventory Report</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/dashboard/sales-report">Sales Report</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/dashboard/account">Account</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div style={{ background: '#fff', minHeight: 360, padding: 24 }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;