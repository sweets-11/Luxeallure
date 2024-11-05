import "./Card.scss";
import { Link } from "react-router-dom";

const Card = () => {
  return (
    <Link className="link" to={`/product/}`}>
    <div className="card">
      <div className="image">
        <span>New Season</span>
        <img
          src={
            "https://m.media-amazon.com/images/I/615b5rN-9mL._SY550_.jpg"
          }
          alt=""
          className="mainImg"
        />
        <img
          src={
            "https://m.media-amazon.com/images/I/615b5rN-9mL._SY550_.jpg"
          }
          alt=""
          className="secondImg"
        />
      </div>
      <h2>Jeans</h2>
      <div className="prices">
        <h3>$33</h3>
        <h3>$20</h3>
      </div>
    </div>
  </Link>
  )
}

export default Card