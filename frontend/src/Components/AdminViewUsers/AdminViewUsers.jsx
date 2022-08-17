import React, { useEffect, useState } from "react";
import "./AdminViewUsers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Paginate from "react-paginate";
import { SmallLoading } from "../Loading/Loading";

function AdminViewUsers() {
  const [users, setUsers] = useState([]);
  const [filterdUsers, setFilterdUsers] = useState(users);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(new Set());

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/get-all-user`)
      .then((res) => {
        setUsers(res.data);
        setFilterdUsers(res.data);
      });
  }, []);

  const deleteUser = (id, selectedIndex) => {
    setLoading((prev) => new Set([...prev, selectedIndex]));

    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/admin/delete-user/${id}`)
      .then((res) => {
        if (res.data) {
          setTimeout(() => {
            setLoading((prev) => {
              const updated = new Set(prev);
              updated.delete(selectedIndex);
              return updated;
            });
            users.splice(selectedIndex, 1);
          }, 1000);
        }
      });
  };

  const onFilterUsers = (e) => {
    let filterdData = users.filter((data) => {
      return (
        data.username.toLowerCase().includes(e.target.value) ||
        data.email.toLowerCase().includes(e.target.value)
      );
    });
    setFilterdUsers(filterdData);
  };

  const allUsersPage = 8;
  const pagesVisited = pageNumber * allUsersPage;

  const displayUsers = filterdUsers
    .slice(pagesVisited, pagesVisited + allUsersPage)
    .map((itm, key) => {
      let date = new Date(itm.created_at);
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();
      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;
      date = dd + "/" + mm + "/" + yyyy;
      return (
        <tbody>
          <td data-label="No">#{key + 1}</td>
          <td data-label="Username">{itm.username}</td>
          <td data-label="Email">{itm.email}</td>
          <td data-label="Phone">{itm.phone}</td>
          <td data-label="Account Created Date">{date}</td>
          <td data-label="Remove" style={{ textAlign: "center", padding: "0" }}>
            {!loading.has(key) ? (
              <FontAwesomeIcon
                icon={faTrash}
                className="admin-remove-user-btn"
                onClick={() => deleteUser(itm._id, key)}
              />
            ) : (
              <SmallLoading
                smallLoadingStyle={{
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            )}
          </td>

        </tbody>
      );
    });

  const pageCount = Math.ceil(filterdUsers.length / allUsersPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="admin-view-users">
      <h1>Users</h1>
      <div className="admin-view-users-filter">
        <div className="admin-view-users-filter-input">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Search Users..."
            onChange={onFilterUsers}
          />
        </div>
        <FontAwesomeIcon
          icon={faSearch}
          className="admin-view-users-filter-btn"
        />
      </div>
      <div className="admin-view-users-list">
        <table className="admin-view-users-table">
          <thead>
            <th>No</th>
            <th>Username</th>
            <th>Email ID</th>
            <th>Phone Number</th>
            <th>Account Created Date</th>
            <th style={{ textAlign: "center", padding: "0" }}>Remove</th>
          </thead>
          {displayUsers}
        </table>
        {users.length < 1 || filterdUsers.length < 1 ? (
          <center className="no-user">
            {" "}
            <FontAwesomeIcon className="no-user-icon" icon={faSearch} /> No users
            found
          </center>
        ) : null}
        {users.length > 1 && filterdUsers.length > 1 ? (
          <Paginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination-container"}
            previousLinkClassName={"previous-btn"}
            nextLinkClassName={"next-btn"}
            disabledClassName={"pagination-disabled-btn"}
            activeClassName={"pagination-active"}
          />
        ) : null}
      </div>
    </div>
  );
}

export default AdminViewUsers;
