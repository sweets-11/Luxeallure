import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/api/userAPI";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { RootState } from "../redux/store";
import { User } from "../types/types";

const useFetchUser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(userExist(JSON.parse(storedUser)));
    } else {
      dispatch(userNotExist());
    }
    setInitialLoad(false);
  }, [dispatch]);

  useEffect(() => {
    const fetchUser = async (user: User | null) => {
      if (user && !hasFetched) {
        try {
          const data = await getUser(user._id);
          dispatch(userExist(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
          setHasFetched(true);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          dispatch(userNotExist());
        }
      } else if (!user) {
        dispatch(userNotExist());
        localStorage.removeItem("user");
      }
    };

    if (!initialLoad && user && !hasFetched) {
      fetchUser(user);
    }
  }, [user, initialLoad, hasFetched, dispatch]);
};

export default useFetchUser;
