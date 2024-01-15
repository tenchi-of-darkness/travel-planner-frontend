import {baseApiUrl} from "@/config/base_url";

export default class UserAPI {
    static async GetUser(token: string): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/user-service/user`, {headers: {Authorization: "Bearer " + token}})
            .catch((error) => {
                console.log(error);
            });
    }

    static async SetUser(user: any, token: string): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/user-service/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        });
    }
}