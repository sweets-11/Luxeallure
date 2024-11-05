import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/product-card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const ProductCategory = () => {
  const { category: routeCategory } = useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(routeCategory || "");
  const [subCategory1, setSubCategory1] = useState("");
  const [subCategory2, setSubCategory2] = useState("");
  const [page, setPage] = useState(1);
  console.log('====================================');
  console.log("Cat", routeCategory);
  console.log('====================================');
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery({ category, subCategory1 });

  console.log("categoriesResponse", categoriesResponse);




  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    subCategory1,
    subCategory2,
    page,
    price: maxPrice,
  });

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  useEffect(() => {
    setCategory(String(routeCategory));
    setSubCategory1("")
    setSubCategory2("")
  }, [routeCategory]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>SubCategory1</h4>
          <select
            value={subCategory1}
            onChange={(e) => setSubCategory1(e.target.value)}
          >
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.subCategory1.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
        <div>
          <h4>SubCategory2</h4>
          <select
            value={subCategory2}
            onChange={(e) => setSubCategory2(e.target.value)}
          >
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.subCategory2.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {routeCategory === "preowned" ? <span className="preOwnedQuote">Unlock style and sustainability with our premium pre-owned fashion—because great looks shouldn't come at a high cost or environmental impact!</span> : <></>}
        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photos}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
}

export default ProductCategory;
