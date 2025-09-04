import z from 'zod';

export const createTaskModel = z.object({
    title: z.string()
        .refine(val => val.length >= 3 && val.length <= 50, {
            message: "The project's name must be composed of 3 up to 50 characters"
        }),
    description: z.string().min(1,{
        message: 'The description is required'
    }),
    storyPoints: z.number().nullable(),
    assignedTo: z.string().min(1, {
        message: 'Team member is required'
    }),
})
