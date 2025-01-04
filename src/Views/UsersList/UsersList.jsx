import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import DataTable from "../../Components/DataGrid";
import SearchBar from "../../Components/SearchBar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import {
  getUsersData,
  updateUserData,
} from "../../Store/UsersData/UsersDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth, logout } from "../../Store/AuthSlice/authSlice";

const ITEM_HEIGHT = 48;
const UsersList = () => {
  const dispatch = useDispatch();

  const userInfo = useSelector(initialAuth);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [propUserData, setPropData] = useState({});
  const [circlesData, setCirclesData] = useState([]);
  const [searchStr, setSearchStr] = useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event, userData) => {
    setAnchorEl(event.currentTarget);
    setPropData(userData);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDisplayLoader(true);
    dispatch(getUsersData(userInfo.accessToken)).then((response) => {
      const data = response.payload;
      if (data?.errors === "JWT token has expired") {
        dispatch(logout());
        setDisplayLoader(false);
      } else {
        const filterUsers = response?.payload?.users.filter(
          (item) => item.role === "user"
        );
        setUsersData(filterUsers);
        setDisplayLoader(false);
      }
    });
  };

  var usersUpdatedData = [];
  if (usersData.length !== 0) {
    for (let i = 0; i < usersData.length; i++) {
      const findCircles = circlesData.filter((item) =>
        item.involvedUsers.includes(usersData[i].id)
      );
      let updatedUser = {
        ...usersData[i],
        circles: findCircles,
      };
      usersUpdatedData.push(updatedUser);
    }
  }

  const columnDefs = useMemo(
    () => [
      {
        headerName: "User ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "User Name",
        field: "username",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          const userData = params.data.username;

          return <Link to={`/user-detail/${params.data.id}`}>{userData}</Link>;
        },
      },
      {
        headerName: "Email",
        field: "email",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Phone Number",
        field: "phone",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Circles",
        sortable: false,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          let circleLength = params.data.circles.length;
          let circleVar = "";
          if (circleLength === 0) {
            circleVar = "No Circle";
          } else if (circleLength === 1) {
            circleVar = params.data.circles[0].name;
          } else {
            circleVar = "multiple";
          }
          return <div className="">{circleVar}</div>;
        },
      },
      {
        headerName: "Actions",
        sortable: false,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          const userData = params.data.id;

          return (
            <div className="flex flex-row ">
              <label className="switch flex flex-row justify-end items-center">
                <input
                  type="checkbox"
                  defaultChecked={params.data.statusId === 2}
                  value={params.data.statusId === 2}
                  onChange={(event) => handleStatusUpdate(event, params.data)}
                />
                <span
                  className={`slider round w-[95px] slider-text ${
                    params.data.statusId === 2
                      ? "flex flex-row justify-start items-center pl-3"
                      : "flex flex-row justify-end items-center pr-2"
                  }`}
                >
                  {params.data.statusId === 2 ? "active" : "deactive"}
                </span>
              </label>
              {/* <IconButton
                aria-label="more"
                id="long-button"
                className="dropdown"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={(event) => handleClick(event, userData)}
              >
                <MoreVertIcon />
              </IconButton> */}
            </div>
          );
        },
      },
    ],
    []
  );

  const handleStatusUpdate = async (event, userData) => {
    setDisplayLoader(true);
    const isChecked = event.target.checked;
    try {
      if (isChecked) {
        dispatch(
          updateUserData({
            role: "user",
            statusLabel: "active",
            statusId: 2,
            token: userInfo.accessToken,
            id: userData.id,
          })
        ).then((response) => {
          fetchData();
          setDisplayLoader(false);
          toast.success("User has been activated.");
        });
      } else {
        dispatch(
          updateUserData({
            role: "user",
            statusLabel: "rejected",
            statusId: 3,
            token: userInfo.accessToken,
            id: userData.id,
          })
        ).then((response) => {
          fetchData();
          setDisplayLoader(false);
          toast.error("User has been deactivated!");
        });
      }
      fetchData();
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setDisplayLoader(false);
    }
  };

  const handleSearch = (event) => {
    const searchString = event.target.value;
    setSearchStr(searchString);
    if (searchString !== "") {
      const filterData = usersUpdatedData?.filter((item) =>
        item?.username?.toLowerCase().includes(searchString.toLowerCase())
      );
      setSearchData([...filterData]);
    } else {
      setSearchData([]);
    }
  };

  const handleNavigate = () => {
    navigate(`/user-detail/${propUserData}`);
    handleClose();
  };

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[160px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={14} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            App Users
          </Link>
        </Box>
        <h1 className="heading">App Users</h1>
      </Box>
      <Box
        className="box-shadow"
        style={{
          background: "white",
        }}
      >
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <SearchBar onChange={(event) => handleSearch(event)} />
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem onClick={handleNavigate}>{"Select User"}</MenuItem>
        </Menu>
        <DataTable
          columnDefs={columnDefs}
          rowData={searchStr === "" ? usersUpdatedData : searchData}
        />
      </Box>
    </div>
  );
};

export default UsersList;