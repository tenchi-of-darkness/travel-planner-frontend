import {baseApiUrl} from "@/config/base_url";

export default class TrailAPI {
    static async GetTrailById(id: string): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail/${id}/`)
            .catch((error) => {
                console.log(error);
            });
    }

    static async GetTrails(page: number): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail?Page=${page}&PageSize=15`)
            .catch((error) => {
                console.log(error);
            });
    }

    static async GetUserTrails(): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail/user`)
            .catch((error) => {
                console.log(error);
            });
    }

    static async GetFavoriteTrails(): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail/favorite`)
            .catch((error) => {
                console.log(error);
            });
    }

    static async CreateTrail(trail: any): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trail)
        })
            .catch((error) => {
                console.log(error);
            });
    }
}