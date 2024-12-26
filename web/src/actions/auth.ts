"use server";

import { ActionResponse, signUpFormData } from "@/lib/types/signup.types";

import { signUpFormSchema } from "@/lib/definitions";

export async function signup(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
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

    // Here you would typically insert the user data into your database
    console.log("User registered:", validatedData.data);

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during registration.",
    };
  }
}
