// react query
import { useMutation } from "@tanstack/react-query";

// components
import PropCell from "../PropCell";
import SelectList, {
  type selectListOptionType,
} from "../selectList/SelectList";

// types
import type { OrderProductType } from "../../utils/types";

// redux
import useSelector from "../../hooks/redux/useSelector";
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { setCart } from "../../store/fetures/userSlice";

// utils
import axios from "../../utils/axios";
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";

type Props = {
  propName: string;
  product: OrderProductType;
};
const changeProductQTYMutationFn = async (
  product: {
    productId: string;
    newWantedQTY: number;
    oldQTY: number;
  },
  userId: string,
) => {
  if (!userId)
    throw new axios.AxiosError(
      "__APP_ERROR__ you need to login before modify your cart",
      "403",
    );

  return (await axios.patch(`carts/${userId}/changeProductQTY`, product)).data;
};

const ProductCardQtyList = ({ propName, product }: Props) => {
  const { _id } = product;
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleError = useHandleErrorMsg();

  const { isPending, mutate: changeProductQTY } = useMutation({
    mutationKey: ["changeProductQTY", _id],
    mutationFn: (product: { newWantedQTY: number; oldQTY: number }) =>
      changeProductQTYMutationFn(
        { ...product, productId: _id },
        user?._id || "",
      ),

    onSuccess: (data) => {
      dispatch(setCart(data));
    },
    onError(error) {
      handleError(error, {
        forAllStates: "something went wrong while modifying your cart",
      });
    },
  });

  const list = Array.from({
    length: product.count,
  }).map((_, i) => ({
    selected: product.wantedQty === i + 1,
    text: i + 1,
  })) as unknown as selectListOptionType<`${number}`>[];

  return (
    <PropCell
      name={propName}
      propNameProps={{ className: "product-card-qty" }}
      val={
        <SelectList
          disabled={{
            value: isPending,
            text: "loading...",
          }}
          outOfFlow={{
            value: true,
            fullWidth: true,
          }}
          optClickFunc={(e) => {
            const newWantedQTY = e.currentTarget.dataset.opt;
            const oldQTY = product.wantedQty;

            if (newWantedQTY && +newWantedQTY !== oldQTY) {
              changeProductQTY({
                newWantedQTY: +newWantedQTY,
                oldQTY,
              });
            }
          }}
          listOptsArr={list}
        />
      }
    />
  );
};
export default ProductCardQtyList;
