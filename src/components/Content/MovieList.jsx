import { useEffect, useState } from 'react'
import axios from 'axios'
import { requestAPI, searchMovie } from '../../helper/requestAPI.js'
import { toast } from 'react-toastify'
import Card from '../Card/Card.jsx'

const IMG_KEY = import.meta.env.VITE_IMG

const MovieList = () => {
    const [nowPlaying, setNowPlaying] = useState([])
    const [topRated, setTopRated] = useState([])
    const [findMovie, setFindMovie] = useState([])
    const [searchInput, setSearchInput] = useState('')

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

    useEffect(() => {
        getNowPlaying()
        getTopRated()
    }, [])

    const handleSearch = async (q) => {
        setSearchInput(q)
        if (q.length >= 1) {
            const query = await searchMovie(q)
            setFindMovie(query.results)
        } else {
            setFindMovie([])
        }
    }

    const truncateStr = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + '...'
        } else return text
    }

    return (
        <>
            <div className="w-full h-full px-24 pt-12">
                {/* SearchBar Handler */}
                <input
                    placeholder="Find movies..."
                    className="w-full h-12 px-4 rounded-md mb-6 bg-white/90"
                    value={searchInput}
                    onChange={({ target }) => handleSearch(target.value)}
                />

                {/* Searched Movie Handler */}
                {searchInput.length > 0 && findMovie.length > 0 && (
                    <div className="pt-4">
                        <h2 className="text-3xl font-semibold pb-4 text-white/80">
                            Searched Movie
                        </h2>
                        <div className="content-div">
                            {findMovie.map((item) => (
                                <Card
                                    key={item?.id}
                                    title={truncateStr(item?.title, 16)}
                                    img={`${IMG_KEY}/${item?.poster_path}`}
                                    year={item?.release_date}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Now Playing Handler */}
                {searchInput.length === 0 && nowPlaying.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-semibold pb-4 text-white/80">
                            Now Playing
                        </h2>
                        <div className="content-div_scroll">
                            {nowPlaying?.map((item) => (
                                <Card
                                    key={item?.id}
                                    title={truncateStr(item?.title, 15)}
                                    img={`${IMG_KEY}/${item?.poster_path}`}
                                    year={item?.release_date}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Rated Handler */}
                {searchInput.length === 0 && topRated.length > 0 && (
                    <div className="pt-6">
                        <h2 className="text-3xl font-semibold pb-4 text-white/80">
                            Top Rated
                        </h2>
                        <div className="content-div">
                            {/* Render top rated movies */}
                            {topRated?.map((item) => (
                                <Card
                                    key={item?.id}
                                    title={truncateStr(item?.title, 15)}
                                    img={`${IMG_KEY}/${item?.poster_path}`}
                                    year={item?.release_date}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default MovieList
