import React from 'react'

import Registration from './Layouts/Registration'

import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import Otp from './Layouts/Otp';
import Login from './Layouts/Login';
import Error from './Layouts/Error';
import ChangePassword from './Layouts/ChangePassword'
import ForgetPassword from './Layouts/ForgetPassword';
import Home from './Layouts/Home';
import ViewCategory from './Layouts/ViewCategory';
import AddCategory from './Layouts/AddCategory';
import AddSubCategory from './Layouts/AddSubCategory';
import ViewSubCategory from './Layouts/ViewSubCategory';
import AddProduct from './Layouts/AddProduct';
import ViewProduct from './Layouts/ViewProduct';
import ViewVariant from './Layouts/ViewVariant';
import Addvariant from './Layouts/Addvariant';
import AddBannar from './Layouts/AddBannar';
import ViewBanner from './Layouts/ViewBanner';
import AddDiscount from './Layouts/AddDiscount';
import ViewDiscount from './Layouts/ViewDiscount';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
     {/* <Route path="/" element={<Registration/>}></Route> */}
    
     <Route path='/' element={<Home/>}>
        <Route path='viewcategory' element={<ViewCategory/>}></Route>
        <Route path='viewsubcategory' element={<ViewSubCategory/>}></Route>
        <Route path='addcategory' element={<AddCategory/>}></Route>
        <Route path='addsubcategory' element={<AddSubCategory/>}></Route>
        <Route path='addproduct' element={<AddProduct/>}></Route>
        <Route path='viewproduct' element={<ViewProduct/>}></Route>
        <Route path='viewvariant' element={<ViewVariant/>}></Route>
        <Route path='addvariant' element={<Addvariant/>}></Route>
        <Route path='addbannar' element={<AddBannar/>}></Route>
        <Route path='viewbanner' element={<ViewBanner/>}></Route>
        <Route path='adddiscount' element={<AddDiscount/>}></Route>
        <Route path='viewdiscount' element={<ViewDiscount/>}></Route>
     </Route>
      {/* <Route path="/otp/:email/:otpcode" element={<Otp/>}></Route>
     <Route path='/error/:error' element={<Error/>}></Route>
     <Route path='/forgetpassword' element={<ForgetPassword/>}></Route>
     <Route path='/changepassword' element={<ChangePassword/>}></Route> */}
     <Route path='/login' element={<Login/>}></Route>
    </>
  )
);





function App() {
  return (
    <div>
       <RouterProvider router={router} />
    </div>
  )
}

export default App