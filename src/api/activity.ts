import {baseApiUrl} from "@/config/base_url";

export default class ActivityAPI {
    static async GetActivityById(id: string): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/activity-service/activity/${id}/`)
            .catch((error) => {
                console.log(error);
            });
    }

    static async GetActivities(page: number): Promise<Response | void> {
        return await fetch(`${baseApiUrl}/activity-service/activity?Page=${page}&PageSize=15`)
            .catch((error) => {
                console.log(error);
            });
    }
}