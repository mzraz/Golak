import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/authSlice";
import dashboardReducer from "./Dashboard/Dashboard";
import ForgetPasswordReducer from "./ResetPassword/ForgetPasswordSlice";
import UsersDataReducer from "./UsersData/UsersDataSlice";
import AdminsDataSlice from "./AdminsData/AdminsDataSlice";
import CirclesDataSlice from "./CirclesData/CirclesDataSlice";
import UpdateUserDataSlice from "./UpdateUserData/UpdateUserDataSlice";
import UpdateAdminData from "./UpdateAdminData/UpdateAdminData";
import ProfileSlice from "./ProfileSlice/ProfileSlice";
import CreateCircleSlice from "./CreateCircle/CreateCircleSlice";
import CircleDashboardSlice from "./CircleDashboardData/CircleDashboardSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  forgetPassword: ForgetPasswordReducer,
  usersData: UsersDataReducer,
  adminsData: AdminsDataSlice,
  circlesData: CirclesDataSlice,
  updateUserData: UpdateUserDataSlice,
  updateAdminData: UpdateAdminData,
  profileSlice: ProfileSlice,
  createCircle: CreateCircleSlice,
  circleDashboard: CircleDashboardSlice,
});

export default rootReducer;
