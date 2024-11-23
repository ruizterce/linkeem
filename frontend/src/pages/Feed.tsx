import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import MainHeader from "../components/MainHeader";
import { fetchPosts } from "../api/post";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
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

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    // Initial fetch
    loadMorePosts();
  }, []);

  const loadMorePosts = async () => {
    try {
      const limit = 10; // Number of posts per page
      const newPosts = await fetchPosts(page, limit);

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts];
        newPosts.forEach((newPost: Post) => {
          // Check if the post already exists in the state based on the post ID
          if (!updatedPosts.some((post) => post.id === newPost.id)) {
            updatedPosts.push(newPost);
          }
        });
        return updatedPosts;
      });

      setPage((prevPage) => prevPage + 1);

      // If the returned posts are less than the limit, we've reached the end
      if (newPosts.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    }
  };

  return (
    <IonPage>
      <MainHeader title="Feed" />
      <IonContent className="ion-padding">
        <IonList className="space-y-4" lines="none">
          {posts.map((post) => (
            <IonItem
              key={post.id}
              className="dark:bg-gray-800 border-2 border-solid border-gray-100 rounded-lg p-4"
            >
              <IonLabel className="text-primary dark:text-light">
                <h1 className="font-semibold text-lg">
                  {post.author.username}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {post.content}
                </p>
                <p className="text-sm text-secondary dark:text-light">
                  {post.likes.length} Likes
                </p>
                <div className="mt-4 border-dotted border-t-2">
                  <IonList className="space-y-4" lines="none">
                    {post.comments.map((comment) => (
                      <IonItem key={comment.id} className="mt-2 text-sm">
                        <div>
                          <b className="text-gray-500">
                            {comment.user.username}
                          </b>
                          <p className="text-gray-500 dark:text-gray-400">
                            {comment.content}
                          </p>
                        </div>
                      </IonItem>
                    ))}
                  </IonList>
                </div>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={(e) => {
            loadMorePosts().finally(() =>
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
      </IonContent>
    </IonPage>
  );
};

export default Feed;
