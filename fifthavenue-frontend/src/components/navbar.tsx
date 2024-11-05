import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { User } from "../types/types";
import { MdDashboardCustomize } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
// import { MdKeyboardArrowDown, MdDashboardCustomize } from "react-icons/md";
import { RootState } from '../redux/store';
import { setCurrency } from '../redux/reducer/currencyReducer';
import { IoListCircle } from "react-icons/io5";
// import { RiLogoutBoxFill } from "react-icons/io";
import { userNotExist } from "../redux/reducer/userReducer";
import "./Navbar.scss";
import { useState } from "react";
//
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
  { code: "CHF", symbol: "Fr." },
  { code: "CNY", symbol: "¥" },
  { code: "SEK", symbol: "kr" },
  { code: "NZD", symbol: "NZ$" },
  { code: "INR", symbol: "₹" },
  { code: "RUB", symbol: "₽" },
  { code: "BRL", symbol: "R$" },
  { code: "ZAR", symbol: "R" },
  { code: "KRW", symbol: "₩" },
  { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" },
  { code: "NOK", symbol: "kr" },
  { code: "MXN", symbol: "Mex$" },
  { code: "TRY", symbol: "₺" },
];

interface PropsType {
  user: User | null;
}

const Navbar = ({ user }: PropsType) => {
  // const [currency, setCurrency] = useState('');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { selectedCurrency } = useSelector((state: RootState) => state.currency);
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedCurrency = currencies.find(currency => currency.code === event.target.value);
    if (selectedCurrency) {
      dispatch(setCurrency(selectedCurrency));
    }
  };

  const logoutHandler = () => {
    try {
      localStorage.removeItem("user");
      dispatch(userNotExist());
      toast.success("Sign Out Successfully");
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      toast.error("Sign Out Failed");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const authItems = user?._id ? (
    <>
      <div className="item">
        <Link to="/admin/dashboard">
          <MdDashboardCustomize />
        </Link>
      </div>
      <div className="item">
        <Link className="link" to="/orders"><IoListCircle /></Link>
      </div>
      <div className="item">
        <button onClick={logoutHandler}><RiLogoutBoxFill /></button>
      </div>
    </>
  ) : (
    <Link to="/login">
      <FaSignInAlt />
    </Link>
  );

  const mobileAuthItems = user?._id ? (
    <>
      <div className="item">
        <Link onClick={toggleMenu} to="/admin/dashboard">
          <MdDashboardCustomize /> Admin
        </Link>
      </div>
      <div className="item">
        <Link onClick={toggleMenu} to="/orders"><IoListCircle /></Link>
      </div>
      <div className="item">
        <button onClick={() => { logoutHandler(); toggleMenu(); }}><RiLogoutBoxFill /></button>
      </div>
    </>
  ) : (
    <div className="item">
      <Link onClick={toggleMenu} to="/login">
        <FaSignInAlt /> Login
      </Link>
    </div>
  );

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="left">
          <div className="item">
            <img src="/img/en.png" alt="" />
          </div>
          {/* <div className="item">
            <span>USD</span>
            <MdKeyboardArrowDown />
          </div> */}
          {/* <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={currency}
                onChange={handleChange}
                MenuProps={MenuProps}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div> */}
          <div>
            <FormControl disabled variant="standard" sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={selectedCurrency}
                onChange={handleChange}
                MenuProps={MenuProps}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="item">
            <Link className="link" to="/products/men">Men</Link>
          </div>
          <div className="item">
            <Link className="link" to="/products/women">Women</Link>
          </div>
          <div className="item">
            <Link className="link" to="/products/kids">Kids</Link>
          </div>
          <div className="item">
            <Link className="link" to="/products/jewellery">Jewellery</Link>
          </div>
          <div className="item">
            <Link className="link" to="/products/preowned">Pre-Owned</Link>
          </div>
        </div>
        <div className="center">
          <Link className="logo" to="/">Fifthavenuehub </Link>
        </div>
        <div className="right">
          <div className="item">
            <Link onClick={() => setMenuOpen(false)} to="/">
              HOME
            </Link>
          </div>
          {authItems}
          <div className="icons">
            <Link onClick={() => setMenuOpen(false)} to="/search">
              <FaSearch />
            </Link>
            <div className="cartIcon">
              <Link onClick={() => setMenuOpen(false)} to="/cart">
                <FaShoppingBag />
              </Link>
              <span>{1}</span>
            </div>
          </div>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
      {menuOpen && (
        <div className="mobileMenu">
          {/* Currency */}
          {/* <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="currency-select-label" sx={{ color: 'white' }}>Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency-select"
                value={selectedCurrency}
                onChange={handleChange}
                MenuProps={MenuProps}
                sx={{ color: 'white', '& .MuiSvgIcon-root': { color: 'white' } }}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div> */}
          <div className="item">
            <Link onClick={toggleMenu} to="/">HOME</Link>
          </div>
          <div className="item">
            <Link onClick={toggleMenu} to="/search">
              <FaSearch /> Search
            </Link>
          </div>
          <div className="item">
            <Link onClick={toggleMenu} to="/cart">
              <FaShoppingBag /> Cart
            </Link>
          </div>
          <div className="item">
            <Link onClick={toggleMenu} to="/products/men">Men</Link>
          </div>
          <div className="item">
            <Link onClick={toggleMenu} to="/products/women">Women</Link>
          </div>
          <div className="item">
            <Link onClick={toggleMenu} to="/products/kids">Kids</Link>
          </div>
          <div className="item">
            <Link onClick={toggleMenu} to="/products/jewellery">Jewellery</Link>
          </div>
          <div className="item">
            <Link onClick={toggleMenu} to="/products/preowned">Pre-Owned</Link>
          </div>
          {mobileAuthItems}
        </div>
      )}
    </div>
  );
};

export default Navbar;
