// react
import { forwardRef, RefObject } from "react";

// hooks
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";
import useShowMsg from "../../hooks/useShowMsg";

// utils
import axios from "../../utils/axios";

// types
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import type { CategoryAndBrandType } from "../../utils/types";
import type { SureModalRef } from "../modals/AreYouSureModal";

// components
import AreYouSureModal from "../modals/AreYouSureModal";

type Props = {
  type: "categories" | "brands";
  singleType: "category" | "brand";
  _id: string;
  name: string;
  refetchModels: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CategoryAndBrandType[]>>;
};

const deleteCategoryOrBrandMutationFn = async ({
  type,
  id,
}: {
  type: Props["type"];
  id: string;
}) => {
  return (await axios.delete(`${type}/${id}`)).data;
};

const RemoveCatOrBrandSureModel = forwardRef<SureModalRef, Props>(
  ({ _id, name, singleType, type, refetchModels }, ref) => {
    const handleError = useHandleErrorMsg();
    const showMsg = useShowMsg();

    const { isPending: removeLoading, mutate: removeModelMutate } = useMutation(
      {
        mutationKey: [`remove ${singleType}`],
        mutationFn: deleteCategoryOrBrandMutationFn,
        onSuccess: (data) => {
          showMsg?.({
            content: data.message || `${singleType} deleted successfully`,
            clr: "green",
            time: 4000,
          });
          (ref as RefObject<SureModalRef>).current?.setOpenModal(false);
          (ref as RefObject<SureModalRef>).current?.setShowYesSpinner(false);

          refetchModels();
        },
        onError: (data) => {
          handleError(data);

          (ref as RefObject<SureModalRef>).current?.setShowYesSpinner(false);
          (ref as RefObject<SureModalRef>).current?.appModalEl
            ?.querySelectorAll("button")
            .forEach((btn) => (btn.disabled = false));
        },
      }
    );

    // const ref = useRef<SureModalRef>(null);

    return (
      <AreYouSureModal
        ref={ref}
        functionToMake={(e) => {
          (ref as RefObject<SureModalRef>).current?.appModalEl
            ?.querySelectorAll("button")
            .forEach((btn) => (btn.disabled = true));

          e.currentTarget.disabled = true;
          (ref as RefObject<SureModalRef>).current?.setShowYesSpinner(true);
          removeModelMutate({ type, id: _id });
        }}
        toggleClosingFunctions={!removeLoading}
      >
        Are you sure you want to delete{" "}
        <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
          {name}
        </span>{" "}
        {singleType}
      </AreYouSureModal>
    );
  }
);
export default RemoveCatOrBrandSureModel;
