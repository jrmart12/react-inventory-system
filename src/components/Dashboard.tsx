import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import Home from "./Home";

const { Header, Content } = Layout;

const Dashboard = () => {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/dashboard/home";

  const getSelectedMenuKey = () => {
    switch (location.pathname) {
      case "/dashboard/home":
        return "1";
      case "/dashboard/products":
        return "2";
      case "/dashboard/sells":
        return "3";
      case "/dashboard/expenses":
        return "4";
      case "/dashboard/inventory-report":
        return "5";
      case "/dashboard/sales-report":
        return "6";
      case "/dashboard/account":
        return "7";
      default:
        return "";
    }
  };

  const selectedMenuKey = getSelectedMenuKey();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedMenuKey]}
          defaultSelectedKeys={[]}
        >
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
            <Link to="/dashboard/expenses">Expenses</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/dashboard/sales-report">Sales Report</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/dashboard/inventory-report">Inventory Report</Link>
          </Menu.Item>

          <Menu.Item key="7">
            <Link to="/dashboard/account">Account</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "24px" }}>
        <div style={{ background: "#fff", minHeight: 360, padding: 24 }}>
          {isHomeRoute ? <Home /> : <Outlet />}
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
