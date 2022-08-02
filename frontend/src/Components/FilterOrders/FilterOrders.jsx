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
        <input type="text" placeholder="Search order" />
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
          opt="Deliverd"
          name="Deliverd"
          checked={filterActive === "deliverd" ? true : false}
          onClick={() => filterOrders("deliverd")}
        />
        <OrderSortOption
          opt="Cancelled"
          name="Cancelled"
          checked={filterActive === "cancelled" ? true : false}
          onClick={() => filterOrders("cancelled")}
        />
        <p className="orders-sort-heading mt-3 ">Order Time</p>
        <OrderSortOption
          opt="Last 30 Days"
          name="Last 30 Days"
          checked={filterActive === "L30D" ? true : false}
          onClick={() => filterOrders("L30D")}
        />
        <OrderSortOption
          opt="Older"
          name="Older"
          checked={filterActive === "older" ? true : false}
          onClick={() => filterOrders("older")}
        />
      </div>
    </section>
  );
}
const OrderSortOption = (props) => {
  const { onClick, opt, checked } = props;
  return (
    <div className="sort-order-option" onClick={onClick} >
      <input type="checkbox" checked={checked} onChange={onClick}/>
      {opt}
    </div>
  );
};
export default FilterOrders;
