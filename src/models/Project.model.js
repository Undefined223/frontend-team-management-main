import { z } from "zod";

export const projectModel = z.object({
    name: z.string()
        .refine(val => val.length >= 3 && val.length <= 20, {
            message: "The project's name must be composed of 3 up to 20 characters"
        }),
    description: z.string(),
    deadline: z.date()
})
