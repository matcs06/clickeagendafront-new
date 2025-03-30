import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string | undefined;
  imageUrl?: string;
}

export function UserAvatar({ name, imageUrl }: UserAvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <Avatar>
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={name} />
      ) : (
        <AvatarFallback>{initial}</AvatarFallback>
      )}
    </Avatar>
  );
}