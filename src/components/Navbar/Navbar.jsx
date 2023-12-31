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
        <div className="w-full h-28 sm:h-24 bg-softBlue fixed z-10 flex flex-col sm:flex-row gap-5 sm:justify-between px-24 items-center pt-4 sm:pt-0">
            <h1
                className="text-3xl font-black tracking-widest text-white hover:cursor-pointer hover:text-orange-300 "
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
                            className="hover:text-orange-300 text-white mx-2"
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
