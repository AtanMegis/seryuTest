import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Auth from './Auth.jsx'
import axios from 'axios'
import {
    API_KEY,
    BASE_URL,
    requestAPI,
    searchMovie,
    IMG_KEY,
    truncateStr,
} from '../helper/requestAPI.js'
import { ToastContainer, toast } from 'react-toastify'
import Card from '../components/Card/Card.jsx'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Home = () => {
    const navigate = useNavigate()
    const [nowPlaying, setNowPlaying] = useState([])
    const [topRated, setTopRated] = useState([])
    const [findMovie, setFindMovie] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [userData, setUserData] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [favorite, setFavorite] = useState([])
    const [watchlist, setWatchlist] = useState([])
    const [flag, setFlag] = useState(false)

    useEffect(() => {
        const getSessionId = async () => {
            Cookies.get('session_id') && setIsLoggedIn(true)
        }

        const getUserData = async () => {
            if (isLoggedIn) {
                try {
                    const res = await axios.get(
                        `${BASE_URL}/account?api_key=${API_KEY}&session_id=${Cookies.get(
                            'session_id'
                        )}`
                    )
                    setUserData(res.data)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }
        const getNowPlaying = async () => {
            try {
                const res = await axios.get(requestAPI.requestNowPlaying)
                const data = await res.data.results
                setNowPlaying(data)
            } catch (error) {
                toast.error(error.message)
            }
        }

        const getTopRated = async () => {
            try {
                const res = await axios.get(requestAPI.requestTopRated)
                const data = await res.data.results
                setTopRated(data)
            } catch (error) {
                toast.error(error.message)
            }
        }

        const getFavorite = async () => {
            if (isLoggedIn) {
                try {
                    const res = await axios.get(
                        `${BASE_URL}/account/${
                            userData?.id
                        }/favorite/movies?api_key=${API_KEY}&session_id=${Cookies.get(
                            'session_id'
                        )}&language=en-US&sort_by=created_at.asc&page=1`
                    )
                    setFavorite(res.data.results)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }

        const getWatchlist = async () => {
            if (isLoggedIn) {
                try {
                    const res = await axios.get(
                        `${BASE_URL}/account/${
                            userData?.id
                        }/watchlist/movies?api_key=${API_KEY}&session_id=${Cookies.get(
                            'session_id'
                        )}&language=en-US&sort_by=created_at.asc&page=1`
                    )
                    setWatchlist(res.data.results)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }
        getNowPlaying()
        getTopRated()
        getUserData()
        getSessionId()
        getFavorite()
        getWatchlist()

        if (isLoggedIn && userData?.id) {
            getFavorite()
            getWatchlist()
        }
    }, [isLoggedIn, flag, userData?.id])

    const addToFavorite = async (id) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/account/${
                    userData.id
                }/favorite?api_key=${API_KEY}&session_id=${Cookies.get(
                    'session_id'
                )}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    favorite: true,
                }
            )
            toast.success(res.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setFlag(!flag)
        }
    }

    const addToWatchlist = async (id) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/account/${
                    userData.id
                }/watchlist?api_key=${API_KEY}&session_id=${Cookies.get(
                    'session_id'
                )}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    watchlist: true,
                }
            )
            toast.success(res.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setFlag(!flag)
        }
    }
    const removeFromFavorite = async (id) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/account/${
                    userData.id
                }/favorite?api_key=${API_KEY}&session_id=${Cookies.get(
                    'session_id'
                )}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    favorite: false,
                }
            )

            toast.success(res.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setFlag(!flag)
        }
    }

    const removeFromWatchlist = async (id) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/account/${
                    userData?.id
                }/watchlist?api_key=${API_KEY}&session_id=${Cookies.get(
                    'session_id'
                )}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    watchlist: false,
                }
            )
            toast.success(res.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setFlag(!flag)
        }
    }

    const handleSearch = async (q) => {
        setSearchInput(q)
        if (q.length >= 1) {
            const query = await searchMovie(q)
            setFindMovie(query.results)
        } else {
            setFindMovie([])
        }
    }

    const logoutSession = async () => {
        try {
            await axios.delete(
                `${BASE_URL}/authentication/session?api_key=${API_KEY}`,
                {
                    data: {
                        session_id: Cookies.get('session_id'),
                    },
                }
            )
            Cookies.remove('session_id')
            setIsLoggedIn(false)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setFlag(!flag)
        }
    }
    return (
        <>
            <div className="w-screen min-h-screen">
                <Navbar
                    isLoggedIn={isLoggedIn}
                    openAuth={() => setIsAuthOpen(true)}
                    logout={logoutSession}
                />
                <Auth
                    closeModal={() => setIsAuthOpen(false)}
                    openModal={isAuthOpen}
                />
                <div className="w-full h-full sm:px-24 pt-12 px-16">
                    {/* SearchBar Handler */}
                    <input
                        placeholder="Find movies..."
                        className="w-full h-12 px-4 rounded-md mb-6 mt-20 bg-white/90"
                        value={searchInput}
                        onChange={({ target }) => handleSearch(target.value)}
                    />

                    {/* Searched Movie Handler */}
                    {searchInput.length > 0 && findMovie.length > 0 && (
                        <div className="pt-4">
                            <h2 className="flex justify-center  sm:justify-start text-2xl sm:text-3xl font-semibold pb-4 text-white/80">
                                Searched Movie
                            </h2>
                            <div className="content-div sm:justify-start justify-center">
                                {findMovie.map((movie) => (
                                    <Card
                                        key={movie?.id}
                                        title={truncateStr(movie?.title, 16)}
                                        img={`${IMG_KEY}/${movie?.poster_path}`}
                                        year={movie?.release_date}
                                        addToFavoriteList={() =>
                                            addToFavorite(movie?.id)
                                        }
                                        addToWatchlist={() =>
                                            addToWatchlist(movie?.id)
                                        }
                                        removeFromFavorite={() =>
                                            removeFromFavorite(movie?.id)
                                        }
                                        removeFromWatchlist={() =>
                                            removeFromWatchlist(movie?.id)
                                        }
                                        isLoggedIn={isLoggedIn}
                                        redirectDetail={() =>
                                            navigate(`/movie/${movie?.id}`)
                                        }
                                        isFavorited={favorite.some(
                                            (item) => item.id === movie?.id
                                        )}
                                        isWatchlisted={watchlist.some(
                                            (item) => item.id === movie?.id
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Now Playing Handler */}
                    {searchInput.length === 0 && nowPlaying.length > 0 && (
                        <div className="w-full ">
                            <h2 className="flex justify-center  sm:justify-start text-2xl sm:text-3xl font-semibold pb-4 text-white/80">
                                Now Playing
                            </h2>
                            <div className="content-div_scroll">
                                {nowPlaying?.map((movie) => (
                                    <Card
                                        key={movie?.id}
                                        title={truncateStr(movie?.title, 16)}
                                        img={`${IMG_KEY}/${movie?.poster_path}`}
                                        year={movie?.release_date}
                                        addToFavoriteList={() =>
                                            addToFavorite(movie?.id)
                                        }
                                        addToWatchlist={() =>
                                            addToWatchlist(movie?.id)
                                        }
                                        removeFromFavorite={() =>
                                            removeFromFavorite(movie?.id)
                                        }
                                        removeFromWatchlist={() =>
                                            removeFromWatchlist(movie?.id)
                                        }
                                        isLoggedIn={isLoggedIn}
                                        redirectDetail={() =>
                                            navigate(`/movie/${movie?.id}`)
                                        }
                                        isFavorited={favorite.some(
                                            (item) => item.id === movie?.id
                                        )}
                                        isWatchlisted={watchlist.some(
                                            (item) => item.id === movie?.id
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Rated Handler */}
                    {searchInput.length === 0 && topRated.length > 0 && (
                        <div className="pt-6">
                            <h2 className="flex justify-center  sm:justify-start text-2xl sm:text-3xl font-semibold pb-4 text-white/80">
                                Top Rated
                            </h2>
                            <div className="content-div sm:justify-start justify-center">
                                {topRated?.map((movie) => (
                                    <Card
                                        key={movie?.id}
                                        title={truncateStr(movie?.title, 16)}
                                        img={`${IMG_KEY}/${movie?.poster_path}`}
                                        year={movie?.release_date}
                                        addToFavoriteList={() =>
                                            addToFavorite(movie?.id)
                                        }
                                        addToWatchlist={() =>
                                            addToWatchlist(movie?.id)
                                        }
                                        removeFromFavorite={() =>
                                            removeFromFavorite(movie?.id)
                                        }
                                        removeFromWatchlist={() =>
                                            removeFromWatchlist(movie?.id)
                                        }
                                        isLoggedIn={isLoggedIn}
                                        redirectDetail={() =>
                                            navigate(`/movie/${movie?.id}`)
                                        }
                                        isFavorited={favorite.some(
                                            (item) => item.id === movie?.id
                                        )}
                                        isWatchlisted={watchlist.some(
                                            (item) => item.id === movie?.id
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <ToastContainer />
            </div>
        </>
    )
}

export default Home
