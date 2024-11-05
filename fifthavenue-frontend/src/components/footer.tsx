import './footer.scss'
import Contact from './contact'

const Footer = () => {
  return (
    <div className="footer">
      <Contact />
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span>Men</span>
          <span>Women</span>
          <span>Kids</span>
          <span>Jewellery</span>
          <span>Preowned</span>
        </div>
        <div className="item">
          <h1>Social Media</h1>
          {/* <a href='https://www.linkedin.com/company/technoid-usa/about' target='_blank'><span>LinkedIn</span></a> */}
          <a href='https://www.instagram.com/fifthavenuehub/?utm_source=ig_web_button_share_sheet' target='_blank'><span>Fifthavenuehub</span></a>
          <a href='https://www.instagram.com/westudioamerica?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' target='_blank'><span>Westudioamerica</span></a>
          {/* <a href='https://www.facebook.com/profile.php?id=100091558797908&mibextid=ZbWKwL' target='_blank'><span>FaceBook</span></a> */}
          {/* <a href='https://www.youtube.com/@TechnoidUSA/videos' target='_blank'><span>YouTube</span></a> */}
        </div>
        <div className="item">
          <h1>About</h1>
          <span>
            Welcome to Fifthavenuehub! Established in 2024, we offer a wide range of products, including jewelry, kids' items, men's and women's apparel, and pre-owned clothes. Enjoy a secure shopping experience with Stripe secure payments. Discover something special for everyone in your family.
          </span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>
            +1 (929) 496-9494
          </span>
          <span>fifthavenuehub@gmail.com
          </span>
          <span>
            <h1>Address</h1>
            {/* <div>611 South DuPont Highway, Suite 102, Dover, DE 19901</div> */}
            <div>Suite N-220, 225 Old New Brunswick Rd, Piscataway, NJ 08854
            </div>
            {/* <div>India Office- 1000, Sudama Nagar, Indore MP 452009</div> */}
          </span>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <span className="logo">Fifthavenuehub</span>
          <span className="copyright">
            © Copyright 2024. All Rights Reserved
          </span>
        </div>
        <div className="right">
          <img src="/img/payment.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Footer