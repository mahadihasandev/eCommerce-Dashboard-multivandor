import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Registration() {

const onFinish =async values => {

    
  let data=await axios.post(`${import.meta.env.VITE_LOCAL_API}/api/v1/auth/registration`,{
    username:values.username,
    email:values.email,
    password:values.password
  },
  {
    headers:{auth:"12345678"}
  })

  if(data.data.error){
    toast.error(data.data.error)
  }else{
    
    toast.success("Registration done Very your Email")

  }
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

  return (
    <div className='flex flex-col pt-48 pr-48 items-center bg-[#0c3635] h-screen'> 

    <h1 className='mb-5 ml-24 text-[#ffffff] font-sans'> Dashboard Registration</h1>
    
    <ToastContainer />

         <Form
    name="basic"
    labelCol={{ span: 9 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 400}}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    
  >
    <Form.Item
      label={<span style={{ color: '#ffffff' }}>Username</span>}
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input style={{width:"180%",padding:"10px"}}/>
    </Form.Item>

    <Form.Item 
  
      label={<span style={{ color: '#ffffff',paddingRight:"25px" }}>Email</span>}
      name="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
    >
      <Input style={{width:"180%",padding:"10px"}}/>
    </Form.Item>

    <Form.Item
      label={<span style={{ color: '#ffffff' }}>Password</span>}
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password style={{width:"180%",padding:"10px"}}/>
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked" label={null}>
      <Checkbox style={{ color: '#ffffff' }}>Remember me</Checkbox>
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
     <p className='ml-32 cursor-pointer'>Already have an account? 
      <Link to='/login'><span className='text-lg text-blue-500'> Login</span></Link></p>
  </Form>
    </div>
  )
}

export default Registration