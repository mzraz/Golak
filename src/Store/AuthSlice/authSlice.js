import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Utils/Api";

const initialState = {
  loading: false,
  isLogged: false,
  accessToken: "",
  user: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, thunkAPI) => {
    try {
      const response = await Api.post("/login", data);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        statusCode: err?.code,
        errors: err?.message,
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.isLogged = false;
      state.accessToken = "";
      state.user = null;
    },
    userDataUpdate: (state, action) => {
      state.user = action?.payload?.payload?.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLogged = true;
        state.accessToken = action.payload.token;
        state.user = action.payload.userData;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLogged = false;
      });
  },
});

export const { logout, userDataUpdate } = authSlice.actions;

export const initialAuth = (state) => state.auth;

export default authSlice.reducer;
