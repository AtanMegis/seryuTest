import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaHeart, FaSave, FaRegHeart, FaRegSave } from 'react-icons/fa'
import Navbar from '../components/Navbar/Navbar.jsx'
import Auth from './Auth.jsx'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import Card from '../components/Card/Card.jsx'
import {
    API_KEY,
    BASE_URL,
    IMG_KEY,
    truncateStr,
} from '../helper/requestAPI.js'
import Cookies from 'js-cookie'

const MovieDetail = () => {
    const [movieDetail, setMovieDetail] = useState({})
    const [movieRecommendation, setmovieRecommendation] = useState([])
    const [userData, setUserData] = useState({})
    const [isWatchlisted, setIsWatchlisted] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [flag, setFlag] = useState(false)
    const [favorite, setFavorite] = useState([])
    const [watchlist, setWatchlist] = useState([])

    const movieId = useLocation().pathname.split('/')[2]
    // console.log(movieId)
    const hours = Math.floor(movieDetail.runtime / 60)
    const minutes = movieDetail.runtime % 60
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
        const getMovieDetail = async () => {
            try {
                const res = await axios.get(
                    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
                )
                setMovieDetail(res.data)
            } catch (error) {
                toast.error(error.message)
            }
        }

        const getmovieRecommendation = async () => {
            try {
                const res = await axios.get(
                    `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`
                )
                setmovieRecommendation(res.data.results)
            } catch (error) {
                toast.error(error.message)
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
                    const isFavorited = res.data.results.some(
                        (item) => item.id === parseInt(movieId)
                    )
                    setIsFavorited(isFavorited)
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
                        }/watchlist/movies?api_key=${
                            import.meta.env.VITE_API_KEY
                        }&session_id=${Cookies.get(
                            'session_id'
                        )}&language=en-US&sort_by=created_at.asc&page=1`
                    )
                    setWatchlist(res.data.results)
                    const isWatchlisted = res.data.results.some(
                        (item) => item.id === parseInt(movieId)
                    )

                    setIsWatchlisted(isWatchlisted)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        }

        getMovieDetail()
        getmovieRecommendation()
        getUserData()
        getSessionId()
        getFavorite()
        getWatchlist()
    }, [movieId, userData?.id, flag, isLoggedIn])

    const handleRoundUp = (number) => {
        if (typeof number === 'number') {
            return Number(number.toFixed(1))
        } else {
            return 0
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

    const removeFromWatchlist = async (id) => {
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
        <div className="w-full min-h-screen text-white/80">
            <Navbar
                isLoggedIn={isLoggedIn}
                openAuth={() => setIsAuthOpen(true)}
                logout={logoutSession}
            />
            <Auth
                closeModal={() => setIsAuthOpen(false)}
                openModal={isAuthOpen}
            />
            {movieDetail && movieDetail.backdrop_path && (
                <div className="w-screen h-[400px] bg-black">
                    <img
                        className="w-full max-h-max opacity-40 object-cover "
                        src={`${IMG_KEY}/${movieDetail.backdrop_path}`}
                        alt={movieDetail.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center sm:justify-left mb-[15.5rem] sm:px-24 sm:mb-[21.5rem]">
                        <div className="h-[300px] w-fit flex">
                            <img
                                className="w-[200px] h-[300px] object-cover"
                                src={`${IMG_KEY}/${movieDetail.poster_path}`}
                                alt={movieDetail.title}
                            />
                            <div className="px-5 py-6 flex-col gap-3 hidden sm:flex">
                                <p className="text-3xl font-bold">
                                    {movieDetail.title}{' '}
                                    <span className="font-normal">
                                        (
                                        {movieDetail.release_date &&
                                            movieDetail.release_date.split(
                                                '-'
                                            )[0]}
                                        )
                                    </span>
                                </p>
                                <div>
                                    <span>{movieDetail.release_date} - </span>
                                    {movieDetail.genres && (
                                        <span>
                                            {movieDetail.genres
                                                .map((genre) => genre.name)
                                                .join(', ')}{' '}
                                            -{' '}
                                        </span>
                                    )}
                                    <span>
                                        {hours}h {minutes}m
                                    </span>
                                </div>
                                <div className="flex gap-4 justify-start items-center">
                                    {handleRoundUp(movieDetail.vote_average) >=
                                    6 ? (
                                        <div className="bg-blue-500 rounded-full h-8 w-8 text-xs font-bold justify-center items-center flex">
                                            <div className="bg-white rounded-full h-6 w-6 text-xs font-bold justify-center items-center flex">
                                                <p className="text-blue-500">
                                                    {handleRoundUp(
                                                        movieDetail.vote_average
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ) : handleRoundUp(
                                          movieDetail.vote_average
                                      ) >= 4 &&
                                      handleRoundUp(movieDetail.vote_average) <=
                                          5.9 ? (
                                        <div className="bg-yellow-500 rounded-full h-8 w-8 text-xs font-bold justify-center items-center flex">
                                            <div className="bg-white rounded-full h-6 w-6 text-xs font-bold justify-center items-center flex">
                                                <p className="text-yellow-500">
                                                    {handleRoundUp(
                                                        movieDetail.vote_average
                                                    )}{' '}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-red-500 rounded-full h-8 w-8 text-xs font-bold justify-center items-center flex">
                                            <div className="bg-white rounded-full h-6 w-6 text-xs font-bold justify-center items-center flex">
                                                <p className="text-red-500">
                                                    {handleRoundUp(
                                                        movieDetail.vote_average
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-xs -ml-2">
                                        <p>User</p>
                                        <p>Score</p>
                                    </div>
                                    {isLoggedIn && (
                                        <div className="flex gap-4 transition-opacity duration-300 ease-in-out">
                                            {isWatchlisted ? (
                                                <FaSave
                                                    onClick={() =>
                                                        removeFromWatchlist(
                                                            movieId
                                                        )
                                                    }
                                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                                />
                                            ) : (
                                                <FaRegSave
                                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                                    onClick={() =>
                                                        addToWatchlist(movieId)
                                                    }
                                                />
                                            )}
                                            {isFavorited ? (
                                                <FaHeart
                                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                                    onClick={() =>
                                                        removeFromFavorite(
                                                            movieId
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <FaRegHeart
                                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                                    onClick={() =>
                                                        addToFavorite(movieId)
                                                    }
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p className="text-justify italic">
                                    {movieDetail.tagline}
                                </p>
                                <div>
                                    <p className="font-bold">Overview</p>
                                    <p className="text-justify">
                                        {movieDetail.overview}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="px-5 pt-6 flex-col gap-3 flex sm:hidden">
                <p className="text-3xl font-bold">
                    {movieDetail.title}{' '}
                    <span className="font-normal">
                        (
                        {movieDetail.release_date &&
                            movieDetail.release_date.split('-')[0]}
                        )
                    </span>
                </p>
                <div>
                    <span>{movieDetail.release_date} - </span>
                    {movieDetail.genres && (
                        <span>
                            {movieDetail.genres
                                .map((genre) => genre.name)
                                .join(', ')}{' '}
                            -{' '}
                        </span>
                    )}
                    <span>
                        {hours}h {minutes}m
                    </span>
                </div>
                <div className="flex gap-4 justify-start items-center">
                    {handleRoundUp(movieDetail.vote_average) >= 6 ? (
                        <div className="bg-blue-500 rounded-full h-8 w-8 text-xs font-bold justify-center items-center flex">
                            <div className="bg-white rounded-full h-6 w-6 text-xs font-bold justify-center items-center flex">
                                <p className="text-blue-500">
                                    {handleRoundUp(movieDetail.vote_average)}
                                </p>
                            </div>
                        </div>
                    ) : handleRoundUp(movieDetail.vote_average) >= 4 &&
                      handleRoundUp(movieDetail.vote_average) <= 5.9 ? (
                        <div className="bg-yellow-500 rounded-full h-8 w-8 text-xs font-bold justify-center items-center flex">
                            <div className="bg-white rounded-full h-6 w-6 text-xs font-bold justify-center items-center flex">
                                <p className="text-yellow-500">
                                    {handleRoundUp(movieDetail.vote_average)}{' '}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-500 rounded-full h-8 w-8 text-xs font-bold justify-center items-center flex">
                            <div className="bg-white rounded-full h-6 w-6 text-xs font-bold justify-center items-center flex">
                                <p className="text-red-500">
                                    {handleRoundUp(movieDetail.vote_average)}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="text-xs -ml-2">
                        <p>User</p>
                        <p>Score</p>
                    </div>
                    {isLoggedIn && (
                        <div className="flex gap-4 transition-opacity duration-300 ease-in-out">
                            {isWatchlisted ? (
                                <FaSave
                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                    onClick={() => removeFromWatchlist(movieId)}
                                />
                            ) : (
                                <FaRegSave
                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                    onClick={() => addToWatchlist(movieId)}
                                />
                            )}
                            {isFavorited ? (
                                <FaHeart
                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                    onClick={() => removeFromFavorite(movieId)}
                                />
                            ) : (
                                <FaRegHeart
                                    className="hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                    onClick={() => addToFavorite(movieId)}
                                />
                            )}
                        </div>
                    )}
                </div>
                <p className="text-justify italic">{movieDetail.tagline}</p>
                <div>
                    <p className="font-bold">Overview</p>
                    <p className="text-justify">{movieDetail.overview}</p>
                </div>
            </div>
            {movieRecommendation && movieRecommendation.length > 0 ? (
                <div className="px-12 sm:px-24 sm:pt-64 sm:pb-4">
                    <p className="text-3xl font-semibold pb-8 text-white/80">
                        Recommendations
                    </p>
                    <div className="flex gap-8 sm:gap-[1.64rem] w-full flex-wrap justify-center sm:justify-start">
                        {movieRecommendation.map((movie) => (
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
                                    (item) => item.id === movie?.id
                                )}
                                isWatchlisted={watchlist.some(
                                    (item) => item.id === movie?.id
                                )}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full text-center py-48 text-white font-extrabold ">
                    <p>Movie Recommendation Not Available</p>
                    <p className="text-xs pt-1">(find another movie)</p>
                </div>
            )}
            <ToastContainer />
        </div>
    )
}
export default MovieDetail
