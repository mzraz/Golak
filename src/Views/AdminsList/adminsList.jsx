import React, { useEffect, useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import DataTable from "../../Components/DataGrid";
import SearchBar from "../../Components/SearchBar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import {
  getAdminsData,
  updateAdminData,
} from "../../Store/AdminsData/AdminsDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
const ITEM_HEIGHT = 48;
const AdminsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [adminData, setAdminData] = useState({});
  const [usersData, setUsersData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchStr, setSearchStr] = useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event, data) => {
    setAnchorEl(event.currentTarget);
    setAdminData(data);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setDisplayLoader(true);

    dispatch(getAdminsData(userInfo.accessToken)).then((response) => {
      if (response.payload.errors === "Request failed with status code 403") {
        toast.error("Failed to fetch data.");
        setDisplayLoader(false);
      } else {
        const filterAdmins = response?.payload?.users.filter(
          (item) => item.role === "admin"
        );
        // setAdminData(filterAdmins);
        setUsersData(filterAdmins);
        setDisplayLoader(false);
      }
    });
  };

  const handleSearch = (event) => {
    const searchString = event.target.value;
    setSearchStr(searchString);
    if (searchString !== "") {
      const filterData = usersData?.filter((item) =>
        item?.firstName?.toLowerCase().includes(searchString.toLowerCase())
      );
      setSearchData([...filterData]);
    } else {
      setSearchData([]);
    }
  };
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Admin ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Admin Name",
        field: "firstName",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          const userData = params.data.firstName;

          return <Link to={`/update-admin/${params.data.id}`}>{userData}</Link>;
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
        field: "contactNo",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Role",
        field: "role",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Status",
        field: "statusLabel",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Actions",
        sortable: false,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => (
          <div className="flex flex-row ">
            <label className="switch">
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
              onClick={(event) => handleClick(event, params.data)}
            >
              <MoreVertIcon />
            </IconButton> */}
          </div>
        ),
      },
    ],
    [usersData]
  );
  const handleStatusUpdate = async (event, userData) => {
    setDisplayLoader(true);
    const isChecked = event.target.checked;
    try {
      if (isChecked) {
        dispatch(
          updateAdminData({
            role: "admin",
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
          updateAdminData({
            role: "admin",
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
  const handleNavigation = () => {
    navigate("/create-admin");
  };

  const handleSelectUser = () => {
    navigate(`/update-admin/${adminData?.id}`);
    handleClose();
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[160px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Admin Users
          </Link>
        </Box>
        <h1 className="heading">Admin Users</h1>
      </Box>
      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <Box className="flex flex-row w-full justify-between mb-4">
          <SearchBar onChange={(event) => handleSearch(event)} />
          <Box>
            <button
              variant="contained"
              className="dropdown"
              style={{
                background: "#4379EE",
                borderRadius: "7px",
                color: "white",
                padding: "8px 12px",
              }}
              onClick={handleNavigation}
            >
              Create an Admin
            </button>
          </Box>
        </Box>
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
          <MenuItem onClick={handleSelectUser}>{"Select User"}</MenuItem>
        </Menu>
        <DataTable
          columnDefs={columnDefs}
          rowData={searchStr === "" ? usersData : searchData}
        />
      </Box>
    </div>
  );
};

export default AdminsList;