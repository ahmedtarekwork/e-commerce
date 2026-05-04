// react
import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";

// react router dom
import { useNavigate } from "react-router-dom";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// components
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";
import FillIcon from "../../../../components/FillIcon";
import activeFillIcon from "../../../../utils/activeFillIcon";
import AreYouSureModal, {
  type SureModalRef,
} from "../../../../components/modals/AreYouSureModal";

// hooks
import useHandleErrorMsg from "../../../../hooks/useHandleErrorMsg";

// redux
import useDispatch from "../../../../hooks/redux/useDispatch";
// redux actions
import { removeProduct } from "../../../../store/fetures/productsSlice";

// utils
import axios from "../../../../utils/axios";

// types
import type { ProductType } from "../../../../utils/types";

// icons
import { BsTrash3, BsTrash3Fill } from "react-icons/bs";

const deleteProductMutationFn = async (productId: string) => {
  return (await axios.delete("products/" + productId)).data;
};

type Props = {
  productId: ProductType["_id"];
  productTitle: ProductType["title"];
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const SingleProductPageDeleteBtn = ({
  productId,
  productTitle,
  setIsLoading,
}: Props) => {
  const navigate = useNavigate();
  const handleError = useHandleErrorMsg();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const sureToDeleteModalRef = useRef<SureModalRef>(null);

  const { mutate: deleteProduct, isPending: isLoading } = useMutation({
    mutationKey: ["deleteProduct", productId],
    mutationFn: deleteProductMutationFn,
    onSuccess() {
      if (productId) dispatch(removeProduct(productId));
      queryClient.prefetchQuery({ queryKey: ["getProducts"] });
      navigate("/dashboard/products", {
        relative: "path",
      });
    },
    onError(error) {
      handleError(
        error,
        {
          forAllStates: "something went wrong while deleting the product",
        },
        5000,
      );
    },
  });

  useEffect(() => {
    setIsLoading(isLoading);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <button
        title="open modal for delete product"
        className="red-btn delete-single-product"
        disabled={isLoading}
        onClick={() => sureToDeleteModalRef.current?.setOpenModal(true)}
        {...activeFillIcon}
      >
        <IconAndSpinnerSwitcher
          toggleIcon={isLoading}
          icon={<FillIcon stroke={<BsTrash3 />} fill={<BsTrash3Fill />} />}
        />
        delete
      </button>

      <AreYouSureModal
        ref={sureToDeleteModalRef}
        toggleClosingFunctions
        functionToMake={() => {
          deleteProduct(productId);
          sureToDeleteModalRef.current?.setOpenModal(false);
        }}
      >
        Are You sure you want to delete "
        <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
          {productTitle}
        </span>
        " product ?
      </AreYouSureModal>
    </>
  );
};
export default SingleProductPageDeleteBtn;
