import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";

type ProductsProps = {
  productId: string;
  photos: string[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};


const ProductCard = ({
  productId,
  price,
  name,
  photos,
  stock,
  handler,
}: ProductsProps) => {
  const { symbol, exchangeRate } = useSelector((state: RootState) => state.currency);

  return (
    <Link to={`/product/${productId}`}>

      <div className="product-card">
        <img src={`${server}/${photos[0]}`} alt={name} />
        <p>{name}</p>
        <span>{symbol}{(price * exchangeRate).toFixed(2)}</span>

        <div>
          <button
            onClick={() =>
              handler({ productId, price, name, photos, stock, size: null, quantity: 1 })
            }
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
