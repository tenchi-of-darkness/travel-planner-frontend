import React from "react";

const cardStyle = {
  border: '',
};

interface CardProps{
    title: string,
    description: string,
    locationName: string
}

const CardComponent: React.FC<CardProps> = ({title, description}) => {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-black">{title}</h2>
            <p className=" mt-2 text-black opacity-70">{description}</p>
        </div>
    );
};

export default CardComponent;