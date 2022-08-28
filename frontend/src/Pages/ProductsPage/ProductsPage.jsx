import React, { useEffect, useState, Fragment, useRef } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./ProductsPage.css";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import CategorySubItem from "../../Components/CategorySubItem/CategorySubItem";
import { Loading } from "../../Components/Loading/Loading";
import Product from "../../Components/Product/Product";
import noProductImg from "../../Assets/no-product-found.png";

function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [filterToggler, setFilterToggler] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("item");
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [excludeStock, setExcludeStock] = useState(false);
  const [ratingQuery, setRatingQuery] = useState(0);
  const MinRef = useRef();
  const MaxRef = useRef();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/products`).then((res) => {
      setProducts(shuffleArray(res.data));
      setLoading(false);
      //get the maximum amount of product from array //
      const productsMaxPrise = Math.max(
        ...res.data.map((p) => {
          return p.discountPrise;
        })
      );
      setMaxValue(productsMaxPrise);
      MaxRef.current = productsMaxPrise;
      // end
      //get the minimum amount of product from array //
      const productsMinPrise = Math.min(
        ...res.data.map((p) => {
          return p.discountPrise;
        })
      );
      setMinValue(productsMinPrise);
      MinRef.current = productsMinPrise;

      // end
    });
  }, []);

  // shuffle products array start //

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };
  //shuffle products array end //

  const DispalyProducts = products
    // filter product by title or category //
    .filter((item) => {
      if (searchTerm && searchTerm !== "all") {
        return (
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        return item;
      }
    })
    // filter product by exclude out of stock //
    .filter((item) => {
      return excludeStock ? item.inStock >= 1 : item;
    })
    // filter product by avarage rating //
    .filter((item) => {
      return ratingQuery ? item.total_ratings >= ratingQuery : item;
    })
    // filter product by minimum prise and maximum prise //
    .filter((item) => {
      return item.discountPrise >= minValue && item.discountPrise <= maxValue;
    })
    .map((itm, key) => {
      return (
        <Fragment key={key}>
          <Product
            Mapkey={key}
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
              maxHeight: "300px",
            }}
            buttonStyle={{ display: "none" }}
            cartIconStyle={{
              position: "absolute",
              top: "40px",
              right: "10px",
              padding: "0",
            }}
            showInstock
          />
        </Fragment>
      );
    });
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
            <select onChange={(e) => setSearchParams({ item: e.target.value })}>
              <option value="all">All Products</option>
              <option value="mobiles">Mobiles</option>
              <option value="electronics">Elactronics</option>
              <option value="appliences">Appliences</option>
              <option value="headphones">Headphones</option>
              <option value="watches">Watches</option>
              <option value="desktops">Desktops</option>
            </select>
            <p className="fiter-heading">Filter by Prise</p>
            <div className="prise-filter-range">
              <input
                type="range"
                className="prise-range"
                min={toString(MinRef.current)}
                max={toString(MaxRef.current / 2)}
                value={minValue}
                onChange={(e) => {
                  setMinValue(parseInt(e.target.value));
                }}
              />
              <input
                type="range"
                className="prise-range"
                min={toString(MaxRef.current / 2)}
                max={toString(MaxRef.current)}
                value={maxValue}
                onChange={(e) => {
                  setMaxValue(parseInt(e.target.value));
                }}
              />
            </div>
            <div className="prise-filter-container">
              <input
                type="number"
                placeholder="Minimum"
                value={minValue}
                min={toString(MinRef.current)}
                max={toString(MaxRef.current / 2)}
                onChange={(e) => {
                  setMinValue(e.target.value);
                }}
              />
              <input
                type="number"
                placeholder="Maximum"
                value={maxValue}
                min={toString(MaxRef.current / 2)}
                max={toString(MaxRef.current)}
                onChange={(e) => {
                  setMaxValue(e.target.value);
                }}
              />
            </div>
            <p className="fiter-heading">Avalibility</p>
            <div className="filter-by-avalibility">
              <input
                type="checkbox"
                onClick={() =>
                  setExcludeStock(excludeStock === true ? false : true)
                }
                id="excludeOutOfStock"
              />
              <label htmlFor="excludeOutOfStock">Exclude out of stock</label>
            </div>
            <p className="fiter-heading">Customer Ratings</p>
            <div
              className="filter-by-rating"
              onClick={() => {
                setRatingQuery(4);
              }}
            >
              <input
                type="checkbox"
                checked={ratingQuery === 4 ? true : false}
                onChange={() => setRatingQuery(4)}
              />
              <span>
                4 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>
            <div
              className="filter-by-rating"
              onClick={() => {
                setRatingQuery(3);
              }}
            >
              <input
                type="checkbox"
                checked={ratingQuery === 3 ? true : false}
                onChange={() => setRatingQuery(3)}
              />
              <span>
                3 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>{" "}
            <div className="filter-by-rating" onClick={() => setRatingQuery(2)}>
              <input
                type="checkbox"
                checked={ratingQuery === 2 ? true : false}
                onChange={() => setRatingQuery(2)}
              />
              <span>
                2 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>
            <div className="filter-by-rating" onClick={() => setRatingQuery(1)}>
              <input
                type="checkbox"
                checked={ratingQuery === 1 ? true : false}
                onChange={() => setRatingQuery(1)}
              />
              <span>
                1 <FontAwesomeIcon icon={faStar} style={{ fontSize: "11px" }} />{" "}
                & above{" "}
              </span>
            </div>
          </div>
        </div>
        {!loading ? (
          <div className="container-fluid p-2">
            <div className="row gy-3">
              {DispalyProducts.length >= 1 ? (
                DispalyProducts
              ) : (
                <div className="no-product-container">
                  <img width="250px" src={noProductImg} alt="" />
                  <h1 className="no-product-text">No Products Avalible!</h1>
                </div>
              )}
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
