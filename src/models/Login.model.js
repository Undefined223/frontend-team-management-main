import { z } from "zod";

export const loginModel = z.object({
    email : z.string().email({ message: "the email that you provided is invalid" }),
    password: z.string().min(4, { message: 'The password must be at least 4 chars' }),
});


