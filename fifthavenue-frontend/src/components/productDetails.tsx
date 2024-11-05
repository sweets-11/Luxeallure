import { Fragment, useState, useEffect } from 'react';
import "./productDetails.css";
import star_icon from "../assets/images/star_icon.png";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../redux/store";
import { BiArrowBack } from "react-icons/bi";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { CartItem } from "../types/types";
import toast from "react-hot-toast";
import DescriptionBox from './descriptionBox';
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";
import { ProductCarousel } from "./productDetailCrousel.tsx";
// Size order for alphanumeric sizes
const sizeOrder: { [key: string]: number } = {
  'XS': 1,
  'S': 2,
  'M': 3,
  'L': 4,
  'XL': 5,
  'XXL': 6,
};

// Sorting function
const sortSizes = (sizes: string[]): string[] => {
  return sizes.sort((a, b) => {
    if (sizeOrder[a] && sizeOrder[b]) {
      return sizeOrder[a] - sizeOrder[b];
    } else if (sizeOrder[a]) {
      return -1;
    } else if (sizeOrder[b]) {
      return 1;
    } else {
      return parseInt(a) - parseInt(b);
    }
  });
};

const ProductDetails = () => {
  const dispatch = useDispatch();
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useProductDetailsQuery(params.id!);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const { symbol, exchangeRate } = useSelector((state: RootState) => state.currency);

  const sizes = data?.product?.sizes || [];
  const sortedSizes = sortSizes([...sizes]);

  useEffect(() => {
    // Add any necessary effect logic here
  }, [params.id]);

  const increaseQuantity = () => {
    if (data?.product && data?.product.stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const handleButtonClick = () => {
    if (data?.product) {
      const cartItem: CartItem = {
        productId: data.product._id,
        photos: data.product.photos,
        name: data.product.name,
        price: data.product.price,
        size: size,
        quantity: quantity,
        stock: data.product.stock,
      };
      addToCartHandler(cartItem);
    }
  };

  const handleSizeClick = (size: string) => {
    setSize(size);
  };

  const navigate = useNavigate();
  const images = data?.product.photos || [];
  const video = data?.product.video || "";
  console.log(images);

  return (
    <Fragment>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Fragment>
          <div className="ProductDetails">
            <button className="back-btn" onClick={() => navigate('/')}>
              <BiArrowBack />
            </button>
            <div>
              {/* <img className="CarouselImage" src={`${server}/${data?.product.photos}`} alt={data?.product.name} /> */}
              <ProductCarousel images={images} server={server} video={video} />
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{data?.product.name}</h2>
              </div>
              <div className="detailsBlock-2">
                <div className="Ratings">
                  {[...Array(4)].map((_, i) => (
                    <img
                      className="RatingImage"
                      key={i}
                      src={star_icon}
                      alt=""
                    />
                  ))}
                </div>
              </div>
              <div className="detailsBlock-3">
                {/* <h1>{symbol}{(data?.product.price * exchangeRate).toFixed(2)}</h1> */}
                {data?.product?.price && (
                  <h1>{symbol}{(data.product.price * exchangeRate).toFixed(2)}</h1>
                )}
                {/* <div className="description">{data?.product?.description}</div> */}

                {sortedSizes.length > 0 ? (
                  <div className="product-sizes">
                    <h1>Select Size</h1>
                    <div className='sizes'>
                      {sortedSizes.map((s, index) => (
                        <div
                          key={`${s}-${index}`}
                          onClick={() => handleSizeClick(s)}
                          style={{
                            cursor: 'pointer',
                            padding: '10px',
                            border: size === s ? '2px solid blue' : '1px solid gray'
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <span>{quantity}</span>
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  {data?.product && (
                    <button
                      disabled={data.product.stock < 1}
                      onClick={handleButtonClick}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
                <p>
                  Status:{' '}
                  {data?.product && <b className={data?.product?.stock < 1 ? 'redColor' : 'greenColor'}>
                    {data?.product?.stock < 1 ? 'OutOfStock' : 'InStock'}
                  </b>}
                </p>
              </div>
              <div className="detailsBlock-4">
                <p className="product-category">
                  <span>Category : </span>
                  {data?.product.category}
                </p>
              </div>
            </div>
          </div>
          <DescriptionBox description={data?.product.description} />
        </Fragment>
      )}
    </Fragment>
  )
}

export default ProductDetails;
