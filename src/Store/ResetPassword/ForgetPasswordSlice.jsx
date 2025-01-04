import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";
const initialState = {};

export const fogetPassword = createAsyncThunk(
  "resetPassword/forget",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(`/forgetPassword?email=${data.email}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.message,
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword/reset",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/updatePassword?email=${data.email}&newPassword=${data.newPassword}&confirmNewPassword=${data.confirmNewPassword}`
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

const forgetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fogetPassword.fulfilled, (state, action) => {
        state = action.payload;
      })
      .addCase(fogetPassword.rejected, (state, action) => {
        state = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state = action.payload;
      });
  },
});

export const initialAuth = (state) => state.resetPassword;

export default forgetPasswordSlice.reducer;
