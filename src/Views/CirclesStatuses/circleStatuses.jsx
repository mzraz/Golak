import React, { useEffect, useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import SearchBar from "../../Components/SearchBar";
import DataTable from "../../Components/DataGrid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getCirclesData,
  changeCircleStatus,
} from "../../Store/CirclesData/CirclesDataSlice";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import Modal from "../../Components/Modal";

const ITEM_HEIGHT = 48;
const CircleStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [displayLoader, setDisplayLoader] = useState(false);
  const open = Boolean(anchorEl);
  const [searchStr, setSearchStr] = useState("");
  const [circlesData, setCirclesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    text: "",
  });
  useEffect(() => {
    fetchCirclesData();
  }, []);

  const fetchCirclesData = async () => {
    setDisplayLoader(true);
    try {
      dispatch(getCirclesData(userInfo.accessToken)).then((response) => {
        if (Object.keys(response?.payload?.circles).length !== 0) {
          const filterCircles = response.payload.circles.filter(
            (item) => item.statusId === 1 || item.statusId === 3
          );
          setCirclesData(filterCircles);

          setDisplayLoader(false);
        }
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Circle ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "Circle Name",
        field: "name",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },

      {
        headerName: "Contribution Type",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          let data = "";
          if (params.data.contribType === 2) {
            data = "Weekly";
          } else if (params.data.contribType === 3) {
            data = "Bi-Weekly";
          } else if (params.data.contribType === 4) {
            data = "Monthly";
          } else {
            data = "Daily";
          }
          return <>{data}</>;
        },
      },
      {
        headerName: "Total Amount",
        field: "minContrib",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
      {
        headerName: "No. of People",
        field: "involvedUsers.length",
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
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 2,
        cellRenderer: (params) => {
          return (
            <td
              className={`flex flex-row ${
                params?.data?.statusId === 3
                  ? "justify-start"
                  : "justify-between"
              } items-center`}
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
                  width: "30%",
                }}
                onClick={() => handleOpenModal(params.data, "accept")}
              >
                Approve
              </button>
              {params.data.statusId !== 3 && (
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
          );
        },
      },
    ],
    []
  );

  const handleUpdate = (data, str) => {
    setDisplayLoader(true);
    try {
      if (str === "accept") {
        dispatch(
          changeCircleStatus({
            role: "circles",
            statusLabel: "active",
            statusId: 2,
            token: userInfo?.accessToken,
            id: data?.id,
          })
        ).then((response) => {
          fetchCirclesData();
          setDisplayLoader(false);
          toast.success("Circle has been approved.");
          setModalOpen(false);
        });
      } else if (str === "reject") {
        dispatch(
          changeCircleStatus({
            role: "circles",
            statusLabel: "rejected",
            statusId: 3,
            token: userInfo?.accessToken,
            id: data?.id,
          })
        ).then((response) => {
          fetchCirclesData();
          setDisplayLoader(false);
          toast.error("Circle has been rejected!");
          setModalOpen(false);
        });
        fetchCirclesData();
        setDisplayLoader(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpenModal = (data, str) => {
    if (str === "accept") {
      setModalData({
        ...modalData,
        text: "Are you sure you want to approve this Circle?",
        clickAction: () => handleUpdate(data, str),
      });
    } else {
      setModalData({
        ...modalData,
        text: "Are you sure you want to reject the Circle?",
        clickAction: () => handleUpdate(data, str),
      });
    }

    setModalOpen(true);
  };

  const handleNavigation = (data) => {
    navigate(`/circle-dashboard/${data?.id}`);
  };
  const [searchData, setSearchData] = useState([]);

  const handleSearch = (event) => {
    const searchString = event.target.value;
    setSearchStr(searchString);
    if (searchString !== "") {
      const filterData = circlesData.filter((item) =>
        item.name.toLowerCase().includes(searchString.toLowerCase())
      );
      setSearchData([...filterData]);
    } else {
      setSearchData([]);
    }
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
            Circle Status
          </Link>
        </Box>
        <h1 className="heading">Circles Pending Approval</h1>
      </Box>
      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <Box className="flex flex-row w-full justify-between mb-4">
          <SearchBar onChange={(event) => handleSearch(event)} />
        </Box>

        <DataTable
          columnDefs={columnDefs}
          rowData={searchStr === "" ? circlesData : searchData}
        />
      </Box>
    </div>
  );
};

export default CircleStatus;
