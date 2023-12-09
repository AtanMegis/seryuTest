import React, { useState } from 'react'
import { API_KEY, BASE_AUTH, BASE_URL } from '../helper/requestAPI.js'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import logo from '../assets/logo.png'
import axios from 'axios'

const Auth = ({ closeModal, openModal }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [reqToken, setReqToken] = useState('')
    const [loadingMsg, setLoadingMsg] = useState('')
    const [isAuth, setIsAuth] = useState(null)

    const login = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/authentication/token/new?api_key=${API_KEY}`
            )
            const dataToken = res.data.request_token
            setReqToken(dataToken)
            window.open(`${BASE_AUTH}/${dataToken}`, '_blank')
            setLoadingMsg('Pending Authorization')
            setIsLoading(true)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const authenticatedHandler = () => {
        setIsLoaded(true)
        setIsLoading(false)
    }

    const verifyHandler = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/authentication/session/new?request_token=${reqToken}&api_key=${API_KEY}`
            )
            setIsAuth(true)
            setIsLoading(true)
            setLoadingMsg('Verification Succesfull')
            const expiredTime = new Date(new Date().getTime() + 30 * 60 * 1000)
            Cookies.set('session_id', res.data.session_id, {
                expires: expiredTime,
            })
        } catch (error) {
            setIsAuth(false)
            setIsLoading(true)
            setLoadingMsg('Failed to Authenticated')
            toast.error(error.message)
            console.log({ error: error.message })
        } finally {
            setTimeout(() => {
                setIsLoading(false)
                closeModal()
                window.location.reload()
            }, 1000)
        }
    }

    return (
        <>
            {openModal ? (
                <div className="fixed inset-0 flex flex-col justify-center items-center z-50 bg-black backdrop-blur-md bg-opacity-50">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center w-48 p-4 gap-2 bg-white rounded-lg">
                            <img
                                src={logo}
                                alt="TMDB Logo"
                                className="w-full h-full"
                            />
                            <p className="text-black text-center">
                                {loadingMsg}
                            </p>
                        </div>
                    ) : (
                        <>
                            {isLoaded ? (
                                <div
                                    className="flex flex-col justify-center items-center w-48 p-4 gap-2 bg-white rounded-lg hover:scale-105 transition ease-in-out duration-100 hover:cursor-pointer"
                                    onClick={() => verifyHandler()}
                                >
                                    <img
                                        src={logo}
                                        alt="TMDB Logo"
                                        className="w-full h-full"
                                    />
                                    <p className="text-black text-center">
                                        Verify Data !
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col justify-center items-center w-48 p-4 gap-2 bg-white rounded-lg hover:scale-105 transition ease-in-out duration-100 hover:cursor-pointer"
                                    onClick={() => login()}
                                >
                                    <img
                                        src={logo}
                                        alt="TMDB Logo"
                                        className="w-full h-full"
                                    />
                                    <p className="text-black text-center">
                                        Login with TMBD
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    {isLoading ? (
                        <>
                            {isAuth == null || isAuth ? (
                                <p
                                    className="text-white text-xs pt-6 hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                    onClick={authenticatedHandler}
                                >
                                    {loadingMsg === 'Pending Authorization'
                                        ? 'Click here to continue'
                                        : null}
                                </p>
                            ) : null}
                        </>
                    ) : (
                        <>
                            {isLoaded ? (
                                <p
                                    className="text-white text-xs pt-6 hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                    onClick={() => {
                                        setIsLoaded(false)
                                        setIsAuth(null)
                                    }}
                                >
                                    Cancel
                                </p>
                            ) : (
                                <p
                                    className="text-white text-xs pt-6 hover:cursor-pointer hover:opacity-50 transition duration-100 ease-in-out"
                                    onClick={closeModal}
                                >
                                    Close
                                </p>
                            )}
                        </>
                    )}
                </div>
            ) : null}
        </>
    )
}
export default Auth
