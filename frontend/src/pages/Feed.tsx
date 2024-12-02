import React from "react";
import {
  IonContent,
  IonPage,
  IonRippleEffect,
  useIonRouter,
} from "@ionic/react";
import MainHeader from "../components/MainHeader";
import { fetchFollowedPosts } from "../api/post";
import { usePosts } from "../hooks/usePosts";
import PostList from "../components/PostList";

const Feed: React.FC = () => {
  const { posts, hasMore, loadPosts } = usePosts(fetchFollowedPosts);
  const router = useIonRouter();

  return (
    <IonPage>
      <MainHeader title="Feed" />
      <IonContent className="ion-padding" fixedSlotPlacement="before">
        {posts.length > 0 ? (
          <PostList
            posts={posts}
            loadMore={() => loadPosts()}
            hasMore={hasMore}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div
              className="py-20 px-6 text-center rounded-lg ion-activatable ripple-parent border-2 border-solid border-gray-100 hover:border-medium text-sm text-gray-600 dark:text-gray-300"
              onClick={() => {
                router.push("/discover", "forward");
              }}
            >
              <p>Your Feed has no posts yet!</p>
              <p>Click here to Discover new content!</p>
              <IonRippleEffect className="rounded-md"></IonRippleEffect>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Feed;
