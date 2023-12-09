import React from 'react'

const Card = ({ title, year, img }) => {
    return (
        <div className="relative w-48 min-w-fit h-[360px] bg-softBlack group hover:opacity-100 rounded-sm">
            <div className="w-48 h-[290px] object-cover rounded-tr-sm rounded-tl-sm">
                <img
                    src={img}
                    alt={title}
                    className="aspect-auto rounded-tr-sm rounded-tl-sm"
                />
            </div>
            <div className="flex flex-col text-gray p-3 gap-1 ">
                <p className="font-bold hover:cursor-pointer hover:text-slate-50 transition-opacity duration-150">
                    {title}
                </p>
                <span className="text-sm italic">{year}</span>
            </div>
        </div>
    )
}

export default Card
