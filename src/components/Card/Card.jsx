import React from 'react'
import { FaSave, FaRegSave, FaHeart, FaRegHeart } from 'react-icons/fa'

import { FaKissWinkHeart } from 'react-icons/fa'
import { MdHearingDisabled } from 'react-icons/md'

const Card = ({
    title,
    year,
    img,
    isWatchlisted,
    isFavorited,
    isLoggedIn,
    addToWatchlist,
    addToFavoriteList,
    removeFromWatchlist,
    removeFromFavorite,
    redirectDetail,
}) => {
    return (
        <div className="relative w-48 min-w-fit h-[360px] bg-softBlack group hover:opacity-100 rounded-sm">
            <div className="w-48 h-[290px] object-cover rounded-tr-sm rounded-tl-sm">
                <img
                    src={img}
                    alt={title}
                    className="aspect-auto rounded-tr-sm rounded-tl-sm"
                />
                {isLoggedIn && (
                    <div className="flex gap-4 absolute -mt-[2rem] ml-[7.5rem] opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                        {isFavorited ? (
                            <FaHeart
                                className="cursor-pointer hover:text-orange-500"
                                size={20}
                                onClick={removeFromFavorite}
                            />
                        ) : (
                            <FaRegHeart
                                className="cursor-pointer hover:text-orange-500"
                                size={20}
                                onClick={addToFavoriteList}
                            />
                        )}
                        {isWatchlisted ? (
                            <FaSave
                                className="cursor-pointer hover:text-orange-500"
                                size={20}
                                onClick={removeFromWatchlist}
                            />
                        ) : (
                            <FaRegSave
                                className="cursor-pointer hover:text-orange-500"
                                size={20}
                                onClick={addToWatchlist}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col text-gray p-3 gap-1">
                <p
                    className="font-bold hover:cursor-pointer hover:text-slate-50 transition-opacity duration-150"
                    onClick={redirectDetail}
                >
                    {title}
                </p>
                <span className="text-sm italic">{year}</span>
            </div>
        </div>
    )
}

export default Card
