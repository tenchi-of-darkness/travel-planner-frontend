import React from "react";

const cardStyle = {
  border: '',
};

interface CardProps{
    title: string,
    description: string,
    locationName: string
}

const Card: React.FC<CardProps> = ({title, description, locationName}) => {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-black">{title} - {locationName}</h2>
            <p className=" mt-2 text-black opacity-70">{description}</p>
        </div>
    );
};

export default Card;