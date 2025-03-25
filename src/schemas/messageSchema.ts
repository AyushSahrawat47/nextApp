import {z} from 'zod';

export const messageSchema = z.object({
    content: z
    .string()
    .min(1, {message:'content must be atleast 1 character'})
    .max(300,{message:'content must be no longer than 300 characters'})
})