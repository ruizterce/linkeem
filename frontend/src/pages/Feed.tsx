import React, { useContext } from "react";
import {
  IonContent,
  IonPage,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import MainHeader from "../components/MainHeader";
import { PostContext } from "../contexts/PostContext";
import { fetchFollowedPosts } from "../api/post";
import { chatbubbleOutline } from "ionicons/icons";
import { usePosts } from "../hooks/usePosts";
import PostList from "../components/PostList";

const Feed: React.FC = () => {
  const { refreshFeed } = useContext(PostContext);
  const { posts, hasMore, loadPosts } = usePosts(fetchFollowedPosts);

  return (
    <IonPage>
      <MainHeader title="Feed" />
      <IonContent className="ion-padding" fixedSlotPlacement="before">
        <IonFab
          horizontal="end"
          vertical="bottom"
          slot="fixed"
          className="mb-2 mr-2"
        >
          <IonFabButton routerLink="/post">
            <IonIcon icon={chatbubbleOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
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
