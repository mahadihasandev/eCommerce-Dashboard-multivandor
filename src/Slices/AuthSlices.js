import { createSlice } from '@reduxjs/toolkit'

export const AuthSlice = createSlice({
  name: 'authInit',
  initialState: {
    value: localStorage.getItem('userinfo')?JSON.parse(localStorage.getItem('userinfo')):null,
  },
  reducers: {
    authInfo: (state,actions )=> {
      state.value=actions.payload
    },
    
  }
})
export const { authInfo } = AuthSlice.actions
export default AuthSlice.reducer