// components
import Heading from "../../../components/Heading";
import HomePageSliderSettings from "./sections/HomePageImgsSlider/HomePageSliderSettings";

const HomePageSettingsPage = () => {
  return (
    <>
      <Heading>Home Page Settings</Heading>

      <h3 style={{ marginBottom: 15 }}>Home Page Slider Images</h3>
      <HomePageSliderSettings />
      <hr style={{ marginBlock: 15 }} />
    </>
  );
};
export default HomePageSettingsPage;
