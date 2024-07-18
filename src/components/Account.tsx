
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';

const Account = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <Space direction="vertical" align="center">
      <h2>Account</h2>
      {/* Add account details or settings here */}
      <Button type="primary" onClick={handleLogout}>
        Log Out
      </Button>
    </Space>
  );
};

export default Account;