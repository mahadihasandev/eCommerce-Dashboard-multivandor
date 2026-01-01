import { configureStore } from '@reduxjs/toolkit'
import  AuthSlice  from './Slices/AuthSlices'

export default configureStore({
  reducer: {
    activeUser:AuthSlice,
  }
})