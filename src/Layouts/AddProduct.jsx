import { Button, ConfigProvider, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { CloudUpload } from "lucide-react";
import Tiptap from "../Components/Tiptap";

function AddProduct() {
  const [slug, setSlug] = useState("");
  const [des, setDes] = useState("");
  const [image, setImage] = useState([]);
  const [form] = Form.useForm();
  let [viewCategorys, setViewCategorys] = useState([]);
  let [categoryId, setCategoryId] = useState("");
  let [viewSubCategorys, setViewSubCategorys] = useState([]);
  let [subCategoryId, setSubCategoryId] = useState("");

  const onFinish = async (values) => {

    const formData = new FormData();
    formData.append("name", values.productname);
    formData.append("description", des);
    formData.append("saleprice", values.saleprice);
    formData.append("regularprice", values.regularprice);
    formData.append("stock", values.stock);
    formData.append("slug", slug);
    formData.append("createdAt", Date.now());
    formData.append("quickoverview", values.quickoverview);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);

    // Append multiple images
    if (image && image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        formData.append("productImg", image[i]);
      }
    }

    let data = await axios.post(
      `${import.meta.env.VITE_LOCAL_API}/api/v1/product/addproduct`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    if (data.data.success == "Product created successfully") {
      toast.success("Product created successfully");
      setDes("");
      form.resetFields();
      setSlug("");
    } else if (data.data.error == "Product already exist") {
      toast.error("Product already exist");
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error(errorInfo);
  };

  let handleImage = (e) => {
    setImage([...e.target.files]);
  };

  const handleCategoryChange = (value) => {
    setCategoryId(value);
    console.log("Category:", value);
  };

  const handleSubCategoryChange = (value) => {
    setSubCategoryId(value);
    console.log("Subcategory:", value);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  useEffect(() => {
    let viewCategory = async () => {
      let viewCategoryData = await axios.get(
        `${import.meta.env.VITE_LOCAL_API}/api/v1/product/viewcategory`,
      );
      let arr = [];
      viewCategoryData.data.map((item) => {
        arr.push({
          value: item._id,
          label: item.name,
        });
      });
      setViewCategorys(arr);
    };
    viewCategory();
  }, []);

  useEffect(() => {
    let viewSubCategory = async () => {
      let viewSubCategoryData = await axios.get(
        `${import.meta.env.VITE_LOCAL_API}/api/v1/product/viewsubcategory`,
      );
      let arr = [];
      viewSubCategoryData.data.map((item) => {
        arr.push({
          value: item._id,
          label: item.name,
        });
      });
      setViewSubCategorys(arr);
    };
    viewSubCategory();
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
            label="Product Name"
            name="productname"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input onChange={(e) => setSlug(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please number only" }]}
          >
            <Input type="number" />
          </Form.Item>
          <div className="flex">
            <label className="ml-44" htmlFor="categoryId">
              Category
            </label>
            <Select
              showSearch={{ optionFilterProp: "label", onSearch }}
              placeholder="Select Category"
              onChange={handleCategoryChange}
              style={{ width: 506, marginLeft: "20px", marginBottom: "20px" }}
              options={viewCategorys}
            />
          </div>
          <div className="flex">
            <label className="ml-44" htmlFor="categoryId">
              Subcategory
            </label>
            <Select
              showSearch={{ optionFilterProp: "label", onSearch }}
              placeholder="Select Subcategory"
              onChange={handleSubCategoryChange}
              style={{ width: 506, marginLeft: "20px", marginBottom: "20px" }}
              options={viewSubCategorys}
            />
          </div>
          <Form.Item
            label="Quick Overview"
            name="quickoverview"
            rules={[
              { required: true, message: "Please input your Quick Overview!" },
            ]}
          >
            <Tiptap />
          </Form.Item>

          <div className="flex items-start ml-40 mt-10">
            <label className="w-[120px] pt-0.5" htmlFor="description">
              Description :
            </label>

            <div className="w-[800px] mb-12">
              <Tiptap value={des} onChange={setDes} />
            </div>
          </div>

          <Form.Item
            label="Image"
            name="image"
            rules={[{ required: true, message: "Please input image!" }]}
          >
            <Input
              prefix={<CloudUpload className="text-gray-400 mr-2" />}
              onChange={handleImage}
              multiple
              type="file"
            />
          </Form.Item>

          <Form.Item
            label="Regular Price"
            name="regularprice"
            rules={[
              { required: true, message: "Please input your Regular Price!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Sale Price"
            name="saleprice"
            rules={[
              { required: true, message: "Please input your Sale Price!" },
            ]}
          >
            <Input />
          </Form.Item>

          <label className="ml-[22%]" htmlFor="slug">
            Slug : <span />
            <input
              className="border border-gray-300 rounded-md px-4 w-[66%] py-1 ml-10 mb-5"
              id="slug"
              defaultValue={slugify(slug)}
              type="text"
              disabled
            />
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
  );
}

export default AddProduct;
