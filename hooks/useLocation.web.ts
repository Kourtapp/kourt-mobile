import { useState, useEffect, useCallback } from 'react';
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
  permissionStatus: 'granted' | 'denied' | 'undetermined' | null;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

// Default location (Sao Paulo center) for when permission is denied or not available
const DEFAULT_LOCATION: LocationData = {
  latitude: -23.5505,
  longitude: -46.6333,
};

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined' | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.geolocation) {
        setPermissionStatus('denied');
        return false;
      }

      // Browser will prompt for permission when we try to get location
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionStatus('granted');
            resolve(true);
          },
          (err) => {
            if (err.code === err.PERMISSION_DENIED) {
              setPermissionStatus('denied');
            }
            resolve(false);
          },
          { timeout: 10000 }
        );
      });
    } catch (err) {
      logger.error('[useLocation] Error requesting location permission:', err);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Check if geolocation is available in the browser
      if (!navigator.geolocation) {
        setLocation(DEFAULT_LOCATION);
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      // Get current position using browser's Geolocation API
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setPermissionStatus('granted');
          setLoading(false);
        },
        (err) => {
          logger.error('[useLocation] Error getting location:', err);
          if (err.code === err.PERMISSION_DENIED) {
            setError('Permissao de localizacao nao concedida');
            setPermissionStatus('denied');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setError('Localizacao indisponivel');
          } else if (err.code === err.TIMEOUT) {
            setError('Tempo esgotado ao obter localizacao');
          } else {
            setError('Nao foi possivel obter sua localizacao');
          }
          setLocation(DEFAULT_LOCATION);
          setLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } catch (err) {
      logger.error('[useLocation] Error getting location:', err);
      setError('Nao foi possivel obter sua localizacao');
      setLocation(DEFAULT_LOCATION);
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
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined' | null>(null);
  const [watching, setWatching] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.geolocation) {
        setPermissionStatus('denied');
        return false;
      }

      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionStatus('granted');
            resolve(true);
          },
          () => {
            setPermissionStatus('denied');
            resolve(false);
          },
          { timeout: 10000 }
        );
      });
    } catch (err) {
      logger.error('[useLocation] Error requesting location permission:', err);
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async (): Promise<void> => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        logger.error('[useLocation] Error refreshing location:', err);
      }
    );
  }, []);

  useEffect(() => {
    let watchId: number | null = null;

    const startWatching = () => {
      if (!navigator.geolocation) {
        setLocation(DEFAULT_LOCATION);
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      // Get initial location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setPermissionStatus('granted');
          setLoading(false);

          // Start watching
          watchId = navigator.geolocation.watchPosition(
            (newPosition) => {
              setLocation({
                latitude: newPosition.coords.latitude,
                longitude: newPosition.coords.longitude,
                accuracy: newPosition.coords.accuracy,
              });
            },
            (err) => {
              logger.error('[useLocation] Error watching location:', err);
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 60000,
            }
          );
          setWatching(true);
        },
        (err) => {
          logger.error('[useLocation] Error getting initial location:', err);
          setError('Permissao de localizacao nao concedida');
          setPermissionStatus('denied');
          setLocation(DEFAULT_LOCATION);
          setLoading(false);
        }
      );
    };

    startWatching();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
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
