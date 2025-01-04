import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import DataTable from "../../Components/DataGrid";

import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrganizePaymentsData,
  paymentsMarkedForUsers,
} from "../../Store/OrganizePayments/OrganizePaymentsSlice";
import { initialAuth } from "../../Store/AuthSlice/authSlice";

const OrganiseCirclePayments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [circlesData, setCirclesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const ITEM_HEIGHT = 48;
  const [displayLoader, setDisplayLoader] = useState(false);
  const [circleData, setCircleData] = useState();
  const [propUserData, setPropData] = useState({});
  const [usersExistInCircle, setUsersExistInCircle] = useState([]);
  const [circleCheckedIds, setCircleCheckedIds] = useState([]);
  var updatedUsers = [];
  const open = Boolean(anchorEl);
  const handleClick = (event, userData) => {
    setAnchorEl(event.currentTarget);
    setPropData(userData);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [paymentData, setPaymentsData] = useState([]);
  useEffect(() => {
    fetchCirclesData();
  }, []);
  const fetchCirclesData = async () => {
    setDisplayLoader(true);
    try {
      dispatch(
        getOrganizePaymentsData({
          token: userInfo.accessToken,
          id: id,
        })
      ).then((response) => {
        const data = response.payload.circle;
        if (Object.keys(data).length !== 0) {
          setUsersExistInCircle(data.circleUsers);
          setCircleData(data);
          setDisplayLoader(false);
        }
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (circlesData.length !== 0 && usersData?.length !== 0) {
      let findCircle = circlesData?.find((item) => item.id === id);
      setCircleData(findCircle);
      let existingUsers = usersData?.filter((userId) =>
        findCircle?.involvedUsers?.includes(userId.id)
      );
      let usersArray = [];
      const payments = paymentData.filter(
        (item) => item.round === findCircle?.currentRoundId
      );

      for (let i = 0; i < existingUsers?.length; i++) {
        const findPayment = payments.find(
          (item) => item.from_user === existingUsers[i]?.id
        );

        if (findPayment !== undefined) {
          existingUsers[i] = {
            ...existingUsers[i],
            payment: findPayment.amount,
            isAlreadyPaid: true,
          };
        } else {
          existingUsers[i] = {
            ...existingUsers[i],
            payment: 0,
            isAlreadyPaid: false,
          };
        }
      }

      setUsersExistInCircle(existingUsers);
      updatedUsers = [...existingUsers];
    }
  }, []);

  const columnDefs = useMemo(() => {
    if (!circleData) return [];

    return [
      {
        headerName: "User ID",
        field: "id",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
      },

      {
        headerName: "Name",
        field: "username",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
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
        headerName: "Facilitator",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          let facilitator = false;
          if (params?.data?.id === circleData?.createdById) {
            facilitator = true;
          }

          return (
            <td>
              <input
                type="checkbox"
                style={{ width: "20px", height: "20px" }}
                checked={facilitator}
                name="facilitator"
              />
            </td>
          );
        },
      },

      {
        headerName: "Actions",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => (
          <td className="flex flex-row justify-center items-center">
            <label className="switch flex flex-row justify-end items-center">
              <input
                type="checkbox"
                checked={params.data.paymentCheck !== 0}
                disabled={params.data.paymentCheck === 1}
                onChange={(event) =>
                  handleStatusUpdate(event, params.data, params.node.rowIndex)
                }
              />
              <span
                className={`slider round w-[95px] slider-text ${
                  params.data.paymentCheck !== 0
                    ? "flex flex-row justify-start items-center pl-3"
                    : "flex flex-row justify-end items-center pr-2"
                }`}
              >
                {params.data.paymentCheck !== 0 ? "Paid" : "Unpaid"}
              </span>
            </label>

            {/* <IconButton
              aria-label="more"
              id="long-button"
              className="dropdown ml-3"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={(event) => handleClick(event)}
            >
              <MoreVertIcon /> */}
            {/* </IconButton> */}
          </td>
        ),
      },
    ];
  }, [usersExistInCircle]);

  const handleSubmit = async () => {
    setDisplayLoader(true);
    try {
      dispatch(
        paymentsMarkedForUsers({
          token: userInfo.accessToken,
          circleUsers: {
            circleId: id,
            paidUsers: [...circleCheckedIds],
          },
        })
      )
        .then((response) => {
          if (response.payload === "Payments updated successfully") {
            toast.success("Payments updated successfully.");
            setDisplayLoader(false);
            setTimeout(() => {
              navigate(`/organise-circle/${id}`);
            }, 1000);
          }
        })
        .catch((error) => {
          setDisplayLoader(false);

          toast.error("There is some error to update the payments data.");
        });
    } catch (error) {
      setDisplayLoader(false);

      toast.error("There is some error to update the payments data.");
    }
  };

  const handleStatusUpdate = (event, data, index) => {
    const updatedUsersExistInCircle = [...usersExistInCircle];

    updatedUsersExistInCircle[index] = {
      ...updatedUsersExistInCircle[index],
      paymentCheck: event.target.checked ? 1 : 0,
    };

    if (event.target.checked) {
      setCircleCheckedIds([
        ...circleCheckedIds,
        updatedUsersExistInCircle[index].id,
      ]);
    }

    setUsersExistInCircle(updatedUsersExistInCircle);
  };
  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-row justify-between mb-4">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <h1 className="heading">Organise People</h1>
        <h2>Total Members : {usersExistInCircle.length}</h2>
      </Box>
      <Box className="box-shadow">
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
          <MenuItem className="ml-2">
            <RiDeleteBin5Fill size={20} color="red" className="mr-2" />
            Delete User
          </MenuItem>
        </Menu>
        <DataTable columnDefs={columnDefs} rowData={usersExistInCircle} />
      </Box>
      <Box className="flex flex-row w-full justify-end mt-4">
        <Button
          variant="contained"
          className="dropdown"
          style={{
            width: "138px",
          }}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </div>
  );
};

export default OrganiseCirclePayments;
