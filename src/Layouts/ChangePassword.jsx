import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { Button, Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ChangePassword() {
    let params=useParams()
    let navigate=useNavigate()
     const onFinish =async values => {

    
  let data=await axios.post(`${import.meta.env.VITE_LOCAL_API}/api/v1/forgetpassword`,{
    email:params.email,
    newpassword:values.password
  },
  )

  if(data.data.success=="Reset Password"){
      toast.success("Reset Password");
      
      setTimeout(() => {
        navigate("/login")
        
      }, 2000);

     }else{
      toast.error("Credential Invited");
     }
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
  return (
    <div>
        <div className='flex flex-col pt-48 pr-48 items-center bg-[#0c3635] h-screen'> 

    <h1 className='mb-5 ml-24 text-[#ffffff] font-sans'> Forget Password</h1>
    
    <ToastContainer />

         <Form
    name="basic"
    labelCol={{ span: 7 }}
    wrapperCol={{ span: 17 }}
    style={{ maxWidth:400}}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    
  >

    <Form.Item 
  
      label={<span style={{ color: '#ffffff',paddingRight:"25px" }}>Email</span>}
      name="password"
      rules={[{ required: true, message: 'Please input your New password!' }]}
    >
      <Input style={{width:"180%",padding:"10px"}}/>
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked" label={null}>
      <Checkbox style={{ color: '#ffffff' }}>Remember me</Checkbox>
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
    </div>
    </div>
  )
}

export default ChangePassword