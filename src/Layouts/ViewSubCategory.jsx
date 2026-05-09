import { Flex, Space, Table, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function ViewSubCategory() {
    let [catViewData,setCatViewData]=useState([])
    console.log(catViewData);
    

  const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
   
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Owner Role',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <Flex gap="small" align="center" wrap>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </Flex>
    ),
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

const userData = useSelector((state) => state.activeUser.value);

  useEffect(()=>{
   async function viewCatData(){
    let viewData=await axios.get(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/viewsubcategory`)
    console.log(viewData);
    
    let arr=[]
    
    viewData.data.map((item)=>{
      arr.push({
        key:item._id,
        name:item.name,
        category:item.categoryId.name,
        tags:[userData?.role || '']
      })
      
    })
    setCatViewData(arr);    
    }
    viewCatData()
  },[userData?.role])
  return (
   <div className='mt-10'>
    <h1 className='text-center text-5xl mr-64 mb-5 font-sans font-semibold'>Subcategory List</h1>
        <Table columns={columns} dataSource={catViewData} />
    </div>
  )
}

export default ViewSubCategory