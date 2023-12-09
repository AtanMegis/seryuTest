import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-center h-screen bg-softBlack text-white/80">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
                <p className="text-lg">
                    Oops! The page you are looking for does not exist.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-8 px-4 py-2 bg-softBlue hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Go back to Home
                </button>
            </div>
        </div>
    )
}

export default NotFound
