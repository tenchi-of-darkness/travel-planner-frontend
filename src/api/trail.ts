import {baseApiUrl} from "@/config/base_url";

export default class TrailAPI {
    static async GetTrailById(id: number): Promise<Response> {
        return await fetch(`${baseApiUrl}/hike-service/trail/${id}/`)
            .then((res) => res.json())
            .catch((error) => {
                console.log(error);
            });
    }

    static async GetTrails(): Promise<Response> {
        return await fetch(`${baseApiUrl}/hike-service/trail?Page=1&PageSize=15`)
            .then((res) => res.json())
            .catch((error) => {
                console.log(error);
            });
    }

    static async GetUserTrails(): Promise<Response> {
        return await fetch(`${baseApiUrl}/hike-service/trail/user`)
            .then((res) => res.json())
            .catch((error) => {
                console.log(error);
            });
    }

    static async GetFavoriteTrails(): Promise<Response> {
        return await fetch(`${baseApiUrl}/hike-service/trail/favorite`)
            .then((res) => res.json())
            .catch((error) => {
                console.log(error);
            });
    }

    static async CreateTrail(trail: any): Promise<Response> {
        return await fetch(`${baseApiUrl}/hike-service/trail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trail)
        })
            .then((res) => res.json())
            .catch((error) => {
                console.log(error);
            });
    }
}