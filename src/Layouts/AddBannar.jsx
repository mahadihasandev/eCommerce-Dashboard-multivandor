import { Button, ConfigProvider, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { CloudUpload } from "lucide-react";

function AddBannar() {
  const [des, setDes] = useState("");
  const [image, setImage] = useState("");
  const [form] = Form.useForm();
  const [viewProduct, setViewProduct] = useState([]);
  const [productSlug, setProductSlug] = useState("");
  console.log(productSlug);
  
  

  const onFinish = async (values) => {
    let data = await axios.post(
      `${import.meta.env.VITE_LOCAL_API}/api/v1/product/addbanner`,
      {
        name: values.productname,
        description: des,
        productImg: image,
        productSlug: productSlug,
      },
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    if (data.data.success == "Banner created successfully") {
      toast.success("Banner created successfully");

      form.resetFields();
      setDes("");
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error(errorInfo);
  };

  const onChange = (value, option) => {

    setProductSlug(option.slug);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  let handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    let viewCategory = async () => {
      let viewProduct = await axios.get(
        `${import.meta.env.VITE_LOCAL_API}/api/v1/product/viewproduct`,
      );
      console.log(viewProduct);

      let arr = [];
      viewProduct.data.map((item) => {
        arr.push({
          value: item._id,
          label: item.name,
          slug: item.slug,
        });
      });
      setViewProduct(arr);
    };
    viewCategory();
  }, []);
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
            <Input />
          </Form.Item>
            <div className="ml-32">
              <label  htmlFor="productname">Product Name :</label>
          <Select
            showSearch={{ optionFilterProp: "label", onSearch }}
            placeholder="Select Product"
            onChange={onChange}
            style={{ width: 506, marginLeft: "10px", marginBottom: "20px" }}
            options={viewProduct}
          />
          </div>

          <div className="flex items-start justify-center ml-40 mt-10 ">
            <label className="w-[130px] pt-0.5" htmlFor="description">
              Description :
            </label>
            <textarea
              className="h-30 border w-full p-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              type="text"
              onChange={(e) => setDes(e.target.value)}
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
