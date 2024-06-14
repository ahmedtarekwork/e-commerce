import { Link } from "react-router-dom";

// SVGs
import loadMoreSvg from "../../../../../imgs/Load_more.svg";

const BottomBanner = () => {
  return (
    <div className="home-page-bottom-banner">
      <img
        src={loadMoreSvg}
        alt="load more svg image"
        width="450px"
        height="100%"
      />

      <strong>We Have More</strong>

      <Link
        title="go to products page btn"
        className="btn"
        to="/products"
        relative="path"
      >
        Browse More Products
      </Link>
    </div>
  );
};
export default BottomBanner;
