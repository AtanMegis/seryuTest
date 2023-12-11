import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
export const API_KEY = import.meta.env.VITE_API_KEY
export const BASE_URL = import.meta.env.VITE_BASE_URL
export const BASE_AUTH = import.meta.env.VITE_AUTH_URL
export const IMG_KEY = import.meta.env.VITE_IMG

export const requestAPI = {
    requestNowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
    requestTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
}

export const searchMovie = async (q) => {
    const search = await axios.get(
        `${BASE_URL}/search/movie?query=${q}&api_key=${API_KEY}&language=en-US&page=1`
    )
    return search.data
}

export const truncateStr = (text, limit) => {
    if (text.length > limit) {
        return text.slice(0, limit) + '...'
    } else return text
}

export const logoutSession = async (setIsLoggedIn, setUpdateFlag) => {
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
        console.error(error)
    } finally {
        setUpdateFlag((prevFlag) => !prevFlag)
    }
}

export const addToFavorite = async (id, setFlag) => {
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
        setFlag((prevFlag) => !prevFlag)
    }
}
