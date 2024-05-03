// components
import DeleteItemBtn, { DeleteItemBtnProps } from "../components/DeleteItemBtn";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// utiles
import { axiosWithToken } from "../utiles/axios";

const deleteUserMutationFn = async (userId: string) => {
  return (await axiosWithToken.delete("users/" + userId)).data;
};

const useDeleteUserBtn = (userId?: string) => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteUser,
    isError: deleteErr,
    error: deleteErrData,
    isPending: deleteLoading,
    isSuccess: deleteSuccess,
    reset,
    data: deletedUserData,
  } = useMutation({
    mutationKey: ["deleteUser", userId],
    mutationFn: deleteUserMutationFn,
    onSuccess: () => {
      queryClient.prefetchQuery({ queryKey: ["getAllUsers"] });
    },
  });

  return {
    deleteBtn: ({
      itemId: userId,
      username,
      ...attr
    }: Omit<DeleteItemBtnProps, "deleteLoading" | "deleteItem">) => (
      <DeleteItemBtn
        {...attr}
        {...{ deleteLoading, deleteItem: deleteUser, itemId: userId, username }}
      />
    ),

    deletedUserData,
    deleteErr,
    deleteErrData,
    deleteSuccess,
    reset,
  };
};

export default useDeleteUserBtn;
