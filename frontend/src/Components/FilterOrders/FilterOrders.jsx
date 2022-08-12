import React from "react";
import "./FilterOrders.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function FilterOrders(props) {
  const { setSearchQuery } = props;
  const [filterActive, setFilterActive] = useState("");

  const filterOrders = async (query) => {
    setFilterActive(query);
    setSearchQuery(query);
  };

  return (
    <section className="order-filter-section">
      <h5>Filter Orders</h5>
      <div className="filter-order-by-search">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search order"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="sort-orders">
        <p className="orders-sort-heading">Order Status</p>
        <OrderSortOption
          opt="Pending"
          name="Pending"
          checked={filterActive === "pending" ? true : false}
          onClick={() => filterOrders("pending")}
        />
        <OrderSortOption
          opt="Placed"
          name="Placed"
          checked={filterActive === "placed" ? true : false}
          onClick={() => filterOrders("placed")}
        />
        <OrderSortOption
          opt="Shipped"
          name="Shipped"
          checked={filterActive === "dispatched" ? true : false}
          onClick={() => filterOrders("dispatched")}
        />
        <OrderSortOption
          opt="Deliverd"
          name="Deliverd"
          checked={filterActive === "completed" ? true : false}
          onClick={() => filterOrders("completed")}
        />
        <OrderSortOption
          opt="Cancelled"
          name="Cancelled"
          checked={filterActive === "cancelled" ? true : false}
          onClick={() => filterOrders("cancelled")}
        />
      </div>
    </section>
  );
}
const OrderSortOption = (props) => {
  const { onClick, opt, checked } = props;
  return (
    <div className="sort-order-option" onClick={onClick}>
      <input type="checkbox" checked={checked} onChange={onClick} />
      {opt}
    </div>
  );
};
export default FilterOrders;
