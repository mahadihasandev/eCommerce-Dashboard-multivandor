import React from 'react'
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Registration from './Layouts/Registration';
import Otp from './Layouts/Otp';
import Login from './Layouts/Login';
import Error from './Layouts/Error';
import ChangePassword from './Layouts/ChangePassword';
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
import ViewOrder from './Layouts/ViewOrder';
import DashboardOverview from './Layouts/DashboardOverview';
import SalesAnalytics from './Layouts/SalesAnalytics';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Home />}>
        <Route index element={<DashboardOverview />} />
        <Route path='analytics' element={<SalesAnalytics />} />
        <Route path='viewcategory' element={<ViewCategory />} />
        <Route path='viewsubcategory' element={<ViewSubCategory />} />
        <Route path='addcategory' element={<AddCategory />} />
        <Route path='addsubcategory' element={<AddSubCategory />} />
        <Route path='addproduct' element={<AddProduct />} />
        <Route path='viewproduct' element={<ViewProduct />} />
        <Route path='viewvariant' element={<ViewVariant />} />
        <Route path='addvariant' element={<Addvariant />} />
        <Route path='addbannar' element={<AddBannar />} />
        <Route path='viewbanner' element={<ViewBanner />} />
        <Route path='adddiscount' element={<AddDiscount />} />
        <Route path='viewdiscount' element={<ViewDiscount />} />
        <Route path='vieworder' element={<ViewOrder />} />
      </Route>

      <Route path="/registration" element={<Registration />} />
      <Route path='/login' element={<Login />} />
      <Route path="/otp/:email/:otpcode" element={<Otp />} />
      <Route path="/otp/:email" element={<Otp />} />
      <Route path='/error/:error' element={<Error />} />
      <Route path='/forgetpassword' element={<ForgetPassword />} />
      <Route path='/changepassword' element={<ChangePassword />} />
      <Route path='/changepassword/:email' element={<ChangePassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;