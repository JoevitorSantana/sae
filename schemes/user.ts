import * as z from "zod";

export interface User {
    id_clerk: string,
    name: string | null,
    lastName: string | null,
    email?: string,
    address?: string,
    phone?: string,
}

export const userSchema = z.object({
    id_clerk: z.string(),
    name: z.string().min(3),
    lastName: z.string().min(3)
});

export type userSchemaType = z.infer<typeof userSchema>;