import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import Profile from "../../Assets/Images/profile.jpg";
import { useSelector } from "react-redux";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import { useDispatch } from "react-redux";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { userDataUpdate } from "../../Store/AuthSlice/authSlice";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { TbCameraUp } from "react-icons/tb";
import {
  userprofileData,
  userPasswordChange,
} from "../../Store/ProfileSlice/ProfileSlice";
import { BASE_URL } from "../../Utils/client_config";
const ProfileData = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [imageUploadData, setImageUpload] = useState();
  const [displayImage, setdisplayImage] = useState();
  const [updatePass, setUpdatePass] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    showOldPassword: false,
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [editData, setEditData] = useState({
    firstName: userInfo.user.firstName,
    lastName: userInfo.user.lastName,
    phone: userInfo?.user?.phone,
    role: userInfo.user.role,
    email: userInfo.user.email,
    id: userInfo.user.id,
    img: userInfo.user.img,
  });

  const [adminErrors, setAdminErrors] = useState({
    firstName: "",
    phone: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    setEditData({
      ...editData,
      [name]: trimmedValue,
    });
  };

  const imageUpload = (event) => {
    const imageData = event.target.files[0];
    setImageUpload(imageData);
    if (imageData) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setdisplayImage(event.target.result);
      };
      reader.readAsDataURL(imageData);
    }
  };

  const handleChangePass = (event) => {
    const { name, value } = event.target;
    const trimmedValue = value.trim();
    setUpdatePass({
      ...updatePass,
      [name]: trimmedValue,
    });
  };

  const handleSubmit = () => {
    let passErrors = {
      firstName: "",
      phone: "",
    };
    if (!editData.firstName) {
      passErrors = {
        ...passErrors,
        firstName: "Firstname cannot be empty!",
      };
    } else if (
      editData.firstName.length < 3 ||
      editData.firstName.length > 32
    ) {
      passErrors = {
        ...passErrors,
        firstName: "FirstName must be between 3 and 32 characters long.",
      };
    } else {
      passErrors = {
        ...passErrors,
        firstName: "",
      };
    }
    if (!editData.phone) {
      passErrors = {
        ...passErrors,
        phone: "Contact Number must not be empty!",
      };
    } else if (editData.phone.length < 10 || editData.phone.length > 16) {
      passErrors = {
        ...passErrors,
        phone: "Contact number must be between 10 and 16 characters long.",
      };
    } else {
      passErrors = {
        ...passErrors,
        phone: "",
      };
    }

    setAdminErrors(passErrors);

    if (passErrors.phone === "" && passErrors.firstName === "") {
      setDisplayLoader(true);
      try {
        dispatch(
          userprofileData({
            ...editData,
            img: imageUploadData,
            token: userInfo.accessToken,
          })
        ).then((response) => {
          if (Object.keys(response).length !== 0) {
            dispatch(userDataUpdate(response));
            setDisplayLoader(false);
            toast.success(
              `${
                response.role === "superadmin" ? "Superadmin" : "Admin"
              } information has been updated.`,
              {
                className: "toast-center",
              }
            );
          }
        });
      } catch (error) {
        setDisplayLoader(false);

        console.error("Error fetching users:", error);
      }
    }
  };

  const handleUpdatePassword = () => {
    let passErrors = {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    };
    if (!updatePass.password) {
      passErrors = {
        ...passErrors,
        password: "Password must be at least 8 characters long",
      };
    } else {
      passErrors = {
        ...passErrors,
        password: "",
      };
    }

    if (!updatePass.oldPassword) {
      passErrors = {
        ...passErrors,
        oldPassword: "Password must be at least 8 characters long",
      };
    } else {
      passErrors = {
        ...passErrors,
        oldPassword: "",
      };
    }

    if (updatePass.password !== updatePass.confirmPassword) {
      passErrors = {
        ...passErrors,
        confirmPassword: "Password does not match.",
      };
    } else {
      passErrors = {
        ...passErrors,
        confirmPassword: "",
      };
    }

    setErrors(passErrors);

    if (
      passErrors.confirmPassword === "" &&
      passErrors.password === "" &&
      passErrors.oldPassword === ""
    ) {
      setDisplayLoader(true);
      dispatch(
        userPasswordChange({
          ...updatePass,
          token: userInfo?.accessToken,
          id: userInfo?.user?.id,
        })
      ).then((response) => {
        if (response.payload.status === "Old Password Mismatch") {
          toast.error("Old Password does not match.");
          setDisplayLoader(false);
        } else if (response.payload.status === "Success") {
          setUpdatePass({
            oldPassword: "",
            password: "",
            confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
            showOldPassword: false,
          });
          toast.success("Password has been updated.");
          setDisplayLoader(false);
        } else {
          toast.error(
            "There has been some error updating this password. Please try again later."
          );
          setDisplayLoader(false);
        }
      });
    }
  };
  return (
    <>
      <div className="p-10 body-padding">
        <h1 className="heading">My Profile</h1>
        <Box className="box-shadow">
          {displayLoader ? <Loader /> : ""}
          <Toaster />
          <Box
            className="w-full"
            style={{
              borderBottom: "1px solid #F1F1F1",
            }}
          >
            {" "}
            <h1
              className="heading"
              style={{
                width: "182px",
                color: "#3E97FF",
                borderBottom: "1px solid #3E97FF",
              }}
            >
              Account Details
            </h1>
            <Box className="w-full flex flex-col  items-center border-box ">
              <Box className="w-25  h-80 flex flex-col justify-center items-center mt-4 border-box">
                <div className="container">
                  <img
                    src={
                      displayImage
                        ? displayImage
                        : userInfo?.user?.img
                        ? `${BASE_URL}${userInfo?.user?.img}`
                        : Profile
                    }
                    alt="Avatar"
                    className="image"
                    style={{
                      height: "95px",
                      width: "110px",
                    }}
                  />
                  <div className="middle">
                    <label htmlFor="upload-photo">
                      <input
                        style={{ display: "none" }}
                        id="upload-photo"
                        name="upload-photo"
                        type="file"
                        onChange={(event) => imageUpload(event)}
                      />
                      <Button component="span">
                        <TbCameraUp size={30} color="#76D0B7" />
                      </Button>
                    </label>
                  </div>
                </div>
                <p className="text-center mt-3">Allowed *.jpeg, *.jpg, *.png</p>
              </Box>
              <Box className="w-full h-60 flex flex-col  mt-4  ml-3 mb-4">
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="First Name*"
                    variant="outlined"
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={editData.firstName}
                    error={!!adminErrors.firstName}
                    helperText={adminErrors.firstName}
                    onChange={(e) => handleChange(e)}
                  ></TextField>
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={editData.lastName}
                    onChange={(e) => handleChange(e)}
                  ></TextField>
                </Box>
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    type="text"
                    name="email"
                    placeholder="Email"
                    disabled
                    value={editData.email}
                  ></TextField>
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="Phone Number*"
                    variant="outlined"
                    type="number"
                    name="phone"
                    placeholder="Phone Number"
                    error={!!adminErrors.phone}
                    helperText={adminErrors.phone}
                    value={editData.phone}
                    onChange={(e) => handleChange(e)}
                  ></TextField>
                </Box>
              </Box>
            </Box>
            <Box className=" flex flex-row justify-end items-end  p-5">
              <Button
                variant="contained"
                sx={{
                  background: "#3E97FF",
                  color: "white",
                }}
                //   disabled={!user}
                className="dropdown w-full"
                onClick={() => handleSubmit()}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>

        <Box className="box-shadow mt-5">
          <Box
            className="w-full"
            style={{
              borderBottom: "1px solid #F1F1F1",
            }}
          >
            {" "}
            <h1
              className="heading"
              style={{
                width: "204px",
                color: "#3E97FF",
                borderBottom: "1px solid #3E97FF",
              }}
            >
              Update Password
            </h1>
            <Box className="w-full flex flex-col  items-center border-box ">
              <Box className="w-full h-90 flex flex-col  mt-4  ml-3 mb-4">
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-full mr-3"
                    id="outlined-basic"
                    label="Old Password*"
                    variant="outlined"
                    type={updatePass.showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Old Password"
                    value={updatePass.oldPassword}
                    onChange={(event) => handleChangePass(event)}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setUpdatePass((prevState) => ({
                                ...prevState,
                                showOldPassword: !prevState.showOldPassword,
                              }))
                            }
                            className="dropdown"
                            edge="end"
                          >
                            {updatePass.showOldPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Box>
                <Box className="flex flex-row justify-between m-4">
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="New Password*"
                    variant="outlined"
                    type={updatePass.showPassword ? "text" : "password"}
                    name="password"
                    placeholder="New Password*"
                    value={updatePass.password}
                    onChange={(event) => handleChangePass(event)}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setUpdatePass((prevState) => ({
                                ...prevState,
                                showPassword: !prevState.showPassword,
                              }))
                            }
                            className="dropdown"
                            edge="end"
                          >
                            {updatePass.showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                  <TextField
                    className="w-50p mr-3"
                    id="outlined-basic"
                    label="Confirm Password"
                    variant="outlined"
                    type={updatePass.showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={updatePass.confirmPassword}
                    onChange={(event) => handleChangePass(event)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setUpdatePass((prevState) => ({
                                ...prevState,
                                showConfirmPassword:
                                  !prevState.showConfirmPassword,
                              }))
                            }
                            className="dropdown"
                            edge="end"
                          >
                            {updatePass.showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box className=" flex flex-row justify-end items-end  p-5">
                  <Button
                    variant="contained"
                    sx={{
                      background: "#3E97FF",
                      color: "white",
                    }}
                    // disabled={!user}
                    className="dropdown w-full "
                    onClick={() => handleUpdatePassword()}
                  >
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default ProfileData;
