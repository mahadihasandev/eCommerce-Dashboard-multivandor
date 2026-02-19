import React, { useState } from 'react'
import { Button, Form, Input } from 'antd';
import { Select } from 'antd';
import axios from 'axios';

function AddDiscount() {
  const [discountType,setDiscountType]=useState('fixed')
  
    const onFinish = async values => {
  
  
  let data = await axios.post(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/adddiscount`, {
      discountname: values.discountname,
      discountamount:values.discountamount,
      discounttype:discountType,
      discountrange:values.discountrange,
    });
    console.log(data);
    
  
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};


  return (
    <div className='py-10'>
    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Discount Name"
      name="discountname"
      rules={[{ required: true, message: 'Please input your discount name!' }]}
    >
      <Input />
    </Form.Item>

       <Form.Item
      label="Discount Amount"
      name="discountamount"
      rules={[{ required: true, message: 'Please input your discount amount!' }]}
    >
      <Input />
    </Form.Item>

    <label className='ml-25' htmlFor="Discount Type">Discount Type :&nbsp;&nbsp;
         <Select
      defaultValue="fixed"
      style={{ width: 398,marginBottom:20 }}
      onChange={(e)=>(setDiscountType(e))}
      options={[
        { value: 'fixed', label: 'Fixed' },
        { value: 'parentage', label: 'Parentage' },
        { value: 'delivery', label: 'Delivery' },
      ]}
    />
    </label>
        <Form.Item
      label="Discount range"
      name="discountrange"
      rules={[{ required: true, message: 'Please input your discount range!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
    </div>
  )
}

export default AddDiscount