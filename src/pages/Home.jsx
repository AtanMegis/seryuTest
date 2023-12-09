import { useEffect, useState } from 'react'
import MovieList from '../components/Content/MovieList.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import Auth from './Auth.jsx'
import { BASE_URL, API_KEY, BASE_AUTH } from '../helper/requestAPI.js'

const Home = () => {
  const [userData, setUserData] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  useEffect(() => {
    const getSessionId = async () => {
      Cookies.get("session_id") && setIsLoggedIn(true);
    };

    const getUserData = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get(
            `${BASE_URL}/account?api_key=${API_KEY}&session_id=${Cookies.get("session_id")}`
          );
          setUserData(response.data);
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    const getNowPlaying = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US&page=1`
        );
        setNowPlaying(response.data.results);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const getTopRated = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${
            import.meta.env.VITE_API_KEY
          }&language=en-US&page=1`
        );
        setTopRated(response.data.results);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const getFavorite = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/account/${
              userData.id
            }/favorite/movies?api_key=${
              import.meta.env.VITE_API_KEY
            }&session_id=${Cookies.get(
              "session_id"
            )}&language=en-US&sort_by=created_at.asc&page=1`
          );
          setFavorite(response.data.results);
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    const getWatchlist = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/account/${
              userData.id
            }/watchlist/movies?api_key=${
              import.meta.env.VITE_API_KEY
            }&session_id=${Cookies.get(
              "session_id"
            )}&language=en-US&sort_by=created_at.asc&page=1`
          );
          setWatchlist(response.data.results);
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    getUserData();
    getSessionId();
    getNowPlaying();
    getTopRated();
    getFavorite();
    getWatchlist();
  }, [isLoggedIn, userData.id, updateFlag]);
  


  return (
        <div className="w-screen min-h-screen">
            <Navbar isLoggedIn={} logout={} openAuth={}/>
            <Auth closeModal={} openModal={}/> 
            <MovieList />
        </div>
    )
}

export default Home
