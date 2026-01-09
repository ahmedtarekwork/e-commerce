// components
import FormInput from "../../../../components/appForm/Input/FormInput";
import PropCell from "../../../../components/PropCell";

// types
import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { ProductFormValues } from "../ProductFormPage";

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errorMsg?: string;
  oldQTY?: number;
  isEditMode: boolean;
  watch: UseFormWatch<ProductFormValues>;
};

const ProductQTY = ({
  register,
  errorMsg,
  oldQTY,
  isEditMode,
  watch,
}: Props) => {
  const QTYInputValue = isEditMode && watch("quantity");

  return (
    <div className={isEditMode ? "product-form-qty-input-holder" : ""}>
      <FormInput
        type="number"
        errorMsg={errorMsg}
        placeholder={`${isEditMode ? "new " : ""}product quantity`}
        {...register("quantity", {
          valueAsNumber: true,
          required: !isEditMode ? "quantity is required" : undefined,
        })}
      />

      {isEditMode && typeof oldQTY === "number" && (
        <PropCell name="current quantity" val={oldQTY} />
      )}

      {!!(isEditMode && QTYInputValue && oldQTY) && (
        <PropCell name="new quantity" val={oldQTY + QTYInputValue} />
      )}
    </div>
  );
};
export default ProductQTY;
