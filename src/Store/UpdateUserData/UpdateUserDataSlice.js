import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  users: [],
};

export const getUserData = createAsyncThunk(
  "UserDetail/getUserData",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/getUsersData/${data.id}`,
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

export const updateUserDetail = createAsyncThunk(
  "UserDetail/updateUserDetail",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("phone", data.phone);
      formData.append("img", data.img ? data.img : "");
      const response = await Api.post(`/updateUser/${data.id}`, formData, {
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

export const userPaymentDetail = createAsyncThunk(
  "UserDetail/userPaymentDetail",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/usersPaymentDetails/${data.id}`,
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
const userDetailSlice = createSlice({
  name: "UserDetail",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.fulfilled, (state, action) => {
        state.users = action?.payload?.users;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.users = action?.payload;
      })
      .addCase(updateUserDetail.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(updateUserDetail.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(userPaymentDetail.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(userPaymentDetail.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const userDetailList = (state) => state.UserDetail;

export default userDetailSlice.reducer;
