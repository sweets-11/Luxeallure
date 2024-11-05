
import "./contact.scss"; import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa6";


const Contact = () => {
  return (
    <div className="contact">
      <div className="wrapper">
        <span>BE IN TOUCH WITH US:</span>
        <div className="mail">
          <input type="text" placeholder="Enter your e-mail..." />
          <button>JOIN US</button>
        </div>
        <div className="icons">
          <FaFacebook />
          <RiInstagramFill />
          <FaTwitter />
          <FaGoogle />
          <FaPinterest />
        </div>
      </div>
    </div>
  );
};

export default Contact;
