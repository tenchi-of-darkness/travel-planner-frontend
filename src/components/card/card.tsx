import React, {HTMLAttributes} from "react";

import {
    Card as InnerCard,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const cardStyle = {
  border: '',
};

type CardProps = {
    title: string,
    description: string,
    locationName: string
} & HTMLAttributes<HTMLDivElement>

const Card: React.FC<CardProps> = (props) => {
    return (
        <InnerCard {...props}>
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>{props.locationName}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{props.description}</p>
            </CardContent>
        </InnerCard>
        // <div className="bg-white shadow-md p-4 rounded-lg">
        //     <h2 className="text-xl font-semibold text-black">{title} - {locationName}</h2>
        //     <p className=" mt-2 text-black opacity-70">{description}</p>
        // </div>
    );
};

export default Card;