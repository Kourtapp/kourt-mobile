/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistanceKm(
    lat1: number | null | undefined,
    lon1: number | null | undefined,
    lat2: number | null | undefined,
    lon2: number | null | undefined
): number | null {
    if (lat1 === null || lat1 === undefined || lon1 === null || lon1 === undefined ||
        lat2 === null || lat2 === undefined || lon2 === null || lon2 === undefined) {
        return null;
    }

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted string like "2.5 km" or "500 m"
 */
export function formatDistance(distanceKm: number | null): string {
    if (distanceKm === null) {
        return '-- km';
    }

    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }

    return `${distanceKm.toFixed(1)} km`;
}

/**
 * Check if a point is within a radius
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @param targetLat Target's latitude
 * @param targetLon Target's longitude
 * @param radiusKm Radius in kilometers
 * @returns true if within radius, false otherwise
 */
export function isWithinRadius(
    userLat: number | null | undefined,
    userLon: number | null | undefined,
    targetLat: number | null | undefined,
    targetLon: number | null | undefined,
    radiusKm: number
): boolean {
    const distance = calculateDistanceKm(userLat, userLon, targetLat, targetLon);
    if (distance === null) {
        return true; // Include if we can't calculate distance
    }
    return distance <= radiusKm;
}
