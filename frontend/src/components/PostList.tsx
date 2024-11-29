import React from "react";
import {
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRippleEffect,
  IonAvatar,
  useIonRouter,
} from "@ionic/react";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
  };
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: { username: string };
  }[];
  likes: {
    userId: string;
  }[];
}

interface PostListProps {
  posts: Post[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, loadMore, hasMore }) => {
  const router = useIonRouter();

  return (
    <>
      {posts.map((post) => (
        <div
          key={post.id}
          className="ion-activatable ripple-parent rounded-lg relative dark:bg-gray-800 border-2 border-solid border-gray-100 py-4 px-6 mb-4 hover:border-medium"
          onClick={() => {
            router.push(`/posts/${post.id}`);
          }}
        >
          <IonLabel className="text-primary dark:text-light">
            <div
              className="inline-flex items-center mb-2 rounded-3xl pr-2 hover:bg-primary hover:text-light cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/users/${post.author.id}`);
              }}
            >
              <IonAvatar className="w-6 h-6">
                <img src={post.author.profilePicture} alt="" />
              </IonAvatar>
              <h1 className="font-semibold text-xl ml-2">
                {post.author.username}
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {post.content}
            </p>
            <div className="w-full flex justify-between items-center">
              <div>
                <span className="text-sm text-primary dark:text-light">
                  {post.comments.length} Comments
                </span>
                <span className="text-medium"> | </span>
                <span className="text-sm text-secondary dark:text-light">
                  {post.likes.length} Likes
                </span>
              </div>

              <sub className="text-medium">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </sub>
            </div>
          </IonLabel>
          <IonRippleEffect className="rounded-md"></IonRippleEffect>
        </div>
      ))}

      <IonInfiniteScroll
        onIonInfinite={(e) => {
          loadMore().finally(() =>
            (e.target as HTMLIonInfiniteScrollElement).complete()
          );
        }}
        threshold="100px"
        disabled={!hasMore}
      >
        <IonInfiniteScrollContent
          loadingText="Loading more posts..."
          loadingSpinner="circular"
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </>
  );
};

export default PostList;
