import type { User } from "@prisma/client"
import { prisma } from "~/db.server"
import bcrypt from "bcryptjs"

export type { User } from "@prisma/client"

export const mutation = {
    async login({
        username,
        password,
      }: {
        username: User["username"]
        password: string // from the form field, but it is not the hash
      }) {
        if (!username)
          return {
            error: {
              username: `Username is required`,
              password: "",
            },
          }
    
        const user = await prisma.user.findUnique({
          where: { username },
          include: { password: true },
        })
    
        if (!user) {
          return {
            error: {
              username: `Sorry, user ${username} is not found or registered yet, check again or create an account!`,
              password: "",
            },
          }
        }
        if (!user.password) {
          return {
            error: {
              username: `User ${username} has no password`,
              password: "",
            },
          }
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password.hash)
        if (!isPasswordCorrect) {
          return {
            error: {
              username: "",
              password: "Password is incorrect, check again",
            },
          }
        }
    
        return { user, error: null }
      },
}