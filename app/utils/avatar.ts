export function createAvatarImageURL(username = "username") {
    return `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${username}`
  }