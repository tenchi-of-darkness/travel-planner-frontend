import {baseApiUrl} from "@/config/base_url";

export default class TrailAPI {
    static async GetTrailById(id: string, accessToken: string | null): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail/${id}/`, {
            method: 'GET',
            headers: !!accessToken ? {
                'Authorization': `Bearer ${accessToken}`,
            } : {}
        }).catch((error) => {
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

    static async GetFavoriteTrails(page: number, accessToken: string): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail/favorite?Page=${page}&PageSize=15`, {
            method: 'GET',
            headers: !!accessToken ? {
                'Authorization': `Bearer ${accessToken}`,
            } : {}
        }).catch((error) => {
            console.log(error);
        });
    }

    static async CreateTrail(trail: any): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/hike-service/trail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trail)
        })
            .catch((error) => {
                console.log(error);
            });
    }
}