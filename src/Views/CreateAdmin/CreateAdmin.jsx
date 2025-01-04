import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FaImage } from "react-icons/fa6";
import { Box, Button, TextField, Checkbox } from "@mui/material";
import Profile from "../../Assets/Images/profile.jpg";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import {
  getadminData,
  updateAdminDetail,
  createAdminDetail,
} from "../../Store/UpdateAdminData/UpdateAdminData";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import { BASE_URL } from "../../Utils/client_config";

const CreateAdmins = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [imageUploadData, setImageUpload] = useState();
  const [displayImage, setdisplayImage] = useState();
  const [displayLoader, setDisplayLoader] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "admin",
    email: "",
    password: "",
    id: "",
    isListofUsers: false,
    isApprove: false,
    isAdminCreated: false,
    isActive: false,
    isCircleCreate: false,
    isMembersAdd: false,
    isCirclesDelete: false,
    isPaymentChange: false,
    isDashboard: false,
    isReports: false,
    img: "",
    isAdminActive: false,
    statusId: 1,
    statusLabel: "pending",
  });
  const [updatePass, setUpdatePass] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setDisplayLoader(true);
      try {
        // const findUser = usersData.find((item) => item.id === id);
        dispatch(
          getadminData({
            token: userInfo.accessToken,
            id: id,
          })
        )
          .then((response) => {
            const findUser = response.payload;
            // setdisplayImage(findUser?.img);
            setData({ ...findUser });
            setDisplayLoader(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (id !== undefined && id !== null && id !== "") {
      fetchData();
    }
  }, []);

  const handleSubmit = async () => {
    const { firstName, lastName, phone, email, password } = data;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const newErrors = {};
    if (!firstName) {
      newErrors.firstName = "Please enter your first name.";
    }
    if (!lastName) {
      newErrors.lastName = "Please enter your last name.";
    }
    if (!phone) {
      newErrors.phone = "Please enter your phone number.";
    }
    if (!email) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password field must not be empty";
    } else if (!passwordPattern.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setDisplayLoader(true);
      try {
        dispatch(
          createAdminDetail({
            ...data,
            img: imageUploadData,
            token: userInfo.accessToken,
          })
        ).then((response) => {
          const userResponse = response.payload;
          if (Object.keys(userResponse).length !== 0) {
            setData({
              firstName: "",
              lastName: "",
              phone: "",
              role: "admin",
              email: "",
              password: "",
              id: "",
              isListofUsers: false,
              isApprove: false,
              isAdminCreated: false,
              isActive: false,
              isCircleCreate: false,
              isMembersAdd: false,
              isCirclesDelete: false,
              isPaymentChange: false,
              isDashboard: false,
              img: "",
              isAdminActive: false,
              isReports: false,
              statusId: 1,
              statusLabel: "pending",
            });
            setdisplayImage();
            setDisplayLoader(false);
            toast.success("New Admin has been created.");
          }
        });
      } catch (error) {
        setDisplayLoader(true);
        toast.error(
          "Authentication email already in use. Please use a unique gmail account."
        );
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    setData({
      ...data,
      [name]: trimmedValue,
    });
  };

  const handleChecked = (event) => {
    if (event.target.checked === true) {
      setData({
        ...data,
        [event.target.name]: true,
      });
    } else {
      setData({
        ...data,
        [event.target.name]: false,
      });
    }
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

  const handleUpdate = () => {
    const { firstName, lastName, phone, email, password } = data;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const newErrors = {};
    if (!firstName) {
      newErrors.firstName = "Please enter your first name.";
    }
    if (!lastName) {
      newErrors.lastName = "Please enter your last name.";
    }
    if (!phone) {
      newErrors.phone = "Please enter your phone number.";
    }
    if (!email) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password field must not be empty";
    } else if (!passwordPattern.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setDisplayLoader(true);
      try {
        dispatch(
          updateAdminDetail({
            ...data,
            img: imageUploadData,
            token: userInfo.accessToken,
          })
        ).then((response) => {
          const apiResponse = response.payload;
          if (Object.keys(apiResponse).length !== 0) {
            setData({
              firstName: "",
              lastName: "",
              phone: "",
              role: "admin",
              email: "",
              password: "",
              id: "",
              isListofUsers: false,
              isApprove: false,
              isAdminCreated: false,
              isActive: false,
              isCircleCreate: false,
              isMembersAdd: false,
              isCirclesDelete: false,
              isPaymentChange: false,
              isDashboard: false,
              img: "",
              isAdminActive: false,
              isReports: false,
            });
            setDisplayLoader(false);
            toast.success("Admin account information has been updated.");
            navigate("/create-admin");
          }
        });
      } catch (error) {
        setDisplayLoader(true);

        console.error("Error fetching users:", error);
      }
    }
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[250px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"/admins-list"} className="breadcrumbs">
            Admin Users
          </Link>
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Admin Detail
          </Link>
        </Box>
        <h1 className="heading">Admin Users</h1>
      </Box>
      <Toaster />
      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <Box
          className="w-full"
          style={{
            borderBottom: "1px solid #F1F1F1",
          }}
        >
          {" "}
          <h1
            className="w-50 heading"
            style={{
              color: "#3E97FF",
              textDecoration: "underline",
            }}
          >
            {id ? "Update Admin Details" : "Create New Admin"}
          </h1>
        </Box>
        <Box className="w-full flex flex-row">
          <Box className="w-25  h-96 flex flex-col justify-center items-center mt-4 border-box">
            <div className="container">
              <img
                src={
                  displayImage
                    ? displayImage
                    : data?.img
                    ? `${BASE_URL}${data?.img}`
                    : Profile
                }
                alt="Profile"
                className="image"
                style={{
                  width: "140px",
                  height: "110px",
                }}
              />
              <div className="middle">
                <label htmlFor="upload-photo">
                  <input
                    style={{ display: "none" }}
                    id="upload-photo"
                    name="upload-photo"
                    onChange={(event) => imageUpload(event)}
                    type="file"
                  />
                  <Button component="span">
                    <FaImage size={20} color="#76D0B7" />
                  </Button>
                </label>
              </div>
            </div>
            <p className="text-center mt-3">Allowed *.jpeg, *.jpg, *.png</p>
          </Box>
          <Box className="w-75 h-96 flex flex-col  mt-4 border-box ml-3 items-stretch justify-between">
            <Box className="flex flex-row justify-between m-4">
              <TextField
                className="w-50p mr-3"
                id="outlined-basic"
                label="First Name*"
                variant="outlined"
                type="text"
                placeholder="First Name"
                name="firstName"
                value={data.firstName}
                error={!!errors.firstName}
                helperText={errors.firstName}
                onChange={(e) => handleChange(e)}
              ></TextField>
              <TextField
                className="w-50p mr-3"
                id="outlined-basic"
                label="Last Name*"
                variant="outlined"
                type="text"
                name="lastName"
                placeholder="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName}
                value={data.lastName}
                onChange={(e) => handleChange(e)}
              ></TextField>
            </Box>
            <Box className="flex flex-row justify-between m-4">
              <TextField
                className="w-50p mr-3"
                id="outlined-basic"
                label="Email*"
                variant="outlined"
                type="text"
                name="email"
                placeholder="Email"
                value={data.email}
                error={!!errors.email}
                helperText={errors.email}
                onChange={(e) => handleChange(e)}
              ></TextField>
              <TextField
                className="w-50p mr-3"
                id="outlined-basic"
                label="Contact Number*"
                variant="outlined"
                type="number"
                name="phone"
                placeholder="Contact Number"
                value={data.phone}
                error={!!errors.phone}
                helperText={errors.phone}
                onChange={(e) => handleChange(e)}
              ></TextField>
            </Box>
            <Box className="flex flex-row justify-between m-4">
              <TextField
                className="w-50p mr-3"
                id="outlined-basic"
                label="Password*"
                variant="outlined"
                type={updatePass ? "text" : "password"}
                name="password"
                placeholder="Password"
                error={!!errors.password}
                helperText={errors.password}
                value={id !== undefined ? "" : data.password}
                disabled={id}
                onChange={(e) => handleChange(e)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          if (updatePass === true) {
                            setUpdatePass(false);
                          } else {
                            setUpdatePass(true);
                          }
                        }}
                        className="dropdown"
                        edge="end"
                      >
                        {updatePass ? (
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
                label="Role"
                variant="outlined"
                type="text"
                name="contactNo"
                placeholder="Last Name"
                value={data.role}
                disabled
                onChange={(e) => handleChange(e)}
              ></TextField>
            </Box>
          </Box>
        </Box>
        <Box
          className="w-full mt-3"
          style={{
            borderBottom: "1px solid #F1F1F1",
          }}
        >
          {" "}
          <h1
            className="w-25 heading"
            style={{
              color: "#3E97FF",
              textDecoration: "underline",
            }}
          >
            Rights & Permissions
          </h1>
        </Box>
        <Box className="w-full flex flex-row justify-between p-4">
          <Box className="flex flex-col justify-start items-start">
            <h3 className="ag-header-cell-text">User Management</h3>
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isListofUsers"
                checked={data.isListofUsers}
              />
              <p>List of Users</p>
            </Box>{" "}
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isApprove"
                checked={data.isApprove}
              />
              <p>Approval & Rejections</p>
            </Box>{" "}
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isAdminCreated"
                checked={data.isAdminCreated}
              />
              <p>Create Admin</p>
            </Box>{" "}
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isActive"
                checked={data.isActive}
              />
              <p>Active/Deactivate</p>
            </Box>
          </Box>
          <Box className="flex flex-col justify-start items-start">
            {" "}
            <h3 className="ag-header-cell-text">Circles Management</h3>
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isCircleCreate"
                checked={data.isCircleCreate}
              />
              <p>Create New Circles</p>
            </Box>{" "}
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isMembersAdd"
                checked={data.isMembersAdd}
              />
              <p>Add Members</p>
            </Box>{" "}
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isCirclesDelete"
                checked={data.isCirclesDelete}
              />
              <p>Delete Circles</p>
            </Box>{" "}
          </Box>
          <Box className="flex flex-col justify-start items-start">
            {" "}
            <h3 className="ag-header-cell-text">Payments</h3>
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isPaymentChange"
                checked={data.isPaymentChange}
              />
              <p>Change Payment Status</p>
            </Box>{" "}
          </Box>
          <Box className="flex flex-col justify-start items-start">
            {" "}
            <h3 className="ag-header-cell-text">Analytics</h3>
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isDashboard"
                checked={data.isDashboard}
              />
              <p>Dashboard</p>
            </Box>{" "}
            <Box className="flex flex-row items-center">
              <Checkbox
                onChange={(e) => handleChecked(e)}
                name="isDashboard"
                checked={data.isReports}
              />
              <p>Reports</p>
            </Box>
          </Box>
        </Box>
        <Box className="flex flex-row justify-end items-end">
          <Button
            variant="contained"
            sx={{
              background: "#3E97FF",
              color: "white",
            }}
            className="dropdown"
            onClick={() => {
              if (id !== undefined && id !== null && id !== "") {
                handleUpdate();
              } else {
                handleSubmit();
              }
            }}
          >
            {id !== undefined && id !== null && id !== ""
              ? "Update Changes"
              : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default CreateAdmins;