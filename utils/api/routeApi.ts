import { apiRequest } from './api';

export const fetchRoute = async (points: number[][]): Promise<number[][]> => {
    try {
        const route = await apiRequest<number[][]>(
            'https://moneygement-api.o-r.kr/api/route',
            'POST',
            {},
            {
                points,
            }
        );
        console.log("Route : ", route);
        return route;
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
};