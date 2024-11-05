import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import Slider from "../components/slider";
import Categories from "../components/categories";
import bannerImage from '../assets/images/1.jpg';

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="home">


      <section>
        <img src={bannerImage} alt="Banner Women" />
      </section>



      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>



      <main>


        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photos={i.photos}
            />




          ))
        )}
      </main>

      <div>
        <Slider />
      </div>
      {/* <div className="slider"> */}
      <h1 className="Cate">
        Shop By Categories

      </h1>
      <Categories />
      {/* </div> */}


    </div >
  );
};

export default Home;
