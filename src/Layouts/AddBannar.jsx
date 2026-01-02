import { Button, ConfigProvider, Form, Input } from "antd";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { CloudUpload } from "lucide-react";

function AddBannar() {
  const [des, setDes] = useState("");
  const [image, setImage] = useState("");
  const [form] = Form.useForm();

 



  const onFinish = async (values) => {
    let data = await axios.post(
      `${import.meta.env.VITE_LOCAL_API}/api/v1/product/addbanner`,
      {
        name: values.productname,
        description: des,
        productImg: image,
      },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (data.data.success == "Banner created successfully") {
      toast.success("Banner created successfully");
      
      form.resetFields();
      setDes('')
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error(errorInfo);
  };

  let handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 18,
          fontFamily: "'Poppins', sans-serif",
        },
      }}
    >
      <div className="mt-10 ">
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
            label="Banner Name"
            name="productname"
            
            rules={[
              { required: true, message: "Please input your Banner Title!" },
            ]}
          >
             <Input/>
          </Form.Item>

          <div className="flex items-start justify-center ml-40 mt-10 ">
            <label className="w-[130px] pt-0.5" htmlFor="description">
              Description :
            </label>
            <textarea className="h-30 border w-full p-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500 rounded-lg" 
            type="text" 
            onChange={(e)=>(setDes(e.target.value))}
            value={des}
            placeholder="Description"
            />
          </div>

          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input image!" }]}
          >
            <Input
              prefix={<CloudUpload className="text-gray-400 mr-2" />}
              onChange={handleImage}
              type="file"
            />
          </Form.Item>

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
  );
}

export default AddBannar;
