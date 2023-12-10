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
const FavoritedList = () => {
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

        const getFavorite = async () => {
            if (isLoggedIn) {
                try {
                    const res = await axios.get(
                        `${BASE_URL}/account/${
                            userData.id
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
                            userData.id
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
            setUpdateFlag(!updateFlag)
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
            setUpdateFlag(!updateFlag)
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
            setUpdateFlag(!updateFlag)
        }
    }

    const removeFromWatchlist = async (id) => {
        try {
            const res = await axios.post(
                `${BASE_URL}/account/${
                    userData.id
                }/watchlist?api_key=${API_KEYI}&session_id=${Cookies.get(
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
            setUpdateFlag(!updateFlag)
        }
    }

    return (
        <div className="w-screen min-h-screen">
            <Navbar isLoggedIn={isLoggedIn} logout={logoutSession} />
            <div className="px-12 sm:px-24 py-12  text-white/90">
                <p className="text-3xl font-semibold pb-8 pt-16">
                    Favorite List
                </p>
                <div className="flex gap-8 sm:gap-[1.64rem] w-full flex-wrap justify-center sm:justify-start">
                    {favorite?.map((movie) => (
                        <Card
                            key={movie?.id}
                            title={truncateStr(movie?.title, 16)}
                            img={`${IMG_KEY}/${movie?.poster_path}`}
                            year={movie?.release_date}
                            addToFavoriteList={() => addToFavorite(movie?.id)}
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
                                (item) => item.id === movie?.id
                            )}
                            isWatchlisted={watchlist.some(
                                (item) => item.id === movie?.id
                            )}
                        />
                    ))}
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default FavoritedList
