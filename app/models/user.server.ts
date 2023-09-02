import type { User } from "@prisma/client"
import { prisma } from "~/db.server"
import bcrypt from "bcryptjs"

export type { User } from "@prisma/client"

export const query = {
  count() {
    return prisma.user.count()
  },

  getAllUsernames() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        updatedAt: true,
      },
    })
  },

  getForSession({ id }: Pick<User, "id">) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        cartId: true,
      },
    })
  },
}

export const mutation = {
  async signup({
    email,
    name,
    username,
    password,
  }: Pick<User, "name" | "username" | "email"> & {
    password: string
  }) {
    if (!email) return { error: { email: `Email is required` } }
    const userEmail = await prisma.user.findUnique({
      where: { email: email.trim() },
      include: { password: true },
    })
    if (userEmail) return { error: { email: `Email ${email} is already used` } }

    const userUsername = await prisma.user.findUnique({
      where: { username: username.trim() },
    })
    if (userUsername) {
      return { error: { username: `Username ${username} is already taken` } }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password: { create: { hash: hashedPassword } },
      },
    })

    return { user, error: null }
  },

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