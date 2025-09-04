import { z } from "zod";

export const profileModel = z.object({
    name: z.string()
        .refine(val => val.length == 0 || (val.length >= 3 && val.length <= 20), {
            message: "Your name must be composed of 3 up to 20 characters"
        }),

    email: z.string()
        .email({ message: "The email that you provided is invalid" }),

    role: z.enum(["PROJECT_MANAGER", "DEVELOPER", "TESTER", "DESIGNER", "SECURITY"])
        .optional(),

    currentPassword: z.string(),

    password: z.string()
        .refine(val => val.length == 0 || val.length >= 8, {
            message: 'The password must be at least 8 characters'
        }),

    confirmPassword: z.string(),
})
    .refine((data) => {
        if (data.password || data.confirmPassword) {
            return data.password === data.confirmPassword;
        }
        return true;
    }, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
