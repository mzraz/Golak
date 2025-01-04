import React from "react";
// import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";

import { Box, Stack } from "@mui/system";
import { Link } from "react-router-dom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
const managementAreas = [
  {
    name: "All Users",
    description: "All users, regardless of their status",
    icon: <PeopleAltIcon sx={{ color: "#10A945" }} fontSize="large" />,
    to: "/reports/users-report",
  },
  {
    name: "Inactive Users",
    description: "Users with pending, rejected and invited status",
    icon: <GroupRemoveIcon sx={{ color: "#10A945" }} fontSize="large" />,
    to: "/reports/inactive-users-report",
  },
  {
    name: "All Circles",
    description: "All circles, regardless of their status ",
    icon: <Diversity3Icon sx={{ color: "#10A945" }} fontSize="large" />,
    to: "/reports/circles-report",
  },
  {
    name: "Inactive Circles",
    description: "Circles with pending, rejected and completed status",
    icon: <Diversity3Icon sx={{ color: "#10A945" }} fontSize="large" />,
    to: "/reports/inactive-circles-report",
  },
  // {
  //   name: "Payments Data",
  //   description: "All payments data",
  //   icon: <PaidIcon sx={{ color: "#10A945" }} fontSize="large" />,
  //   to: "/reports",
  // },
  // {
  //   name: "Payouts Data",
  //   description: "All payouts data",
  //   icon: <AccountBalanceIcon sx={{ color: "#10A945" }} fontSize="large" />,
  //   to: "/reports",
  // },
];
const Reports = () => {
  return (
    <div className="p-10 body-padding">
      {" "}
      <h1 className="heading">Reports Center</h1>
      <div>
        {/* <Breadcrumb title="Rota Module" items={BCrumb} /> */}

        <Box className="box-shadow">
          <Box
            sx={{ flexGrow: 1 }}
            container
            className="card-report"
            spacing={4}
          >
            {managementAreas.map((data, index) => (
              <Grid key={index} item sm={12} md={4} lg={4}>
                <Card className="card-body" variant="elevation" elevation={9}>
                  <CardContent
                    sx={{ padding: 0 }}
                    className="h-[150px] flex flex-row items-start mt-[6px]"
                  >
                    <Stack direction="row" spacing={1}>
                      {data.icon}
                      <Box sx={{ pb: 2, pt: 0.5 }}>
                        <Typography variant="h4">{data.name}</Typography>
                        <br />
                        <Typography variant="subtitle1">
                          {data.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions disableSpacing={true} className="h-[0px]">
                    <Stack
                      direction="row"
                      justifyContent="end"
                      spacing={2}
                      sx={{ width: "100%" }}
                    >
                      <Link to={data.to}>
                        <Button
                          variant="outlined"
                          sx={{
                            color: "#10A945 !important",
                            bgcolor: "#fff !important",
                          }}
                          size="small"
                        >
                          View
                        </Button>
                      </Link>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Reports;
