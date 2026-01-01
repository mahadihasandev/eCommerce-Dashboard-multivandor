import { Flex, Space, Table, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import slugify from 'react-slugify';


function ViewProduct() {
  const [productData,setProductData]=useState([])
  const [edit,setEdit]=useState(false)
  const [names,setNames]=useState('')
  const [des,setDes]=useState('')
  const [regularPrice,setRegularPrice]=useState('')
  const [salePrice,setSalePrice]=useState('')
  const [refresh, setRefresh] = useState('');
  
  const [getId,setId]=useState('')
 
 let updatedSlug=slugify(names)
  

useEffect(()=>{


  let ProductData=async()=>{
    let data=await axios.get(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/viewproduct`)
     
    
    let mapData=data.data.map((item)=>{
      return{
        id:item._id,
        name:item.name,
        description:item.description,
        image:item.image,
        regular:item.regularprice,
        saleprice:item.saleprice,
      }
    })
    setProductData(mapData); 
  }
  ProductData()
}

,[refresh])

const handleDelete=async(item)=>{ 
 let deleteData=await axios.delete(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/deleteproduct${item}`)
  setRefresh(deleteData.data)
}

const handleEdit=(data)=>{ 
  console.log(data);
setId(data.id)
setEdit(true)
setRegularPrice(data.regular)
setSalePrice(data.saleprice)
setNames(data.name)
setDes(data.description)


}

let handleUpdate=async()=>{
await axios.post(`${import.meta.env.VITE_LOCAL_API}/api/v1/product/editproduct${getId}`,
    {
     name:names,
     description:des,
     saleprice:salePrice,
     regularprice:regularPrice,
     slug:updatedSlug,
    })
    setRefresh(!refresh)
    setEdit(false)
}


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
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
   
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
     render: (text) =><img width='100px' src={`${text}`} alt="Image" />,
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
    render: (data) => (
      
      
      <Space size="middle">
        <a className='border rounded-2xl px-5 py-2' onClick={()=>(handleEdit(data))}>Edit</a>
        <a className='border rounded-2xl px-5 py-2 ' onClick={()=>(handleDelete(data.id)
        )}>Delete</a>
      </Space>
    ),
  },
];


  return (
    <div className='mt-10 relative '>
       <Table columns={columns} dataSource={productData}/>

       {edit &&<div className='p-8 rounded-xl flex flex-col gap-4 border border-slate-200 w-[35%] bg-white absolute top-20 right-10 shadow-2xl z-50 animate-in fade-in zoom-in duration-200'>
  
  <h2 className='text-xl font-bold text-slate-800 mb-2 border-b pb-2'>Edit Product</h2>

  <div className='flex flex-col gap-1'>
    <label className='text-sm font-semibold text-slate-600'>Product Name</label>
    <input 
      value={names} 
      onChange={(e) => {setNames(e.target.value)}} 
      className='border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
      type="text" 
      placeholder="Enter product name"
    />
  </div>

  <div className='flex flex-col gap-1'>
    <label className='text-sm font-semibold text-slate-600'>Description</label>
    <textarea 
      value={des} 
      onChange={(e) => {setDes(e.target.value)}} 
      className='border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-all' 
      placeholder="Describe the product..."
    />
  </div>

  <div className='grid grid-cols-2 gap-4'>
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-semibold text-slate-600'>Sale Price</label>
      <input 
        value={salePrice} 
        onChange={(e) => {setSalePrice(e.target.value)}} 
        className='border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all' 
        type="text" 
      />
    </div>
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-semibold text-slate-600'>Regular Price</label>
      <input 
        value={regularPrice} 
        onChange={(e) => {setRegularPrice(e.target.value)}} 
        className='border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all' 
        type="text" 
      />
    </div>
  </div>

  <div className='flex flex-col gap-1'>
    <label className='text-sm font-semibold text-slate-600'>URL Slug (Auto-generated)</label>
    <input 
      id='slug' 
      value={slugify(names)} 
      type='text' 
      disabled 
      className='border border-slate-200 bg-slate-50 text-slate-500 rounded-md px-3 py-2 cursor-not-allowed' 
    />
  </div>

  <div className='flex gap-3 mt-4'>
    <button 
      className='bg-blue-600 hover:bg-blue-700 active:scale-95 flex-1 py-2.5 rounded-lg text-white font-semibold transition-all shadow-md shadow-blue-200' 
      onClick={handleUpdate}
    >
      Update Product
    </button>
    <button 
      className='bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-lg font-semibold transition-all' 
      onClick={() => setEdit(false)}
    >
      Cancel
    </button>
  </div>
</div>

       }
    </div>
  )
}

export default ViewProduct