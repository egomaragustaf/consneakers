import { z } from "zod"

const email = z.string().min(1, "Email is required").email("Sorry, this is not an email")

const username = z.string().min(4, "Username require at least 4 characters").max(20, "Username limited to 20 characters")

const name = z.string().min(1, "Full name is required").max(50, "Full name limited to 50 characters")

const password = z.string({ required_error: "Password is required" }).min(8, "Password at least 8 characters").max(100, "Password max of 100 characters")
  
export const schemaUserSignUp = z.object({ name, username, email, password })