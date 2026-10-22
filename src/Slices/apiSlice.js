import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_LOCAL_API || 'https://e-commerce-backend-multivandor.vercel.app';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const user = state.activeUser?.value || (localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')) : null);
      if (user?.token) {
        headers.set('authorization', `Bearer ${user.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Category', 'Subcategory', 'Variant', 'Banner', 'Discount', 'Order', 'Auth'],
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    registration: builder.mutation({
      query: (formData) => ({
        url: '/api/v1/auth/registration',
        method: 'POST',
        body: formData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/otp',
        method: 'POST',
        body: data,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/forgetpassword',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/api/v1/auth/changepassword',
        method: 'POST',
        body: data,
      }),
    }),

    // Category Endpoints
    getCategories: builder.query({
      query: () => '/api/v1/product/viewcategory',
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/api/v1/product/addcategory',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),

    // Subcategory Endpoints
    getSubCategories: builder.query({
      query: () => '/api/v1/product/viewsubcategory',
      providesTags: ['Subcategory'],
    }),
    addSubCategory: builder.mutation({
      query: (subCategoryData) => ({
        url: '/api/v1/product/addsubcategory',
        method: 'POST',
        body: subCategoryData,
      }),
      invalidatesTags: ['Subcategory'],
    }),

    // Product Endpoints
    getProducts: builder.query({
      query: () => '/api/v1/product/viewproduct',
      providesTags: ['Product'],
    }),
    addProduct: builder.mutation({
      query: (formData) => ({
        url: '/api/v1/product/addproduct',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Product', 'Category', 'Subcategory'],
    }),
    editProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/v1/product/editproduct/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/v1/product/deleteproduct/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Variant Endpoints
    getVariants: builder.query({
      query: () => '/api/v1/product/viewvariant',
      providesTags: ['Variant'],
    }),
    addVariant: builder.mutation({
      query: (formData) => ({
        url: '/api/v1/product/addvariant',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Variant'],
    }),

    // Banner Endpoints
    getBanners: builder.query({
      query: () => '/api/v1/product/viewbanner',
      providesTags: ['Banner'],
    }),
    addBanner: builder.mutation({
      query: (formData) => ({
        url: '/api/v1/product/addbanner',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Banner'],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/api/v1/product/deletebanner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banner'],
    }),

    // Discount Endpoints
    getDiscounts: builder.query({
      query: () => '/api/v1/product/viewdiscount',
      providesTags: ['Discount'],
    }),
    addDiscount: builder.mutation({
      query: (discountData) => ({
        url: '/api/v1/product/adddiscount',
        method: 'POST',
        body: discountData,
      }),
      invalidatesTags: ['Discount'],
    }),
    deleteDiscount: builder.mutation({
      query: (id) => ({
        url: `/api/v1/product/deletediscount/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Discount'],
    }),

    // Order Endpoints
    getOrders: builder.query({
      query: () => '/api/v1/product/vieworder',
      providesTags: ['Order'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/v1/product/updateorder/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useVerifyOtpMutation,
  useForgetPasswordMutation,
  useChangePasswordMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useGetSubCategoriesQuery,
  useAddSubCategoryMutation,
  useGetProductsQuery,
  useAddProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  useGetVariantsQuery,
  useAddVariantMutation,
  useGetBannersQuery,
  useAddBannerMutation,
  useDeleteBannerMutation,
  useGetDiscountsQuery,
  useAddDiscountMutation,
  useDeleteDiscountMutation,
  useGetOrdersQuery,
  useUpdateOrderMutation,
} = apiSlice;
