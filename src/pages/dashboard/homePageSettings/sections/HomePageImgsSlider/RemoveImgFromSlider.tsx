// react
import { useRef } from "react";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useDispatch from "../../../../../hooks/redux/useDispatch";
// redux actions
import { removeImgsFromHomeSliderAction } from "../../../../../store/fetures/homePageSliderImgsSlice";

// components
import IconAndSpinnerSwitcher from "../../../../../components/animatedBtns/IconAndSpinnerSwitcher";
import AreYouSureModal, {
  type SureModalRef,
} from "../../../../../components/modals/AreYouSureModal";

// utils
import axios from "../../../../../utils/axios";

// hooks
import useHandleErrorMsg from "../../../../../hooks/useHandleErrorMsg";

// icons
import { IoMdCloseCircle } from "react-icons/io";
import useSelector from "../../../../../hooks/redux/useSelector";

type Props = {
  imgId: string;
};

const removeImgFromHomeSliderMutationFn = async (imgId: string) => {
  return (await axios.delete(`dashboard/homepageSliderImgs/${imgId}`)).data
    .imgId;
};

const RemoveImgFromSlider = ({ imgId }: Props) => {
  const dispatch = useDispatch();
  const showMsg = useSelector((state) => state.topMessage.showMsg);

  const sureModelRef = useRef<SureModalRef>(null);

  // hooks
  const handleError = useHandleErrorMsg();

  const {
    mutate: removeImgFromSlider,
    isPending: isLoading,
    isSuccess,
  } = useMutation({
    mutationKey: ["removeImgsFromHomePageSlider", imgId],
    mutationFn: removeImgFromHomeSliderMutationFn,
    onError(error) {
      handleError(error, {
        forAllStates: "sorry, we can't remove the image from slider right now",
      });
    },
    onSuccess(data) {
      showMsg?.({
        clr: "green",
        content: "image successfully removed",
        time: 1200,
      });

      setTimeout(() => {
        dispatch(removeImgsFromHomeSliderAction([data]));
      }, 1200);
    },
  });

  return (
    <>
      <button
        title="remove image form home page slider btn"
        disabled={isLoading || isSuccess}
        className="red-btn"
        onClick={() => sureModelRef.current?.toggleModal(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <IconAndSpinnerSwitcher
          spinnerDiminsions="18px"
          toggleIcon={isLoading}
          icon={<IoMdCloseCircle />}
        />
        remove
      </button>

      <AreYouSureModal
        ref={sureModelRef}
        toggleClosingFunctions
        functionToMake={() => {
          removeImgFromSlider(imgId);
          sureModelRef.current?.toggleModal(false);
        }}
      >
        Are you sure you want to remove this image from home page images slider
        ?
      </AreYouSureModal>
    </>
  );
};
export default RemoveImgFromSlider;
