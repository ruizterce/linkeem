import { useState, useEffect, useContext } from "react";
import { PostContext } from "../contexts/PostContext";
import { Post } from "@/types";

export const usePosts = (
  fetchPostsMethod: (page: number, limit: number) => Promise<Post[]>
) => {
  const { refreshFeed } = useContext(PostContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadPosts = async (isRefresh = false) => {
    try {
      const limit = 10;
      const currentPage = isRefresh ? 1 : page;
      const newPosts = await fetchPostsMethod(currentPage, limit);

      setPosts((prevPosts) =>
        isRefresh
          ? newPosts
          : [
              ...prevPosts,
              ...newPosts.filter(
                (p) => !prevPosts.some((post) => post.id === p.id)
              ),
            ]
      );

      setPage((prev) => (isRefresh ? 2 : prev + 1));
      setHasMore(newPosts.length === limit);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    loadPosts(true);
  }, [refreshFeed]);

  return { posts, hasMore, loadPosts };
};
