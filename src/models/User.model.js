import { z } from "zod";

export const userModel = z.object({
    name: z.string()
        .refine(val => val.length >= 3 && val.length <= 20, {
            message: "Your name must be composed of 3 up to 20 characters"
        }),

    email: z.string().email({ message: "The email that you provided is invalid" }),

    role: z.enum(["PROJECT_MANAGER", "DEVELOPER", "TESTER", "DESIGNER", "SECURITY"]),

    password: z
        .string()
        .min(8, {
            message: 'The password must be at least 8 characters'
        }),
})
