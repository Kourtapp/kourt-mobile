import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { logger } from '../utils/logger';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface UseLocationResult {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

// Default location (São Paulo center) for when permission is denied
const DEFAULT_LOCATION: LocationData = {
  latitude: -23.5505,
  longitude: -46.6333,
};

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      return status === 'granted';
    } catch (err) {
      logger.error('[useLocation] Error requesting location permission:', err);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Use default location on web (location API may not work reliably)
      if (Platform.OS === 'web') {
        setLocation(DEFAULT_LOCATION);
        setLoading(false);
        return;
      }

      // Check permission status
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        // Use default location if permission not granted
        setLocation(DEFAULT_LOCATION);
        setError('Permissão de localização não concedida');
        return;
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? undefined,
      });
    } catch (err) {
      logger.error('[useLocation] Error getting location:', err);
      setError('Não foi possível obter sua localização');
      setLocation(DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLocation = useCallback(async (): Promise<void> => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
  };
}

export function useWatchLocation(): UseLocationResult & { watching: boolean } {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [watching, setWatching] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      return status === 'granted';
    } catch (err) {
      logger.error('[useLocation] Error requesting location permission:', err);
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async (): Promise<void> => {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? undefined,
      });
    } catch (err) {
      logger.error('[useLocation] Error refreshing location:', err);
    }
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        setLoading(true);

        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus(status);

        if (status !== 'granted') {
          setLocation(DEFAULT_LOCATION);
          setError('Permissão de localização não concedida');
          setLoading(false);
          return;
        }

        // Get initial location
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy ?? undefined,
        });

        setLoading(false);

        // Start watching
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50, // Update every 50 meters
            timeInterval: 10000, // Or every 10 seconds
          },
          (newPosition) => {
            setLocation({
              latitude: newPosition.coords.latitude,
              longitude: newPosition.coords.longitude,
              accuracy: newPosition.coords.accuracy ?? undefined,
            });
          }
        );

        setWatching(true);
      } catch (err) {
        logger.error('[useLocation] Error watching location:', err);
        setError('Não foi possível monitorar sua localização');
        setLocation(DEFAULT_LOCATION);
        setLoading(false);
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
        setWatching(false);
      }
    };
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    requestPermission,
    refreshLocation,
    watching,
  };
}

// Utility function to calculate distance between two points
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
}
