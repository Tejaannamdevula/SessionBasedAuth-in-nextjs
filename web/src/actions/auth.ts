"use server";

import { ActionResponse, signUpFormData } from "@/lib/types/signup.types";
import { db } from "@/db-drizzle";
import { users } from "../db-drizzle/schema";
import { eq } from "drizzle-orm";
import { deleteSession } from "./session";
import { signUpFormSchema } from "@/lib/definitions";
import bcrypt from "bcrypt";
export async function signup(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const rawData: signUpFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as "user" | "admin",
  };

  // 1. Validate schema
  const validatedData = signUpFormSchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: validatedData.error.flatten().fieldErrors,
    };
  }
  //2.insertion
  // Here you would typically insert the user data into your database
  // console.log("User registered:", validatedData.data);
  const { name, email, password, role } = validatedData.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return {
      success: false,
      message: "Email already exist ,use a different email or login",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .returning({ id: users.id, role: users.role });

  const user = data[0];

  if (!user) {
    return {
      success: false,
      message: "Error occured ",
    };
  }

  return {
    success: true,
    message: "Registration successful! login",
  };
}

export async function login() {}
export async function logout() {
  deleteSession();
}
