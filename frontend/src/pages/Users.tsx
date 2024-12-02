import {
  IonAvatar,
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonList,
  IonPage,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import MainHeader from "../components/MainHeader";
import { fetchUsers } from "../api/user";

const Users: React.FC = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;
  const router = useIonRouter();

  const loadUsers = async (searchQuery: string, currentPage: number) => {
    try {
      const fetchedUsers = await fetchUsers(searchQuery, currentPage, LIMIT);
      if (fetchedUsers.length < LIMIT) setHasMore(false);
      setUsers((prev) =>
        currentPage === 1 ? fetchedUsers : [...prev, ...fetchedUsers]
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    loadUsers(query, 1); // Reset to page 1 when search query changes
  }, [query]);

  const loadMore = async (event: CustomEvent<void>) => {
    const target = event.target as HTMLIonInfiniteScrollElement | null;
    if (!target) {
      console.error("Infinite scroll target is null");
      return;
    }

    if (hasMore) {
      const nextPage = page + 1;
      try {
        await loadUsers(query, nextPage);
        setPage(nextPage);
      } catch (error) {
        console.error("Error loading more users:", error);
      }
    }
    target.complete(); // Signal that the loading is finished

    if (!hasMore) {
      target.disabled = true; // Disable infinite scroll if no more data
    }
  };
  const handleSearch = (e: Event) => {
    const target = e.target as HTMLIonSearchbarElement;
    setQuery(target.value || "");
    setPage(1);
    setHasMore(true); // Reset for new search
  };

  return (
    <IonPage>
      <MainHeader title="Users" />
      <IonContent className="ion-padding">
        <IonSearchbar
          animated
          placeholder="Search Users"
          showClearButton="focus"
          debounce={1000}
          onIonInput={(e) => handleSearch(e)}
        ></IonSearchbar>

        <IonList lines="none">
          {users.map((user) => (
            <IonItem
              key={user.id}
              onClick={() => {
                router.push(`/users/${user.id}`, "forward");
              }}
            >
              <div className="inline-flex items-center mb-2 py-1 rounded-3xl pr-2 text-primary hover:bg-primary hover:text-light cursor-pointer">
                <IonAvatar className="w-6 h-6 ">
                  <img
                    src={user.profilePicture || "default-profile-pic.jpg"}
                    alt={user.username}
                  />
                </IonAvatar>

                <h1 className="text-xl font-bold ml-2">{user.username}</h1>
              </div>
            </IonItem>
          ))}
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={(e: CustomEvent<void>) => loadMore(e)}
          threshold="100px"
          disabled={!hasMore}
        >
          <IonInfiniteScrollContent
            loadingText="Loading more users..."
            loadingSpinner="circular"
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};
export default Users;
