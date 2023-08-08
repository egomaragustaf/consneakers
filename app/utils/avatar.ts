export function createAvatarImageURL(username = "username") {
    return `https://api.dicebear.com/6.x/initials/svg?seed=${username}`
  }