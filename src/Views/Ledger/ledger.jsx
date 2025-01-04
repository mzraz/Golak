import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PDFIMAGE from "../../Assets/Images/pdf.png";
import { FaGreaterThan } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import { initialAuth } from "../../Store/AuthSlice/authSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  getledgerData,
  generateLedgerPDF,
} from "../../Store/Ledger/LedgerSlice";
const style = {
  table: {
    borderCollapse: "collapse",
    width: "100%",
  },
  tr: {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
    fontFamily: "Nunito Sans",
  },
};

const Ledger = () => {
  const pdfRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector(initialAuth);
  const [circlesData, setCirclesData] = useState([]);
  const [ledgerData, setLedgerData] = useState();

  useEffect(() => {
    fetchLedgerData();
  }, []);

  const fetchLedgerData = async () => {
    try {
      dispatch(
        getledgerData({
          token: userInfo.accessToken,
          id: id,
        })
      ).then((response) => {
        setLedgerData(response.payload.roundsWithPayoutStatus);
        setCirclesData(response.payload.circle);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("Ledger.pdf");
    });
  };

  return (
    <div className="p-10 body-padding">
      <Box className="flex flex-col">
        <Box className="breadcrumbs flex flex-row justify-between w-[250px] mb-4 items-center">
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
            Ledger
          </Link>
        </Box>
      </Box>
      <Box className="flex flex-row justify-between mb-4 items-center">
        <h1 className="heading">Circle Ledger</h1>

        <Button
          className="flex flex-row dropdown font-fam"
          style={{
            background: "#76D0B7",
            color: "black",
          }}
          onClick={() => handlePDF()}
        >
          <img src={PDFIMAGE} alt="" className="mr-2" />
          Generate PDF Report
        </Button>
      </Box>
      <Box
        className="box-shadow"
        style={{
          background: "white",
        }}
      >
        <table style={style.table} ref={pdfRef}>
          <tr>
            <th style={style.tr}>Circle ID</th>
            <th style={style.tr}>Circle Name</th>

            <th style={style.tr}>User Name</th>
            <th style={style.tr}>Draw Date</th>
            <th style={style.tr}>Paid</th>
            <th style={style.tr}>Outstanding Amount</th>
            <th style={style.tr}>Late Fee</th>
            <th style={style.tr}>Credit Scrore</th>
          </tr>

          {ledgerData?.map((item, index) => (
            <tr key={index}>
              <td style={style.tr}>{circlesData.id}</td>
              <td style={style.tr}>{circlesData.name}</td>
              <td style={style.tr}>{item.username}</td>
              <td style={style.tr}>{item.start_date.split(" ")[0]}</td>
              <td style={style.tr}>
                {item.isPay === 1 ? `$${item.paymentsDoneSum}.0` : `$0.0`}
              </td>
              <td style={style.tr}>N/A</td>
              <td style={style.tr}>N/A</td>
              <td style={style.tr}>N/A</td>
            </tr>
          ))}
        </table>
      </Box>
    </div>
  );
};

export default Ledger;
