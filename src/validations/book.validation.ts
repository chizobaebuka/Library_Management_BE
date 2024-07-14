import { z } from 'zod';

export const createBookSchema = z.object({
    title: z.string()
        .min(1, { message: 'Title is required' })
        .max(100, { message: 'Title must be at most 100 characters long' }),
    author: z.string()
        .min(1, { message: 'Author is required' })
        .max(100, { message: 'Author must be at most 100 characters long' }),
    genre: z.string()
        .min(1, { message: 'Genre is required' })
        .max(50, { message: 'Genre must be at most 50 characters long' }),
    description: z.string()
        .max(500, { message: 'Description must be at most 500 characters long' }),
    available: z.boolean()
        .default(true),  
});

export const updateBookSchema = z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional(),
    description: z.string().optional(),
    available: z.boolean().optional(),
});

export type CreateBookRequest = z.infer<typeof createBookSchema>;
export type UpdateBookRequest = z.infer<typeof updateBookSchema>;
