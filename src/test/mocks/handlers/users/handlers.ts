import { http, HttpResponse } from "msw";

import { users } from "../auth/statics";

import type { UserType } from "../../../../utils/types";

const handlers = [
  http.patch("*users/:id", async ({ params, request }) => {
    const { id } = params as { id: string };

    const body = (await request.json()) as Pick<
      UserType,
      "username" | "email" | "address"
    >;

    const selectedUser = JSON.parse(
      JSON.stringify(users.find(({ _id }) => _id === id)!),
    );

    Object.keys(body).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (selectedUser as any)[key] = body[key as keyof typeof body];
    });

    return HttpResponse.json(selectedUser);
  }),

  http.delete("*users/:id", async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({ message: "user deleted successfully" });
  }),
];

export default handlers;
