import { redirect } from "@sveltejs/kit";

export const GET = () => {
  redirect(303, "user/profile");
};
