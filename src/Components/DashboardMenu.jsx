import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import { authInfo } from '../Slices/AuthSlices';

function DashboardMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem('userinfo');
    dispatch(authInfo(null));
    navigate('/'); 
  };

  const onClick = (e) => {
    navigate(e.key);
  };

  
  const items = [
  
    // userinfo?.role !== 'merchant' &&
     {
      key: 'sub1',
      label: 'Admin',
      icon: <MailOutlined />,
      children: [
        { key: 'g1', label: 'Merchant' },
        { key: 'g2', label: 'User' },
      ],
    },
    { type: 'divider' },
    {
      key: 'sub2',
      label: 'Category',
      icon: <AppstoreOutlined />,
      children: [
        { key: '/viewcategory', label: 'View Category' },
        { key: '/addcategory', label: 'Add Category' },
      ],
    },
    { type: 'divider' },
    {
      key: 'sub4',
      label: 'Sub Category',
      icon: <SettingOutlined />,
      children: [
        { key: '/viewsubcategory', label: 'View Subcategory' },
        { key: '/addsubcategory', label: 'Add Subcategory' },
      ],
    },
    { type: 'divider' },
    {
      key: 'sub5',
      label: 'Products',
      icon: <SettingOutlined />,
      children: [
        { key: '/viewproduct', label: 'View Products' },
        { key: '/addproduct', label: 'Add Products' },
      ],
    },
    { type: 'divider' },
    {
      key: 'sub6',
      label: 'Variant',
      icon: <SettingOutlined />,
      children: [
        { key: '/viewvariant', label: 'View Variant' },
        { key: '/addvariant', label: 'Add Variant' },
      ],
    },
    { type: 'divider' },
    {
      key: 'sub7',
      label: 'Banner',
      icon: <SettingOutlined />,
      children: [
        { key: '/viewbanner', label: 'View Banner' },
        { key: '/addbannar', label: 'Add Banner' },
      ],
    },
    { type: 'divider' },
    // userinfo?.role !== 'merchant' && 
    {
      key: 'sub8',
      label: 'Discount',
      icon: <SettingOutlined />,
      children: [
        { key: '/viewdiscount', label: 'View Discount' },
        { key: '/adddiscount', label: 'Add Discount' },
      ],
    },
  ].filter(Boolean); 

  return (
    <div>
      <Menu
        onClick={onClick}
        style={{ width: 356, fontSize: "27px", marginTop: "20px" }}
        mode="inline"
        items={items}
      />
      <button 
        className='border bg-blue-500 text-white 
        px-5 py-2 text-xl rounded-xl mx-30 my-5 font-bold' 
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardMenu;
