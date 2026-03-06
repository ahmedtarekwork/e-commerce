import { http, HttpResponse } from "msw";

import { users } from "../statics";

import { nanoid } from "@reduxjs/toolkit";

const handlers = [
  http.post("*auth/register", async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const body = await request.json();
    const { username, email } = body as Record<
      "username" | "password" | "email",
      string
    >;

    const dublicatedEmail = users.find(
      ({ email: currentEmail }) => currentEmail === email,
    );
    const dublicatedUsername = users.find(
      ({ username: currentUsername }) => currentUsername === username,
    );

    if (dublicatedUsername || dublicatedEmail)
      return HttpResponse.json(
        {
          message: `${dublicatedEmail ? "email" : "username"} is already taken`,
        },
        { status: 409 },
      );

    return HttpResponse.json({ username, email, _id: nanoid() });
  }),
];

export default handlers;
