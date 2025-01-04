import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import DataTable from "../../../Components/DataGrid";
import Loader from "../../../Components/Loader";
import { Link } from "react-router-dom";
import { getUsersData } from "../../../Store/UsersData/UsersDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth, logout } from "../../../Store/AuthSlice/authSlice";
import Button from "@mui/material/Button";
const InactiveUsersReport = () => {
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
          (item) => item.role === "user" && item.statusLabel !== "active"
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
        <h1 className="heading">Inactive Users Data</h1>
        {/* <Button variant="contained" className="dropdown">
          Download CSV
        </Button> */}
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

export default InactiveUsersReport;
