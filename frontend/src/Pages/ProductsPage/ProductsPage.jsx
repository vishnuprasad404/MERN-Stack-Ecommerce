import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./ProductsPage.css";
import {useSearchParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CategorySubItem from "../../Components/CategorySubItem/CategorySubItem";
import { Loading } from "../../Components/Loading/Loading";
import Product from "../../Components/Product/Product";

function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [filterToggler, setFilterToggler] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsTemp, setProductsTemp] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("item");
  const [minValue, setMinValue] = useState(100);
  const [maxValue, setMaxValue] = useState(30000);
  const [excludeStock, setExcludeStock] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/products`).then((res) => {
      setProducts(res.data);
      setProductsTemp(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      let filterdData = productsTemp.filter((item) => {
        return (
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setProducts([...filterdData]);
    }
  }, [productsTemp, searchTerm]);

  const filterByCategory = (e) => {
    if (e.target.value !== "") {
      setSearchParams({ item: e.target.value });
    } else {
      setProducts([...productsTemp]);
    }
  };

  const filterByPrise = () => {
    let filterdData = productsTemp.filter((item) => {
      return item.discountPrise >= minValue && item.discountPrise <= maxValue;
    });
    setProducts([...filterdData]);
  };

  const filterByStock = () => {
    setExcludeStock(excludeStock === true ? false : true);

    if (excludeStock === true) {
      setProductsTemp([...products]);
      let filterData = products.filter((item) => {
        return item.inStock >= 1;
      });
      setProducts([...filterData]);
    } else {
      setProducts([...productsTemp]);
    }
  };

  return (
    <div className="products-page" id="allproducts">
      <Navbar />
      <CategorySubItem />
      <div className="products-page-container-wrapper">
        <div className="filter-container">
          <h5>Filter Products</h5>
          <div className="filter-toggle-btns">
            <button
              onClick={() => setFilterToggler(filterToggler ? false : true)}
            >
              {filterToggler ? "Apply" : "Filter"}
            </button>
            <button>Sort by</button>
          </div>
          <div
            className={`filter-container-items ${
              filterToggler ? "filter-toggler-open " : "filter-toggler-close"
            }`}
          >
            <p className="fiter-heading">Filter by Category</p>
            <select onChange={(e) => filterByCategory(e.target.value)}>
              <option value="all">All Products</option>
              <option value="mobiles">Mobiles</option>
              <option value="electronics">Elactronics</option>
              <option value="appliences">Appliences</option>
              <option value="headphones">Headphones</option>
              <option value="desktops">Desktops</option>
            </select>
            <p className="fiter-heading">Filter by Prise</p>
            <div className="prise-filter-range">
              <input
                type="range"
                className="prise-range"
                min={100}
                max={5000}
                defaultValue={100}
                onChange={(e) => {
                  setMinValue(parseInt(e.target.value));
                  filterByPrise();
                }}
              />
              <input
                type="range"
                className="prise-range"
                min={5000}
                max={30000}
                defaultValue={30000}
                onChange={(e) => {
                  setMaxValue(parseInt(e.target.value));
                  filterByPrise();
                }}
              />
            </div>
            <div className="prise-filter-container">
              <input
                type="text"
                placeholder="Minimum"
                value={minValue}
                readOnly
              />
              <input
                type="text"
                placeholder="Maximum"
                value={maxValue}
                readOnly
              />
            </div>
            <p className="fiter-heading">Avalibility</p>
            <div className="filter-by-avalibility">
              <input
                type="checkbox"
                onClick={filterByStock}
                id="excludeOutOfStock"
              />
              <label htmlFor="excludeOutOfStock">Exclude out of stock</label>
            </div>
            <p className="fiter-heading">Customer Ratings</p>
            <div className="filter-by-rating">
              <input type="checkbox" />
              <span>
                4 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>
            <div className="filter-by-rating">
              <input type="checkbox" />
              <span>
                3 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>{" "}
            <div className="filter-by-rating">
              <input type="checkbox" />
              <span>
                2 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>
            <div className="filter-by-rating">
              <input type="checkbox" />
              <span>
                1 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>
          </div>
        </div>
        {!loading ? (
          <div className="container-fluid p-3">
            <div className="row gy-4">
              {products.map((itm, key) => {
                return (
                  <Product
                    pid={itm._id}
                    title={itm.title}
                    image={itm.image1}
                    skelton={false}
                    cutPrise={itm.orginalPrise}
                    disPrise={itm.discountPrise}
                    inStock={itm.inStock}
                    cardStyle={{
                      border: "1px solid rgb(223, 223, 223)",
                      boxShadow: "none",
                      height: "max-content",
                    }}
                    buttonStyle={{ display: "none" }}
                    cartIconStyle={{
                      position: "absolute",
                      top: "40px",
                      right: "10px",
                      padding: "0",
                      color: "grey",
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
