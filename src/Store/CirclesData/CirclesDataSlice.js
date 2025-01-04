import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  admins: [],
};

export const getCirclesData = createAsyncThunk(
  "CirclesData/CirclesData",
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
  "CirclesData/changeCircleStatus",
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

const circlesDataSlice = createSlice({
  name: "CirclesData",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCirclesData.fulfilled, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(getCirclesData.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(changeCircleStatus.fulfilled, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(changeCircleStatus.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const circlesList = (state) => state.CirclesData;

export default circlesDataSlice.reducer;
