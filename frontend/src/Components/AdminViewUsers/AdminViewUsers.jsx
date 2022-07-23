import React, { useEffect, useState } from "react";
import "./AdminViewUsers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Paginate from "react-paginate";

function AdminViewUsers() {
  const [users, setUsers] = useState([]);
  const [filterdUsers, setFilterdUsers] = useState(users);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/admin/get-all-user`)
      .then((res) => {
        setUsers(res.data);
        setFilterdUsers(res.data);
      });
  }, []);

  const deleteUser = (id) => {
    axios
      .delete(`${process.env.REACT_APP_BASE_URL}/admin/delete-user/${id}`)
      .then((res) => {
        console.log(res);
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
      console.log(users);
      return (
        <tbody>
          <td data-label="No">#{key + 1}</td>
          <td data-label="Username">{itm.username}</td>
          <td data-label="Email">{itm.email}</td>
          <td data-label="Phone">{itm.phone}</td>
          <td data-label="Account Created Date">{itm.created_at}</td>
          <td data-label="Remove">
            <FontAwesomeIcon
              icon={faTrash}
              className="admin-remove-user-btn"
              onClick={() => deleteUser(itm._id)}
            />
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
            <th>Remove</th>
          </thead>
          {displayUsers}
        </table>
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
      </div>
    </div>
  );
}

export default AdminViewUsers;
