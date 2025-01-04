import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  users: [],
};

export const createCircle = createAsyncThunk(
  "CreateCirlce/createCircle",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post(`/createCircle`, data.data, {
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

const CreateCirlceSlice = createSlice({
  name: "CreateCirlce",
  initialState,
  extraReducers: (builder) => {
    builder

      .addCase(createCircle.fulfilled, (state, action) => {
        state.admins = action?.payload?.users;
      })
      .addCase(createCircle.rejected, (state, action) => {
        state.admins = action?.payload;
      });
  },
});

export const createCircleData = (state) => state.CreateCirlce;

export default CreateCirlceSlice.reducer;
