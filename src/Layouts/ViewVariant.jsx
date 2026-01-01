import { Flex, Space, Table, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';


function ViewVariant() {
  const [ productData,setProductData]=useState([])

useEffect(()=>{
  let ProductData=async()=>{
    let data=await axios.get(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/viewvariant`)
    
    
    let mapData=data.data.map((item,index)=>{
      return{
        id:index+1,
        name:item.variantname,
        image:item.image,
        regular:item.regularprice,
        saleprice:item.saleprice,
      }
    })
    setProductData(mapData); 
  }
  ProductData()
}

,[])
const columns = [
    {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
   
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
     render: (text) =><img width='100px' src={`http://localhost:8000${text}`} alt="Image" />,
  },
  {
    title: 'Regular Price',
    dataIndex: 'regular',
    key: 'regular',
  },
   {
    title: 'Sale Price',
    dataIndex: 'saleprice',
    key: 'saleprice',
  },
  
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];


  return (
    <div className='mt-10'>
       <Table columns={columns} dataSource={productData}/>
       <img src="" alt="" />
    </div>
  )
}

export default ViewVariant