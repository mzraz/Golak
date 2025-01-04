import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import DataTable from "../../../Components/DataGrid";
import Loader from "../../../Components/Loader";
import { Link } from "react-router-dom";
import {
  getUsersData,
  updateUserData,
} from "../../../Store/UsersData/UsersDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth, logout } from "../../../Store/AuthSlice/authSlice";
import Button from "@mui/material/Button";

const ITEM_HEIGHT = 48;
const UsersReport = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [usersData, setUsersData] = useState([]);

  const [circlesData, setCirclesData] = useState([]);

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
        filter: true,
        floatingFilter: true,
        flex: 1,
      },
      {
        headerName: "User Name",
        field: "username",
        sortable: true,
        filter: true,
        floatingFilter: true,
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
        filter: true,
        floatingFilter: true,
        flex: 1,
      },
      {
        headerName: "Phone Number",
        field: "phone",
        sortable: true,
        filter: true,
        floatingFilter: true,
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
      // {
      //   headerName: "Actions",
      //   sortable: false,
      //   filter: false,
      //   floatingFilter: false,
      //   flex: 1,
      //   cellRenderer: (params) => {
      //     const userData = params.data.id;

      //     return (
      //       <div className="flex flex-row ">
      //         <label className="switch flex flex-row justify-end items-center">
      //           <input
      //             type="checkbox"
      //             defaultChecked={params.data.statusId === 2}
      //             value={params.data.statusId === 2}
      //             onChange={(event) => handleStatusUpdate(event, params.data)}
      //           />
      //           <span
      //             className={`slider round w-[95px] slider-text ${
      //               params.data.statusId === 2
      //                 ? "flex flex-row justify-start items-center pl-3"
      //                 : "flex flex-row justify-end items-center pr-2"
      //             }`}
      //           >
      //             {params.data.statusId === 2 ? "active" : "deactive"}
      //           </span>
      //         </label>
      //         {/* <IconButton
      //           aria-label="more"
      //           id="long-button"
      //           className="dropdown"
      //           aria-controls={open ? "long-menu" : undefined}
      //           aria-expanded={open ? "true" : undefined}
      //           aria-haspopup="true"
      //           onClick={(event) => handleClick(event, userData)}
      //         >
      //           <MoreVertIcon />
      //         </IconButton> */}
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: "Status",
        field: "statusLabel",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },
    ],
    []
  );

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-row items-center justify-between mb-4">
        <h1 className="heading">All Users Data</h1>
        {/* <Button variant="contained">Download CSV</Button> */}
      </Box>
      <Box
        className="box-shadow"
        style={{
          background: "white",
        }}
      >
        {displayLoader ? <Loader /> : ""}
        <DataTable columnDefs={columnDefs} rowData={usersUpdatedData} />
      </Box>
    </div>
  );
};

export default UsersReport;
