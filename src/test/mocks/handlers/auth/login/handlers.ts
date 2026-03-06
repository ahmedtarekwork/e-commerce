import { http, HttpResponse } from "msw";

import { users } from "../statics";

const handlers = [
  http.post("*auth/login/credentials", async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const body = await request.json();
    const { username, password } = body as {
      username: string;
      password: string;
    };

    const selectedUser = users.find(
      ({ username: currentUsername }) => currentUsername === username,
    );

    if (!selectedUser)
      return HttpResponse.json({ message: "user not found" }, { status: 404 });

    if (selectedUser.password !== password)
      return HttpResponse.json(
        { message: "password incorrect" },
        { status: 400 },
      );

    return HttpResponse.json(selectedUser);
  }),
];

export default handlers;
