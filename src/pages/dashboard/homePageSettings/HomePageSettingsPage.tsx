// components
import Heading from "../../../components/Heading";
import HomePageSliderSettings from "./sections/HomePageImgsSlider/HomePageSliderSettings";

const HomePageSettingsPage = () => {
  return (
    <>
      <div className="section">
        <Heading content="Home Page Settings" />
      </div>

      <h3 style={{ marginBottom: 15 }}>Home Page Slider Images</h3>
      <HomePageSliderSettings />
      <hr style={{ marginBlock: 15 }} />
    </>
  );
};
export default HomePageSettingsPage;
