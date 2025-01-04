import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  users: [],
};

export const getUsersData = createAsyncThunk(
  "UsersData/UsersData",
  async (token, thunkAPI) => {
    try {
      const response = await Api.post(
        "/usersData",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.response.data.error,
      });
    }
  }
);

export const updateUserData = createAsyncThunk(
  "UsersData/UpdateUserData",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/updateStatus?id=${data.id}`,
        {
          role: data.role,
          statusId: data.statusId,
          statusLabel: data.statusLabel,
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
        errors: err?.response.data.error,
      });
    }
  }
);

const usersDataSlice = createSlice({
  name: "UsersData",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getUsersData.fulfilled, (state, action) => {
        state.users = action?.payload?.users;
      })
      .addCase(getUsersData.rejected, (state, action) => {
        state.users = action?.payload;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const userList = (state) => state.UsersData;

export default usersDataSlice.reducer;
