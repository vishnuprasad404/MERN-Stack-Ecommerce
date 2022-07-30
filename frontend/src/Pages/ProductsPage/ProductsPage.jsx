import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./ProductsPage.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Rating from "../../Components/Rating/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CategorySubItem from "../../Components/CategorySubItem/CategorySubItem";
import { Loading } from "../../Components/Loading/Loading";

function ProductsPage() {
  const nav = useNavigate();
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
            <select onChange={filterByCategory}>
              <option value="">All Products</option>
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
          products.length >= 1 ? (
            <div
              className={
                loading ? "products-list-loading" : "products-list-container"
              }
            >
              {products.map((itm) => {
                return (
                  <div
                    className="products-item-container"
                    onClick={() => nav(`/product/${itm._id}`)}
                  >
                    <div className="products-item-image-container">
                      <img width="130px" src={itm.image1} alt="" />
                    </div>
                    <Rating
                      id={itm._id}
                      width="40px"
                      height="20px"
                      fontSize="10px"
                    />

                    <p className="products-item-title">{itm.title}</p>
                    <p>
                      $ {itm.discountPrise} <del>{itm.orginalPrise}</del>{" "}
                      <span
                        style={{
                          fontSize: "9px",
                          color: `${itm.inStock >= 1 ? "green" : "red"}`,
                        }}
                      >
                        {itm.inStock >= 1 ? "inStock" : "outofStock"}
                      </span>
                    </p>
                    <br />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-product-container">
              <img
                width="400px"
                src="https://tradebharat.in/assets/catalogue/img/no-product-found.png"
                alt="no products"
              />
            </div>
          )
        ) : (
          <Loading style={{ width: "100%", position: "absolute" }} />
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
