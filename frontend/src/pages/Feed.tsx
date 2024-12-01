import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import MainHeader from "../components/MainHeader";
import { fetchFollowedPosts } from "../api/post";
import { usePosts } from "../hooks/usePosts";
import PostList from "../components/PostList";

const Feed: React.FC = () => {
  const { posts, hasMore, loadPosts } = usePosts(fetchFollowedPosts);

  return (
    <IonPage>
      <MainHeader title="Feed" />
      <IonContent className="ion-padding" fixedSlotPlacement="before">
        <PostList
          posts={posts}
          loadMore={() => loadPosts()}
          hasMore={hasMore}
        />
      </IonContent>
    </IonPage>
  );
};

export default Feed;
