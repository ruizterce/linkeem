import React from "react";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import PostCard from "./PostCard";
import { chatbubbleOutline } from "ionicons/icons";
import { Post, PostListProps } from "@/types";

const PostList: React.FC<PostListProps> = ({ posts, loadMore, hasMore }) => {
  return (
    <>
      <IonFab
        horizontal="end"
        vertical="bottom"
        slot="fixed"
        className="mb-2 mr-2 opacity-70 hover:opacity-100 active:opacity-100"
      >
        <IonFabButton routerLink="/post">
          <IonIcon icon={chatbubbleOutline}></IonIcon>
        </IonFabButton>
      </IonFab>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
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
