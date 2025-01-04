import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {};

export const dashboardData = createAsyncThunk(
  "dashboard/dashboardData",
  async (token, thunkAPI) => {
    try {
      const response = await Api.post(
        "/dashboardData",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      // console.log(err);
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.response.data.error,
      });
    }
  }
);
export const getCirclesData = createAsyncThunk(
  "dashboard/CirclesData",
  async (token, thunkAPI) => {
    try {
      const response = await Api.post(
        "/circlesData",
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
export const changeCircleStatus = createAsyncThunk(
  "dashboard/changeCircleStatus",
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

export const getUsersData = createAsyncThunk(
  "dashboard/UsersData",
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
  "dashboard/UpdateUserData",
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

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(dashboardData.fulfilled, (state, action) => {
        state = action.payload.userData;
      })
      .addCase(dashboardData.rejected, (state, action) => {
        state = action.payload;
      })
      .addCase(getCirclesData.fulfilled, (state, action) => {
        state = action.payload.userData;
      })
      .addCase(getCirclesData.rejected, (state, action) => {
        state = action.payload;
      })
      .addCase(changeCircleStatus.fulfilled, (state, action) => {
        state = action.payload.userData;
      })
      .addCase(changeCircleStatus.rejected, (state, action) => {
        state = action.payload;
      })
      .addCase(getUsersData.fulfilled, (state, action) => {
        state = action.payload.userData;
      })
      .addCase(getUsersData.rejected, (state, action) => {
        state = action.payload;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state = action.payload.userData;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state = action.payload;
      });
  },
});

export const dashboard = (state) => state.dashboard;

export default dashboardSlice.reducer;
