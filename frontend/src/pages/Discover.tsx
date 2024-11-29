import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import MainHeader from "../components/MainHeader";
import { fetchPosts } from "../api/post";
import { usePosts } from "../hooks/usePosts";
import PostList from "../components/PostList";

const AllPostsPage: React.FC = () => {
  const { posts, hasMore, loadPosts } = usePosts(fetchPosts);

  return (
    <IonPage>
      <MainHeader title="Discover" />
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

export default AllPostsPage;
