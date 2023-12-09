import axios from 'axios'
export const API_KEY = import.meta.env.VITE_API_KEY
export const BASE_URL = import.meta.env.VITE_BASE_URL
export const BASE_AUTH = import.meta.env.VITE_AUTH_URL

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
