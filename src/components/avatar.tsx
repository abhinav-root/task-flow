import { Avatar as AvatarUI, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Avatar({username, avatarUrl = ""}: {username: string, avatarUrl?: string}) {
    let fallbackText;
    const split = username.split(" ")
    if (split.length > 1) {
        fallbackText = split[0][0] + split[1][0]
    } else {
        fallbackText = username[0]
    }

  return (
    <AvatarUI>
      <AvatarImage src={avatarUrl} alt="Avatar Image" />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </AvatarUI>
  );
}
