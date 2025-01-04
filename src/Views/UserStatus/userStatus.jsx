import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import SearchBar from "../../Components/SearchBar";
import DataTable from "../../Components/DataGrid";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import Modal from "../../Components/Modal";
import {
  getUsersData,
  updateUserData,
} from "../../Store/UsersData/UsersDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
const UserStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(initialAuth);
  const [usersData, setUsersData] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [circlesData, setCirclesData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    text: "",
  });
  useEffect(() => {
    fetchUsersData();
  }, []);
  const fetchUsersData = async () => {
    setDisplayLoader(true);
    dispatch(getUsersData(user.accessToken)).then((response) => {
      const filterUsers = response?.payload?.users.filter(
        (item) =>
          item.role === "user" && (item.statusId === 1 || item.statusId === 3)
      );
      setUsersData(filterUsers);
      setDisplayLoader(false);
    });
  };

  const handleNavigation = (params) => {
    navigate(`/user-detail/${params?.id}`);
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
        headerName: "Status",
        field: "statusLabel",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      // {
      //   headerName: "Circles",
      //   sortable: false,
      //   filter: false,
      //   floatingFilter: false,
      //   flex: 1,
      //   cellRenderer: (params) => {
      //     let circleLength = params.data.circles.length;
      //     let circleVar = "";
      //     if (circleLength === 0) {
      //       circleVar = "No Circle";
      //     } else if (circleLength === 1) {
      //       circleVar = params.data.circles[0].name;
      //     } else {
      //       circleVar = "multiple";
      //     }
      //     return <div className="">{circleVar}</div>;
      //   },
      // },
      {
        headerName: "Actions",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 2,
        cellRenderer: (params) => (
          <td
            className={`flex flex-row ${
              params.data.statusId === 3 ? "justify-start" : "justify-between"
            }  items-center `}
          >
            <button
              className="btn-table-style flex justify-center items-center"
              style={{
                background: "#E8EAF6",
                color: "#3749A6",
                border: "1px Solid #3749A6",
                borderRadius: "30px",
                height: "30px",
                width: "30%",
              }}
              onClick={() => handleNavigation(params.data)}
            >
              View
            </button>
            <button
              className="btn-table-style flex justify-center items-center"
              style={{
                background: "#E8F5E9",
                color: "#00820A",
                border: "1px Solid #00820A",
                borderRadius: "30px",
                height: "30px",
                width: "90px",
              }}
              onClick={() => handleOpenModal(params.data, "accept")}
              //
            >
              Approve
            </button>
            {params.data.statusId === 3 ? (
              ""
            ) : (
              <button
                className="btn-table-style flex justify-center items-center"
                style={{
                  background: "#FF00001A",
                  color: "#FF0000",
                  border: "1px Solid #FF0000",
                  borderRadius: "30px",
                  height: "30px",
                  width: "30%",
                }}
                onClick={() => handleOpenModal(params.data, "reject")}
              >
                Reject
              </button>
            )}
          </td>
        ),
      },
    ],
    []
  );

  const handleSearch = (event) => {
    const searchString = event.target.value;
    if (searchString !== "") {
      const filterData = usersUpdatedData?.filter((item) =>
        item?.username?.toLowerCase().includes(searchString.toLowerCase())
      );
      setSearchData([...filterData]);
    } else {
      setSearchData([]);
    }
  };

  const handleUpdate = (data, str) => {
    setDisplayLoader(true);

    console.log(data, str);
    try {
      if (str === "accept") {
        dispatch(
          updateUserData({
            role: "user",
            statusLabel: "active",
            statusId: 2,
            token: user?.accessToken,
            id: data?.id,
          })
        ).then((response) => {
          fetchUsersData();
          setDisplayLoader(false);
          toast.success("User has been approved.");
          setModalOpen(false);
        });
      } else if (str === "reject") {
        dispatch(
          updateUserData({
            role: "user",
            statusLabel: "rejected",
            statusId: 3,
            token: user?.accessToken,
            id: data?.id,
          })
        ).then((response) => {
          fetchUsersData();
          setDisplayLoader(false);
          toast.error("User has been rejected!");
          setModalOpen(false);
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpenModal = (data, str) => {
    if (str === "accept") {
      console.log(data, str);
      setModalData({
        ...modalData,
        text: "Are you sure you want to approve the User?",
        clickAction: () => handleUpdate(data, str),
      });
    } else {
      setModalData({
        ...modalData,
        text: "Are you sure you want to reject the User?",
        clickAction: () => handleUpdate(data, str),
      });
    }

    setModalOpen(true);
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          {...modalData}
        />
        <Box className="breadcrumbs flex flex-row justify-between w-[160px] mb-4 items-center">
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Users Status
          </Link>
        </Box>
        <h1 className="heading">Users Pending Approval</h1>
      </Box>
      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <Box className="flex flex-row w-full justify-between mb-4">
          <SearchBar onChange={(event) => handleSearch(event)} />
        </Box>

        <DataTable
          columnDefs={columnDefs}
          rowData={searchData.length === 0 ? usersUpdatedData : searchData}
        />
      </Box>
    </div>
  );
};

export default UserStatus;
