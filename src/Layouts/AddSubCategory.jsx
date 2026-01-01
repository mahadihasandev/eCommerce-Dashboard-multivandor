import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";

function AddSubCategory() {
  const userData = useSelector((state) => state.activeUser);
  let [viewCategorys,setViewCategorys]=useState([])
  let [categoryId,setCategoryId]=useState('')
  
  const onFinish = async (values) => {
    let data = await axios.post(
      `${import.meta.env.VITE_LOCAL_API}/api/v1/product/addsubcategory`,
      {
        name: values.subcategory,
        ownerId: userData.value.id,
        categoryId:categoryId,
      }
    );
    if (data.data.success == "SubCategory has been Created") {
      toast.success(data.data.success);
    } else if (data.data.error == "SubCategory Already Exist") {
      toast.error(data.data.error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    Navigate(`/error/${errorInfo}`);
  };

  const onChange = (value) => {
    setCategoryId(value);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

useEffect(()=>{
  let viewCategory=async ()=>{
    let viewCategoryData=await axios.get(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/viewcategory`)
    let arr=[] 
    viewCategoryData.data.map((item)=>{
      arr.push(
        {
              value: item._id,
              label: item.name,
            }
      )
    })  
    setViewCategorys(arr)
  }
  viewCategory()
},[])

  return (
    <div>
      <div className="mt-20">
        <Select
          showSearch={{ optionFilterProp: "label", onSearch }}
          placeholder="Select Category"
          onChange={onChange}
          style={{ width: 506,marginLeft:"120px",marginBottom:"20px" }}
          options={
            viewCategorys
          }
        />
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
                Add Subcategory
              </span>
            }
            name="subcategory"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input style={{ width: "180%", padding: "10px" }} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
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
      </div>
    </div>
  );
}

export default AddSubCategory;
