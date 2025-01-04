import React, { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { RiDraggable } from "react-icons/ri";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import DataTable from "../../Components/DataGrid";
const CreationStep3 = ({ setMembers, members, step1Data }) => {
  const itemsWithIndex = members.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newNumbers = [...members];
    const [removed] = newNumbers.splice(result.source.index, 1);
    newNumbers.splice(result.destination.index, 0, removed);
    setMembers(newNumbers);
  };

  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleCheckboxChange = (event, rowData) => {
    const id = rowData.id;
    setSelectedRowId(id === selectedRowId ? null : id);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Circle No.",
        field: "index",
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
        sortable: false,
        filter: false,
        floatingFilter: false,
        flex: 1,
        cellRenderer: (params) => {
          return (
            <input
              type="checkbox"
              style={{ width: "20px", height: "20px" }}
              checked={params.data.facilitator}
              name="facilitator"
              onChange={(event) =>
                handleStatusUpdate(event, "facilitator", params.data)
              }
            />
          );
        },
      },
    ],
    [members]
  );

  console.log(members, "data is coming");
  const handleStatusUpdate = (event, field, data) => {
    const value = event.target.checked;
    const findIndex = members.findIndex((item) => item.email === data.email);
    const checkedMember = members.find((item) => item.facilitator === true);
    if (event.target.checked) {
      const updatedMembers = [...members];
      updatedMembers[findIndex][field] = true;
      if (checkedMember !== undefined) {
        const findIndexChecked = members.findIndex(
          (item) => item.email === checkedMember.email
        );
        const updatedMember = [...updatedMembers];
        updatedMember[findIndexChecked][field] = false;
        setMembers(updatedMembers);
      } else {
        setMembers(updatedMembers);
      }
    } else {
      const updatedMembers = [...members];
      updatedMembers[findIndex][field] = false;
      setMembers(updatedMembers);
    }
  };

  return (
    <div className="mt-5 w-full">
      {step1Data.slot === "manual" ? (
        <DragDropContext onDragEnd={(results) => onDragEnd(results)}>
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border-b">Action</th>
                <th className="p-2 text-left border-b">Rank</th>
                <th className="p-2 text-left border-b">Name</th>
                <th className="p-2 text-left border-b">Phone Number</th>
                <th className="p-2 text-left border-b">Facilitator</th>
              </tr>
            </thead>

            <Droppable droppableId="tbody">
              {(provided) => (
                <tbody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white"
                >
                  {members &&
                    members.map((item, index) => (
                      <Draggable
                        draggableId={item.username}
                        index={index}
                        key={item.username}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border-b"
                          >
                            <td
                              {...provided.dragHandleProps}
                              className="p-2 text-center cursor-pointer"
                            >
                              <RiDraggable size={20} />
                            </td>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{item.username}</td>
                            <td className="p-2">{item.email}</td>
                            <td className="p-2">
                              <input
                                type="checkbox"
                                style={{ width: "20px", height: "20px" }}
                                checked={item.facilitator}
                                name="facilitator"
                                onChange={(event) =>
                                  handleStatusUpdate(event, "facilitator", item)
                                }
                              />
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      ) : (
        <DataTable columnDefs={columnDefs} rowData={itemsWithIndex} />
      )}
    </div>
  );
};

export default CreationStep3;
