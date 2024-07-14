// src/schemas/user.ts
import { z } from 'zod';

export const signUpUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format, expected YYYY-MM-DD",
  }).transform(val => new Date(val)),
  country: z.string().min(1, 'Country is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const updateUserProfileSchema = z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email('Invalid email address').optional(),
        dateOfBirth: z.string().optional().refine(val => !isNaN(Date.parse(val ?? '')), {
            message: "Invalid date format, expected YYYY-MM-DD",
        }).transform(val => val ? new Date(val) : undefined), // Transform string to Date if provided
        country: z.string().optional(),
    });


export type SignUpUserRequest = z.infer<typeof signUpUserSchema>;
export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;
    

