import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  admins: [],
};

export const getadminData = createAsyncThunk(
  "adminDetail/getadminData",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/adminUsers/${data.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.message,
      });
    }
  }
);

export const updateAdminDetail = createAsyncThunk(
  "adminDetail/updateAdminDetail",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("username", data.username);
      formData.append("lastName", data.lastName);
      formData.append("phone", data.phone);
      formData.append("img", data.img);
      formData.append("password", "");
      formData.append("statusId", data.statusId);
      formData.append("statusLabel", data.statusLabel);
      formData.append("isActive", data.isActive);
      formData.append("isAdminActive", data.isAdminActive);
      formData.append("isAdminCreated", data.isAdminCreated);
      formData.append("isApprove", data.isApprove);
      formData.append("isCircleCreate", data.isCircleCreate);
      formData.append("isCirclesDelete", data.isCirclesDelete);
      formData.append("isDashboard", data.isDashboard);
      formData.append("isListofUsers", data.isListofUsers);
      formData.append("isMembersAdd", data.isMembersAdd);
      formData.append("isPaymentChange", data.isPaymentChange);
      formData.append("isReports", data.isReports);
      const response = await Api.post(`/updateAdmin/${data.id}`, formData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.message,
      });
    }
  }
);

export const createAdminDetail = createAsyncThunk(
  "adminDetail/createAdminDetail",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("lastName", data.lastName);
      formData.append("img", data.img);
      formData.append("password", data.password);
      formData.append("phone", data.phone);
      formData.append("statusId", 1);
      formData.append("statusLabel", "pending");
      formData.append("isActive", data.isActive);
      formData.append("isAdminActive", data.isAdminActive);
      formData.append("isAdminCreated", data.isAdminCreated);
      formData.append("isApprove", data.isApprove);
      formData.append("isCircleCreate", data.isCircleCreate);
      formData.append("isCirclesDelete", data.isCirclesDelete);
      formData.append("isDashboard", data.isDashboard);
      formData.append("isListofUsers", data.isListofUsers);
      formData.append("isMembersAdd", data.isMembersAdd);
      formData.append("isPaymentChange", data.isPaymentChange);
      formData.append("isReports", data.isReports);
      const response = await Api.post(`/createAdmin`, formData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.message,
      });
    }
  }
);

const adminDetailSlice = createSlice({
  name: "adminDetail",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getadminData.fulfilled, (state, action) => {
        state.admins = action?.payload?.admins;
      })
      .addCase(getadminData.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(updateAdminDetail.fulfilled, (state, action) => {
        state.admins = action?.payload?.admins;
      })
      .addCase(updateAdminDetail.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(createAdminDetail.fulfilled, (state, action) => {
        state.admins = action?.payload?.admins;
      })
      .addCase(createAdminDetail.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const adminDetailList = (state) => state.adminDetail;

export default adminDetailSlice.reducer;
