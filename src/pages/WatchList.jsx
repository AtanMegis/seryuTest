import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import Cookies from 'js-cookie'
import Navbar from '../components/Navbar/Navbar.jsx'
import Card from '../components/Card/Card.jsx'
import {
    API_KEY,
    BASE_URL,
    IMG_KEY,
    truncateStr,
} from '../helper/requestAPI.js'

const WatchList = () => {
    const [watchlist, setWatchlist] = useState([])
    const [favorite, setFavorite] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [userData, setUserData] = useState({})
    const [updateFlag, setUpdateFlag] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const getSessionId = async () => {
            Cookies.get('session_id') && setIsLoggedIn(true)
        }

        const getUserData = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get(
                        `https://api.themoviedb.org/3/account?api_key=${
                            import.meta.env.VITE_API_KEY
                        }&session_id=${Cookies.get('session_id')}`
                    )

                    setUserData(response.data)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }

        const getFavorite = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get(
                        `https://api.themoviedb.org/3/account/${
                            userData.id
                        }/favorite/movies?api_key=${
                            import.meta.env.VITE_API_KEY
                        }&session_id=${Cookies.get(
                            'session_id'
                        )}&language=en-US&sort_by=created_at.asc&page=1`
                    )
                    setFavorite(response.data.results)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }

        const getWatchlist = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axios.get(
                        `https://api.themoviedb.org/3/account/${
                            userData.id
                        }/watchlist/movies?api_key=${
                            import.meta.env.VITE_API_KEY
                        }&session_id=${Cookies.get(
                            'session_id'
                        )}&language=en-US&sort_by=created_at.asc&page=1`
                    )

                    setWatchlist(response.data.results)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }

        getUserData()
        getSessionId()
        getFavorite()
        getWatchlist()
    }, [isLoggedIn, userData.id, updateFlag])

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
            setUpdateFlag(!updateFlag)
        }
    }

    const addToFavorite = async (id) => {
        try {
            const response = await axios.post(
                `https://api.themoviedb.org/3/account/${
                    userData.id
                }/favorite?api_key=${
                    import.meta.env.VITE_API_KEY
                }&session_id=${Cookies.get('session_id')}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    favorite: true,
                }
            )
            toast.success(response.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUpdateFlag(!updateFlag)
        }
    }

    const addToWatchlist = async (id) => {
        try {
            const response = await axios.post(
                `https://api.themoviedb.org/3/account/${
                    userData.id
                }/watchlist?api_key=${
                    import.meta.env.VITE_API_KEY
                }&session_id=${Cookies.get('session_id')}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    watchlist: true,
                }
            )
            toast.success(response.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUpdateFlag(!updateFlag)
        }
    }

    const removeFromFavorite = async (id) => {
        try {
            const response = await axios.post(
                `https://api.themoviedb.org/3/account/${
                    userData.id
                }/favorite?api_key=${
                    import.meta.env.VITE_API_KEY
                }&session_id=${Cookies.get('session_id')}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    favorite: false,
                }
            )
            toast.success(response.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUpdateFlag(!updateFlag)
        }
    }

    const removeFromWatchlist = async (id) => {
        try {
            const response = await axios.post(
                `https://api.themoviedb.org/3/account/${
                    userData.id
                }/watchlist?api_key=${
                    import.meta.env.VITE_API_KEY
                }&session_id=${Cookies.get('session_id')}`,
                {
                    media_type: 'movie',
                    media_id: id,
                    watchlist: false,
                }
            )
            toast.success(response.data.status_message)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUpdateFlag(!updateFlag)
        }
    }

    return (
        <div className="w-screen min-h-screen">
            <Navbar isLoggedIn={isLoggedIn} logout={logoutSession} />
            <div className="w-full h-full sm:px-24 pt-32 px-16">
                <h2 className="flex justify-center  sm:justify-start text-2xl sm:text-3xl font-semibold pb-5 text-white/80">
                    Watchlist
                </h2>
                <div className="content-div sm:justify-start justify-center">
                    {watchlist.map((movie) => {
                        return (
                            <Card
                                key={movie?.id}
                                title={truncateStr(movie?.title, 16)}
                                img={`${IMG_KEY}/${movie?.poster_path}`}
                                year={movie?.release_date}
                                addToFavoriteList={() =>
                                    addToFavorite(movie?.id)
                                }
                                addToWatchlist={() => addToWatchlist(movie?.id)}
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
                                    (item) => item === movie?.id
                                )}
                                isWatchlisted={watchlist.some(
                                    (item) => item.id === movie?.id
                                )}
                            />
                        )
                    })}
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default WatchList
