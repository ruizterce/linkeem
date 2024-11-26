import { IonChip, IonAvatar, IonLabel } from "@ionic/react";
import { useEffect, useState } from "react";

interface Like {
  user: {
    id: string;
    username: string;
    profilePicture: string;
  };
}

interface Post {
  likes: Like[];
}

const LikesStack: React.FC<{ post: Post }> = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, []);

  return (
    <div
      className={`relative flex ${
        isExpanded ? "flex-wrap" : "items-center"
      } space-x-1`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {post.likes.map((like, index) => (
        <IonChip
          key={like.user.username}
          className={`text-medium bg-primary transition-all duration-300 ${
            isExpanded ? "relative" : "absolute"
          }`}
          style={
            isExpanded
              ? { marginTop: "0px" }
              : {
                  left: `${index * 10}px`,
                  zIndex: post.likes.length + index,
                  boxShadow: "-2px 0px 3px -2px grey,2px 0px 3px -2px grey ",
                }
          }
        >
          <IonAvatar>
            <img alt={like.user.username} src={like.user.profilePicture} />
          </IonAvatar>
          <IonLabel
            className="font-bold text-light"
            style={{
              maxWidth: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {like.user.username}
          </IonLabel>
        </IonChip>
      ))}
    </div>
  );
};

export default LikesStack;
