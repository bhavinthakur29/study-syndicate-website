import { query } from "./_generated/server";
import { getStaff } from "./lib/auth";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await getStaff(ctx);
    return user
      ? { name: user.name, email: user.email, role: user.role }
      : null;
  },
});
