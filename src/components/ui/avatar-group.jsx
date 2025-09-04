import { Avatar, AvatarFallback } from "./avatar";

export default function AvatarGroup5({ users }) {
  return (
    <div className="flex items-center -space-x-1 *:ring-3 *:ring-background">
      {users.slice(0, 3).map((user, index) => (
        <Avatar
          key={index}
        >
          <AvatarFallback>
            {user[0]}
          </AvatarFallback>
        </Avatar>
      ))}
      {users.length > 3 && (
        <Avatar className="z-10 text-sm font-medium text-muted-foreground">
          <AvatarFallback>
            +{users.length - 3}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
