import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import DataTable from "../../Components/DataGrid";
import Loader from "../../Components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { CgAddR } from "react-icons/cg";
import {
  getCircleDashboardData,
  inviteCircleUsers,
  deleteCircleUsers,
} from "../../Store/CircleDashboardData/CircleDashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import { MdDelete } from "react-icons/md";
const OrganisePeople = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [circlesData, setCirclesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [invitePeopleForm, setInvitePeopleForm] = useState(false);
  const [members, setMembers] = useState([
    {
      username: "",
      email: "",
      phone: "",
    },
  ]);
  useEffect(() => {
    fetchCirclesData();
  }, []);
  const fetchCirclesData = async () => {
    setDisplayLoader(true);
    try {
      dispatch(
        getCircleDashboardData({
          id: id,
          token: userInfo.accessToken,
        })
      ).then((response) => {
        if (response?.payload?.statusCode !== "ERR_BAD_REQUEST") {
          const circleData = response.payload.circle;
          setUsersData(circleData.circleUsers);
          setCirclesData(circleData);
          // setUsersData(circleData.circleUsers);
          setDisplayLoader(false);
          // setCircleDashboardData(circleData.circleUsers);
        } else {
          setDisplayLoader(false);
          toast.error(
            "There has been some error fetching this circle data. Please try again after some time!"
          );
        }
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        username: "",
        email: "",
        phone: "",
      },
    ]);
  };

  const stringNumber = 100;
  const number = parseInt(stringNumber, 10);
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];

    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
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
          const userData = params.data.username;

          return <Link to={`/user-detail/${params.data.id}`}>{userData}</Link>;
        },
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
        headerName: "Email",
        field: "email",
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
        headerName: "Action",
        sortable: true,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          const userData = params.data;

          return (
            <button className="dropdown" onClick={() => handleDelete(userData)}>
              <MdDelete size={23} color="red" />
            </button>
          );
        },
      },
    ],
    [circlesData]
  );

  const handleDelete = async (userData) => {
    setDisplayLoader(true);

    try {
      dispatch(
        deleteCircleUsers({
          circleId: id,
          userId: userData.id,
          token: userInfo.accessToken,
        })
      ).then((response) => {
        if (response.payload.status === "Success") {
          fetchCirclesData();
          setDisplayLoader(false);
        } else {
          toast.error("You cannot be able to delete the Circle Admin.");
          setDisplayLoader(false);
        }
      });
    } catch (error) {
      console.log(error);
      toast.error(
        "The user limit for a Circle is 3 and cannot be fewer than 3."
      );
    }
  };

  const handleInvite = () => {
    if (
      circlesData?.currentRound?.rankNumber === 1 &&
      circlesData?.currentRound?.paymentsDoneSum === 0
    ) {
      setInvitePeopleForm(true);
    } else {
      toast.error(
        "You cannot invite more people to this circle because the first payment has already been made. Thank you, and enjoy managing your circle payments."
      );
    }
  };

  const handleUpdate = async () => {
    setDisplayLoader(true);
    const isValidEmails = members.every((member) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(member.email);
    });

    if (!isValidEmails) {
      toast.error("Please enter valid email addresses for all members.");
      return;
    }

    if (isValidEmails) {
      dispatch(
        inviteCircleUsers({
          id: id,
          circleUsers: [...members],
          token: userInfo.accessToken,
        })
      )
        .then((response) => {
          const data = response.payload;
          if (data.status === "Success") {
            fetchCirclesData();
            setInvitePeopleForm(false);
            setDisplayLoader(false);
            toast.success("User has been added to the circle.");
          }
        })
        .catch((error) => {
          toast.error(
            "There has been some error adding the user in this circle. Please try again!"
          );
          setDisplayLoader(false);
        });
    }
  };

  const handleNavigation = () => {
    if (circlesData?.statusId === 2) {
      navigate(`/organise-circle-payment/${id}`);
    } else {
      toast.error(
        "This Circle has not been approved yet. Please approved it first and then you can organise the payments of this circle!",
        {
          className: "toast-center",
        }
      );
    }
  };

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-row justify-between mb-4">
        {displayLoader ? <Loader /> : ""}
        <Toaster />
        <h1 className="heading">Invite People</h1>

        <Box>
          {/* {findCircle?.statusId !== 5 ? ( */}
          <Button
            className="dropdown mr-3"
            variant="contained"
            onClick={() => handleNavigation()}
          >
            Organise People
          </Button>
          {/* )  
          // : (
          //   ""
          // )}*/}

          <Button
            className="dropdown"
            variant="contained"
            onClick={() => handleInvite()}
          >
            Invite People
          </Button>
        </Box>
      </Box>
      <Box className="box-shadow">
        {!invitePeopleForm ? (
          <DataTable columnDefs={columnDefs} rowData={usersData} />
        ) : (
          <Box className="mt-4 p-2 flex flex-col w-full justify-between">
            <Box className="flex flex-row w-full justify-center mb-3">
              <Button
                className="dropdown w-[30%] mt-4  "
                style={{
                  color: "#4379EE",
                  border: "1px solid #4379EE",
                  padding: "12px 0px",
                }}
                disabled={number === members.length}
                onClick={handleAddMember}
              >
                {" "}
                <CgAddR size={20} className="mr-2" />
                Add New Member
              </Button>
            </Box>
            {members.map((member, index) => (
              <div key={index} className="card">
                <Box className="flex flex-row justify-between">
                  <Box className="w-full flex flex-col">
                    <label className="label">Name</label>
                    <TextField
                      required
                      className="bgd-input"
                      placeholder="Enter Member Name"
                      value={member.username}
                      onChange={(e) =>
                        handleMemberChange(index, "username", e.target.value)
                      }
                    />
                  </Box>
                </Box>
                <Box className="flex flex-row justify-between mt-4">
                  <Box className="w-full flex flex-col ">
                    <label className="label">Email</label>
                    <TextField
                      required
                      className="bgd-input"
                      placeholder="Enter Email ID"
                      value={member.email}
                      onChange={(e) =>
                        handleMemberChange(index, "email", e.target.value)
                      }
                    />
                  </Box>
                </Box>
                <Box className="flex flex-row justify-between mt-4">
                  <Box className="w-full flex flex-col ">
                    <label className="label">Phone Number</label>
                    <TextField
                      required
                      className="bgd-input"
                      placeholder="Enter Phone Number"
                      value={member.phone}
                      type="number"
                      onChange={(e) =>
                        handleMemberChange(index, "phone", e.target.value)
                      }
                    />
                  </Box>
                </Box>
              </div>
            ))}
            <Box>
              <Button
                variant="contained"
                className="mt-4 w-full"
                onClick={handleUpdate}
              >
                Add Users in Circle
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default OrganisePeople;
