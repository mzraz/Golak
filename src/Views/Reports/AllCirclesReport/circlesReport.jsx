import React, { useEffect, useState, useMemo } from "react";
import { Box, Button } from "@mui/material";
import DataTable from "../../../Components/DataGrid";
import Loader from "../../../Components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getCirclesData } from "../../../Store/CirclesData/CirclesDataSlice";
import { initialAuth } from "../../../Store/AuthSlice/authSlice";

const CirclesReport = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);

  const [displayLoader, setDisplayLoader] = useState(false);
  const [circlesData, setCirclesData] = useState([]);

  useEffect(() => {
    fetchCirclesData();
  }, []);

  const fetchCirclesData = async () => {
    setDisplayLoader(true);
    try {
      dispatch(getCirclesData(userInfo.accessToken)).then((response) => {
        if (Object.keys(response?.payload?.circles).length !== 0) {
          const filterCircles = response.payload.circles.filter(
            (item) => item.statusId === 2
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
        filter: true,
        floatingFilter: true,
        flex: 1,
      },
      {
        headerName: "Circle Name",
        field: "name",
        sortable: true,
        filter: true,
        floatingFilter: true,
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
        filter: true,
        floatingFilter: true,
        flex: 1,
      },
      {
        headerName: "No. of People",
        field: "involvedUsers.length",
        sortable: true,
        filter: true,
        floatingFilter: true,
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
    ],
    []
  );

  const [searchData, setSearchData] = useState([]);

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-row items-center justify-between mb-4">
        <h1 className="heading">Circles Report</h1>
        {/* <Button variant="contained" className="dropdown">
          Download CSV
        </Button> */}
      </Box>
      <Box className="box-shadow">
        {displayLoader ? <Loader /> : ""}
        <DataTable columnDefs={columnDefs} rowData={circlesData} />
      </Box>
    </div>
  );
};

export default CirclesReport;
