import { Button, ConfigProvider, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import slugify from 'slugify';
import {toast, ToastContainer } from 'react-toastify';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
import { CloudUpload } from 'lucide-react';

function Addvariant() {
    const [slug,setSlug]=useState('')
   const [des,setDes]=useState('')
   const [image,setImage]=useState('')
   const [form] = Form.useForm();

   const { quill, quillRef } = useQuill();

  useEffect(()=>{
    if(quill){
      quill.on('text-change',function(){
        setDes(quill.root.innerHTML);  
    })
    }
    
  },[quill])

  const onFinish =async (values) => {
    console.log(values);
    
  
  
  let data=await axios.post(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/addvariant`,
    {
     variantname:values.variantname,
     description:des,
     productImg:image,
     saleprice:values.saleprice,
     regularprice:values.regularprice,
     slug:slug,
    },
    {
      headers:{"Content-Type":"multipart/form-data"}
    }
  )
   if(data.data.success=="Variant created successfully"){
        toast.success("Variant added successfully")
        quill.setText('');
        form.resetFields();
        setSlug('');
        
      }else if(data.data.error=="Product does not exist"){
        toast.error('Only exist product can have variant')
      } 
}

const onFinishFailed = errorInfo => {
  toast.error(errorInfo)
};

let handleImage=(e)=>{
  setImage(e.target.files[0]);
  
}
  return (
     <ConfigProvider
      theme={{
        token: {
          fontSize: 18,
          fontFamily: "'Poppins', sans-serif",
        
        },
      }}
    >
    <div className='mt-10 '>
      
      <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
    <Form.Item
      label="Variant Name"
      name="variantname"
      rules={[{ required: true, message: 'Please input your variant name!' }]}
    >
      <Input onChange={(e)=>setSlug(e.target.value)}/>
    </Form.Item>

      <div className="flex items-start ml-40 mt-10">
  <label 
    className="w-[120px] pt-0.5 " 
    htmlFor="description"
  >
    Description :
  </label>

  <div style={{ width: 530, height: 100, marginBottom: 120,background:`#fffff` }}>
    <div ref={quillRef} />
  </div>
</div>
     

    <Form.Item
      label="Image"
      name="image"
      rules={[{ required: true, message: 'Please input image!' }]}
    >
      <Input prefix={<CloudUpload className="text-gray-400 mr-2" />} onChange={handleImage} type='file'/>
    </Form.Item>

    <Form.Item
      label="Regular Price"
      name="regularprice"
      rules={[{ required: true, message: 'Please input your Regular Price!' }]}
    >
      <Input />
    </Form.Item>

      <Form.Item
      label="Sale Price"
      name="saleprice"
      rules={[{ required: true, message: 'Please input your Sale Price!' }]}
    >
      <Input />
    </Form.Item>

    <label className='ml-[22%]' htmlFor="slug">Slug : <span/>
      <input className='border border-gray-300 rounded-md px-4 w-[66%] py-1 ml-10 mb-5' id='slug' defaultValue={slugify(slug)} type='text' disabled/>
    </label>
      

    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
     <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
            
          />
  </Form>

  
    </div>
    </ConfigProvider>
  )
}

export default Addvariant