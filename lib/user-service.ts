import prisma from "./prisma"

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    return user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}
