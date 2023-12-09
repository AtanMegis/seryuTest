import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ openAuth, isLoggedIn, logout, setOpenAuth }) => {
    const navigate = useNavigate()

    const handleFavoriteClick = () => {
        setOpenAuth(true) // Set openAuth to true when Favorite is clicked
        navigate('/favorites')
    }

    const handleWatchlistClick = () => {
        setOpenAuth(true) // Set openAuth to true when Watchlist is clicked
        navigate('/watchlist')
    }

    return (
        <div className="max-w-full h-24 bg-softBlue sticky flex justify-between px-16 items-center ">
            <h1
                className="text-3xl font-black tracking-widest text-white hover:cursor-pointer hover:text-slate-300"
                onClick={() => {
                    navigate('/')
                }}
            >
                CINEMA
            </h1>

            <ul className="flex gap-5 text-white font-semibold">
                <li onClick={handleFavoriteClick}>Favorite</li>
                <li onClick={handleWatchlistClick}>Watchlist</li>
            </ul>
        </div>
    )
}

export default Navbar
