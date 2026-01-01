import { Button, Form, Input } from "antd";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function AddCategory() {

  const userData = useSelector((state) => state.activeUser);
  
  const onFinish = async (values) => {
    let data = await axios.post(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/addcategory`, {
      name: values.category,
      ownerId:userData.value.id,
    });
    if(data.data.success=="Category has been Created"){
      toast.success(data.data.success)
    }else if(data.data.error=="Category Already Exist"){
      toast.error(data.data.error)
    }
   
  };
  const onFinishFailed = (errorInfo) => {
     Navigate(`/error/${errorInfo}`);
  };
  return (
    <div className='mt-20'>
      <Form
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          style={{ maxWidth: 400 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={
              <span style={{ color: "#ffffff", paddingRight: "25px" }}>
               Add Category
              </span>
            }
            name="category"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input style={{ width: "180%", padding: "10px" }} />
          </Form.Item>


          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
           <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </Form>
       
    </div>
  )
}

export default AddCategory