import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import FavoritedList from './pages/FavoritedList.jsx'
import WatchList from './pages/WatchList.jsx'
import MovieDetail from './pages/MovieDetail.jsx'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const getSessionId = async () => {
            Cookies.get('session_id') && setIsLoggedIn(true)
        }
        getSessionId()
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                {isLoggedIn && (
                    <>
                        <Route path="/favorites" element={<FavoritedList />} />
                        <Route path="/watchlist" element={<WatchList />} />
                    </>
                )}
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
