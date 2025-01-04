import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  users: [],
};

export const getledgerData = createAsyncThunk(
  "ledger/getledgerData",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(
        `/circles/${data.id}/rounds`,
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

export const generateLedgerPDF = createAsyncThunk(
  "ledger/generateLedgerPDF",
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

const LedgerSlice = createSlice({
  name: "ledger",
  initialState,
  extraReducers: (builder) => {
    builder

      .addCase(getledgerData.fulfilled, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(getledgerData.rejected, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(generateLedgerPDF.fulfilled, (state, action) => {
        state.admins = action?.payload;
      })
      .addCase(generateLedgerPDF.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const ledgerData = (state) => state.ledger;

export default LedgerSlice.reducer;
