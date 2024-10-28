import { apiRequest } from './api';
import { RouteMarker } from '../../components/mapbox/MapRouteMarkers';

export const fetchRecommendations = async (groupID: number): Promise<RouteMarker[]> => {
    try {
        const coordinates = await apiRequest<any>(
            `https://moneygement-api.o-r.kr/api/recommend/group/${groupID}`,
            'GET'
        );

        const routeMarkerData = extractPointList(coordinates);
        console.log("Recommendations : ", routeMarkerData);
        return routeMarkerData;
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        throw error;
    }
};

export const extractPointList = (data: any): RouteMarker[] => {
    if (data && Array.isArray(data)) {
        return data.map((point: any) => ({
            name: point.name,
            latitude: point.latitude,
            longitude: point.longitude,
            category: point.category
        }));
    } else {
        console.error("Invalid data format: Expected an array");
        return [];
    }
};