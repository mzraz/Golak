import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import CreationStep1 from "./creationStep1";
import CreationStep2 from "./creationStep2";
import CreationStep3 from "./creationStep3";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";
import { Link } from "react-router-dom";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import { createCircle } from "../../Store/CreateCircle/CreateCircleSlice";
const steps = ["Add New Circle", "Invite People", "Organise People"];
export default function CreateCircle() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [displayLoader, setDisplayLoader] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [usersData, setUsersData] = React.useState([]);
  const [skipped, setSkipped] = React.useState(new Set());
  const [members, setMembers] = React.useState([
    {
      username: "",
      email: "",
      phone: "",
      password: "GolakUser123456",
      fcmToken: "",
      id: "",
      image: "",
      ispay: false,
      playerId: "",
      country: "",
      statusId: 4,
      statusLabel: "Unregistered",
      facilitator: false,
    },
  ]);

  const [errors, setErrors] = React.useState({
    name: "",
    minContrib: "",
    totalAmount: "",
    numUsers: "",
    startDate: "",
    slot: "",
  });

  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const milliseconds = String(currentDate.getMilliseconds())
    .padStart(3, "0")
    .padEnd(6, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  function formattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds())
      .padStart(3, "0")
      .padEnd(6, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  function getDateRange(frequency, currentDate) {
    switch (frequency) {
      case "weekly":
        const nextWeekDate = new Date(currentDate);
        nextWeekDate.setDate(currentDate.getDate() + 7);
        return {
          startDate: formattedDate(currentDate),
          endDate: formattedDate(nextWeekDate),
          currentDate: nextWeekDate,
        };
      case "monthly":
        const nextMonthDate = new Date(currentDate);
        nextMonthDate.setMonth(currentDate.getMonth() + 1);
        return {
          startDate: formattedDate(currentDate),
          endDate: formattedDate(nextMonthDate),
          currentDate: nextMonthDate,
        };
      case "daily":
        const nextDate = new Date(currentDate);
        nextDate.setMonth(currentDate.getDate() + 1);
        return {
          startDate: formattedDate(currentDate),
          endDate: formattedDate(nextDate),
          currentDate: nextDate,
        };

      default:
        return null;
    }
  }

  const [step1Data, setStep1Data] = React.useState({
    name: "",
    contribType: 0,
    numUsers: 3,
    startDate: "",
    totalAmount: 0,
    minContrib: 0,
    circleUsers: [],
    slot: "",
  });

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === 1) {
      const isValidEmails = members.every((member) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(member.email);
      });

      if (!isValidEmails) {
        toast.error("Please enter valid email addresses for all members.");
        return;
      }

      if (members.length === step1Data.numUsers) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        toast.error(`Please enter the details of ${step1Data.numUsers} users.`);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    setDisplayLoader(true);
    let membersData = [];

    members.map((item) => {
      const obj = {
        username: item.username,
        phone: item.phone,
        email: item.email,
      };

      membersData.push(obj);
    });

    const circleFinalization = {
      ...step1Data,
      circleUsers: [...membersData],
    };

    const findUser = members.find((item) => item.facilitator === true);

    if (findUser !== undefined && findUser !== null && findUser !== "") {
      dispatch(
        createCircle({
          data: {
            ...circleFinalization,
            facilitator: findUser.email,
            statusId: 1,
            statusLabel: "pending",
            startDate: `${circleFinalization.startDate}T10:00:00.000Z`,
          },
          token: userInfo.accessToken,
        })
      ).then((response) => {
        if (response.payload.status === "Success") {
          setDisplayLoader(false);
          navigate(`/circle-dashboard/${response.payload.circleId}`);
        } else {
          toast.error(response.payload.errors);
          setDisplayLoader(false);
        }
      });
    } else {
      setDisplayLoader(false);
      toast.error(
        "Please select the facilitator to manage the circle payments"
      );
    }

    // setDisplayLoader(true);
  };

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[170px] mb-4 items-center">
          <Toaster />
          <Link to={"/"} className="breadcrumbs flex flex-row items-center">
            {" "}
            <MdOutlineHome size={16} /> Home
          </Link>{" "}
          <FaGreaterThan size={14} />{" "}
          <Link to={"#"} className="breadcrumbs">
            Create Circle
          </Link>
        </Box>
        <h1 className="heading">Add New Circle</h1>
      </Box>

      <Box
        className=" box-shadow "
        style={{
          padding: "80px",
          paddingLeft: "20%",
          paddingRight: "20%",
        }}
      >
        {displayLoader ? <Loader /> : ""}
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps} className="flex flex-col-reverse">
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
          {activeStep === 0 ? (
            <CreationStep1
              setStep1Data={setStep1Data}
              step1Data={step1Data}
              errors={errors}
              setErrors={setErrors}
            />
          ) : null}
          {activeStep === 1 ? (
            <CreationStep2
              setStep1Data={setStep1Data}
              step1Data={step1Data}
              setMembers={setMembers}
              members={members}
            />
          ) : null}
          {activeStep === 2 ? (
            <CreationStep3
              setMembers={setMembers}
              members={members}
              step1Data={step1Data}
            />
          ) : null}
          <Box></Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              className="dropdown"
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                className="dropdown"
                style={{
                  background: "#4880FF",
                  padding: "8px 30px",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                {"Submit"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                className="dropdown"
                disabled={
                  step1Data.name === "" ||
                  step1Data.minContrib === "" ||
                  step1Data.contribType === "" ||
                  step1Data.totalAmount === "" ||
                  step1Data.numUsers === "" ||
                  step1Data.startDate === "" ||
                  step1Data.slot === ""
                }
                style={{
                  background: "#4880FF",
                  padding: "8px 30px",
                  borderRadius: "10px",
                  color: "white",
                }}
              >
                {"Next"}
              </Button>
            )}
          </Box>
        </React.Fragment>
      </Box>
    </div>
  );
}
