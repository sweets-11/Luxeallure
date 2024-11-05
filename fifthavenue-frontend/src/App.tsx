import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loader from "./components/loader";
import ProtectedRoute from "./components/protected-route";
import { RootState } from "./redux/store";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ProductDetails from "./components/productDetails";
import ProductCategory from "./components/ProductCategory"
import useFetchUser from "./hooks/useFetchUser"; // Import the custom hook
// import { currencyConvert } from "./components/currencyConvert"
const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/order-details"));
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(() => import("./pages/checkout"));

// Admin Routes Importing
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(() => import("./pages/admin/management/productmanagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/transactionmanagement"));

const App = () => {
  const { user, loading } = useSelector((state: RootState) => state.userReducer);
  // currencyConvert()
  useFetchUser(); // Call the custom hook
  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Navbar user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/login" element={
            <ProtectedRoute isAuthenticated={!user}>
              <Login />
            </ProtectedRoute>
          } />
          <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>
          <Route element={<ProtectedRoute isAuthenticated={!!user} adminOnly={true} admin={user?.role === "admin"} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
      <Footer />
    </Router>
  );
};

export default App;
