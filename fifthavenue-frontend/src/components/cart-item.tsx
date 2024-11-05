import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { server } from "../redux/store";
import type { CartItem } from "../types/types";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";

type CartItemProps = {
  cartItem: CartItem;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;
};

const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { symbol, exchangeRate } = useSelector((state: RootState) => state.currency);
  const { photos, productId, name, price, quantity, size } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photos[0]}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>{symbol}{(price * exchangeRate).toFixed(2)}</span>
      </article>

      <span style={{ fontWeight: "bold" }}>{size}</span>

      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
