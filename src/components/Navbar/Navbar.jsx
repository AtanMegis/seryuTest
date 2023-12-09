import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdLogout } from 'react-icons/md'

const Navbar = ({ openAuth, isLoggedIn, logout }) => {
    const navigate = useNavigate()

    const handleFavoriteClick = () => {
        isLoggedIn ? navigate('/favorites') : openAuth()
    }

    const handleWatchlistClick = () => {
        isLoggedIn ? navigate('/watchlist') : openAuth()
    }

    return (
        <div className="max-w-full h-24 bg-softBlue sticky flex justify-between px-24 items-center ">
            <h1
                className="text-3xl font-black tracking-widest text-white hover:cursor-pointer hover:text-slate-300"
                onClick={() => {
                    navigate('/')
                }}
            >
                CINEMA
            </h1>

            <ul className="flex gap-5 text-white font-semibold  items-center">
                {isLoggedIn ? (
                    <>
                        <li onClick={handleFavoriteClick}>Favorite</li>
                        <li onClick={handleWatchlistClick}>Watchlist</li>
                        <button
                            onClick={logout}
                            className="hover:text-slate-300 text-white mx-2"
                        >
                            <MdLogout size={22} />
                        </button>
                    </>
                ) : (
                    <>
                        <li onClick={openAuth}>Favorite</li>
                        <li onClick={openAuth}>Watchlist</li>
                    </>
                )}
            </ul>
        </div>
    )
}

export default Navbar
