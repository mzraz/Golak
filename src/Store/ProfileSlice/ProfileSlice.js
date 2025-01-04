import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";
const initialState = {};

export const userprofileData = createAsyncThunk(
  "profile/userprofileData",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("phone", data.phone);
      formData.append("img", data.img);

      const response = await Api.post(`/updateProfile/${data.id}`, formData, {
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

export const userPasswordChange = createAsyncThunk(
  "profile/userPasswordChange",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/changePassword/${data.id}`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.password,
        },
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(userprofileData.fulfilled, (state, action) => {
        state = action.payload;
      })
      .addCase(userprofileData.rejected, (state, action) => {
        state = action.payload;
      })
      .addCase(userPasswordChange.fulfilled, (state, action) => {
        state = action.payload;
      })
      .addCase(userPasswordChange.rejected, (state, action) => {
        state = action.payload;
      });
  },
});

export const initialAuth = (state) => state.auth;

export default profileSlice.reducer;
