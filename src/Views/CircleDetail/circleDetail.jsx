import { Box, Button } from "@mui/material";
import activeUsers from "../../Assets/Images/detail1.png";
import totalPayments from "../../Assets/Images/detail3.png";
import totalPayouts from "../../Assets/Images/detail4.png";
import amountCollected from "../../Assets/Images/detail2.png";
import { MdOutlineHome } from "react-icons/md";
import Chart from "react-apexcharts";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaGreaterThan } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import { getCircleDashboardData } from "../../Store/CircleDashboardData/CircleDashboardSlice";
const CircleDetail = () => {
  const { id } = useParams();
  const userInfo = useSelector(initialAuth);
  const dispatch = useDispatch();
  const [usersData, setUsersData] = useState([]);
  const [circlesData, setCirclesData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [roundsData, setRoundsData] = useState([]);
  const [payoutsData, setPayoutsData] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [circleDashboardData, setCircleDashboardData] = useState();

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      rowHeight: 36,
    };
  }, []);
  useEffect(() => {
    if (id !== "") {
      setDisplayLoader(true);
      dispatch(
        getCircleDashboardData({
          id: id,
          token: userInfo.accessToken,
        })
      ).then((response) => {
        if (response?.payload?.statusCode !== "ERR_BAD_REQUEST") {
          const circleData = response.payload.circle;
          setUsersData(circleData.circleUsers);
          setCircleDashboardData(circleData);
          setDisplayLoader(false);
        } else {
          setDisplayLoader(false);
          toast.error(
            "There has been some error fetching this circle data. Please try again after some time!"
          );
        }
      });
    }
  }, []);

  var updatedCircles = {};

  let rounds = [];
  let payouts = [];
  let percentage = 0;
  let percentageRemaining = 100;

  const filterRounds = roundsData.filter((item) => item.circleId === id);
  rounds = filterRounds;
  if (filterRounds.length !== 0) {
    for (let j = 0; j < filterRounds?.length; j++) {
      const filterPayout = payoutsData.find(
        (item) => item.round === filterRounds[j]?.id
      );

      if (filterPayout !== undefined) {
        payouts = [...payouts, filterPayout];
      }
    }
    if (rounds.length === 0) {
      percentage = 0;
    } else {
      percentage = payouts?.length;
      percentageRemaining = rounds.length - payouts.length;
    }
  }
  let amountType = "";
  if (circleDashboardData?.contribType === 1) {
    amountType = "Days";
  } else if (circleDashboardData?.contribType === 2) {
    amountType = "Weeks";
  } else if (circleDashboardData?.contribType === 3) {
    amountType = "Bi-weeks";
  } else if (circleDashboardData?.contribType === 2) {
    amountType = "Months";
  } else {
    amountType = circleDashboardData?.contribType;
  }

  const updatedCircle = {
    ...circleDashboardData,
    contributionType: amountType,
    roundsData: filterRounds,
    circleCompletion: percentage,
    circleRemaining: percentageRemaining,
  };
  updatedCircles = updatedCircle;

  const totalPaidCircleAmount = updatedCircle.currentRound?.paymentsDoneSum;
  const remainingCircleAmount =
    updatedCircles?.totalAmount - updatedCircle.currentRound?.paymentsDoneSum;

  // const
  const data = {
    series: [updatedCircles?.circleRemaining, updatedCircles?.circleCompletion],
    options: {
      chart: {
        width: 380,
        type: "donut",
      },
      labels: [
        `${updatedCircles?.contributionType} Remaining`,
        `${updatedCircles?.contributionType} Passed`,
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  const data2 = {
    series: [remainingCircleAmount || 0, totalPaidCircleAmount || 0],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Remaining Amount ", "Collected Amount "],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

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
          const userData = params?.data?.username;

          return (
            <Link to={`/user-detail/${params?.data?.id}`}>{userData}</Link>
          );
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
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          let status = params?.data?.statusLabel;
          if (status === "Unregistered") {
            status = "Invited";
          }
          return <p>{status}</p>;
        },
      },
    ],
    []
  );

  const headerCellRenderer = ({ value }) => {
    return (
      <div className="ag-cell-label-container">
        <span className="ag-header-cell-text">{value}</span>
      </div>
    );
  };

  const cellRenderer = ({ value }) => {
    return (
      <div className="ag-cell-value">
        <span>{value}</span>
      </div>
    );
  };
  const gridContainerRef = useRef(null);

  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (gridContainer) {
      const rowCount = circleDashboardData?.circleUsers?.length || 0;
      let estimatedHeight;
      if (rowCount <= 5) {
        const rowHeight = 110;
        estimatedHeight = rowCount * rowHeight;
      } else if (rowCount <= 10) {
        const rowHeight = 80;
        estimatedHeight = rowCount * rowHeight;
      } else if (rowCount <= 100) {
        const rowHeight = 70;
        estimatedHeight = rowCount * rowHeight;
      }
      gridContainer.style.height = `${estimatedHeight}px`;
    }
  }, [circleDashboardData]);

  var contributionType = "";
  if (circleDashboardData?.contribType === 1) {
    contributionType = "Daily";
  } else if (circleDashboardData?.contribType === 2) {
    contributionType = "Weekly";
  } else if (circleDashboardData?.contribType === 3) {
    contributionType = "Bi-weekly";
  } else if (circleDashboardData?.contribType === 4) {
    contributionType = "Monthly";
  } else {
    contributionType = circleDashboardData?.contribType;
  }
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[310px] mb-4 items-center">
          <Toaster />
          <Link to={"/"} className="breadcrumbs flex flex-row items-center ">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"/manage-circles"} className="breadcrumbs">
            Manage Circles
          </Link>
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Circle Dashboard
          </Link>
        </Box>
        <h1 className="heading">Circle {} Dashboard</h1>
      </Box>
      <Box className=" w-full flex flex-row justify-between">
        <Box className="box-shadow flex flex-row justify-center items-center w-[24%]">
          {displayLoader ? <Loader /> : ""}
          <Box>
            <img src={activeUsers} alt="" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p className="font-sub-style">Minimum Contribution</p>
            <p
              className="font-style"
              style={{
                color: "#8280FF",
              }}
            >
              {`$${
                circleDashboardData?.minContrib
                  ? circleDashboardData?.minContrib
                  : "0"
              }`}
            </p>
          </Box>
        </Box>
        <Box className="box-shadow flex flex-row justify-center items-center w-[24%] ">
          {" "}
          <Box>
            <img src={amountCollected} alt="" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p className="font-sub-style">Contribution Type</p>
            <p
              className="font-style"
              style={{
                color: "#FF9871",
              }}
            >
              {contributionType}
            </p>
          </Box>
        </Box>

        <Box className="box-shadow flex flex-row justify-center items-center w-[24%]">
          {" "}
          <Box>
            <img src={totalPayments} alt="" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p className="font-sub-style">Total Amount</p>

            <p
              className="font-style"
              style={{
                color: "#FFC107",
              }}
            >
              {`$${
                circleDashboardData?.totalAmount
                  ? circleDashboardData?.totalAmount
                  : "0"
              }`}
            </p>
          </Box>
        </Box>
        <Box className="box-shadow flex flex-row justify-center items-center w-[24%]">
          {" "}
          <Box>
            <img src={totalPayouts} alt="" />
          </Box>
          <Box className="flex flex-col ml-3">
            <p className="font-sub-style">Number of People</p>

            <p
              className="font-style"
              style={{
                color: "#6EE1A7",
              }}
            >
              {circleDashboardData?.involvedUsers?.length !== undefined
                ? circleDashboardData?.involvedUsers?.length
                : "$0"}
            </p>
          </Box>
        </Box>
      </Box>

      <Box className=" w-full mt-4 box-shadow flex-wrap h-500">
        <Box className="w-full flex flex-row justify-between items-center">
          <Box className="w-50p border-box mr-3 p-4 flex flex-col h-[400px]">
            <h2 className="heading">Circle Duration</h2>{" "}
            <Chart
              options={data.options}
              series={data.series}
              height="414"
              type="donut"
            />
          </Box>
          <Box className="w-50p border-box p-4 flex flex-col h-[400px]">
            {" "}
            <h2 className="heading">Current Round Payments</h2>{" "}
            <Chart
              options={data2.options}
              series={data2.series}
              height="414"
              type="pie"
              style={{
                height: "350px",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box className=" w-full flex flex-col mt-4 box-shadow flex-wrap h-500">
        <h1 className="heading mb-4">
          Circle Members : {circleDashboardData?.circleUsers?.length}
        </h1>

        <div className="ag-theme-quartz" ref={gridContainerRef}>
          <AgGridReact
            rowData={usersData}
            columnDefs={columnDefs.map((colDef) => ({
              ...colDef,
              headerComponentFramework: () => headerCellRenderer,
              cellRendererFramework: () => cellRenderer,
            }))}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
            rowHeight={70}
            className="custom-ag-grid"
          />
        </div>
      </Box>
    </div>
  );
};

export default CircleDetail;
