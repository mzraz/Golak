import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  users: [],
};

export const getCircleDashboardData = createAsyncThunk(
  "CircleDashboard/getCircleDashboardData",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/getcirclesData/${data.id}`,
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
        errors: err?.response.data.error,
      });
    }
  }
);

export const inviteCircleUsers = createAsyncThunk(
  "CircleDashboard/inviteCircleUsers",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/updateCircle/${data.id}`,
        data.circleUsers,
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
export const deleteCircleUsers = createAsyncThunk(
  "CircleDashboard/deleteCircleUsers",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/removeUser/${data.circleId}/${data.userId}`,
        data.circleUsers,
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

export const organizePayments = createAsyncThunk(
  "CircleDashboard/organizePayments",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(`/updatePayments`, data.apiData, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.response.data.error,
      });
    }
  }
);

const circleDashboardSlice = createSlice({
  name: "CircleDashboard",
  initialState,
  extraReducers: (builder) => {
    builder

      .addCase(getCircleDashboardData.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(getCircleDashboardData.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(inviteCircleUsers.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(inviteCircleUsers.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(organizePayments.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(organizePayments.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(deleteCircleUsers.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(deleteCircleUsers.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const circleDashboardData = (state) => state.CircleDashboard;

export default circleDashboardSlice.reducer;
