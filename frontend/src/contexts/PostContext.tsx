import React, { createContext, useState, useCallback, ReactNode } from "react";

interface PostContextType {
  refreshFeed: boolean;
  triggerRefresh: () => void;
}

export const PostContext = createContext<PostContextType>({
  refreshFeed: false,
  triggerRefresh: () => {},
});

export const PostProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [refreshFeed, setRefreshFeed] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshFeed((prev) => !prev); // Toggle the flag to trigger a refresh
  }, []);

  return (
    <PostContext.Provider value={{ refreshFeed, triggerRefresh }}>
      {children}
    </PostContext.Provider>
  );
};
