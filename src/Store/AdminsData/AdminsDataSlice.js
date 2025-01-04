import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  admins: [],
};

export const getAdminsData = createAsyncThunk(
  "AdminsData/AdminsData",
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
        errors: err?.message,
      });
    }
  }
);

export const updateAdminData = createAsyncThunk(
  "AdminsData/UpdateAdminsData",
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
        errors: err?.message,
      });
    }
  }
);

const adminsDataSlice = createSlice({
  name: "AdminsData",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAdminsData.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(getAdminsData.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(updateAdminData.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(updateAdminData.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const adminsList = (state) => state.AdminsData;

export default adminsDataSlice.reducer;
