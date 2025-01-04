import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  users: [],
};

export const getOrganizePaymentsData = createAsyncThunk(
  "OrganizePayments/getOrganizePaymentsData",
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

export const paymentsMarkedForUsers = createAsyncThunk(
  "OrganizePayments/paymentsMarkedForUsers",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(`/updatePayments`, data.circleUsers, {
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

const OrganizePaymentSlice = createSlice({
  name: "OrganizePayments",
  initialState,
  extraReducers: (builder) => {
    builder

      .addCase(getOrganizePaymentsData.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(getOrganizePaymentsData.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(paymentsMarkedForUsers.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(paymentsMarkedForUsers.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const OrganizePaymentsData = (state) => state.OrganizePayments;

export default OrganizePaymentSlice.reducer;
