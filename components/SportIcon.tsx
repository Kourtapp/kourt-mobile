import React from 'react';
import { View, Image, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

// Sport icons - 3D style
export const SPORT_ICONS: Record<string, ImageSourcePropType> = {
  'beach-tennis': require('../assets/images/sports/beach-tennis.png'),
  'beachtennis': require('../assets/images/sports/beach-tennis.png'),
  'beach_tennis': require('../assets/images/sports/beach-tennis.png'),
  'Beach Tennis': require('../assets/images/sports/beach-tennis.png'),
  'padel': require('../assets/images/sports/padel.png'),
  'Padel': require('../assets/images/sports/padel.png'),
  'football': require('../assets/images/sports/football.png'),
  'soccer': require('../assets/images/sports/football.png'),
  'futebol': require('../assets/images/sports/football.png'),
  'Futebol': require('../assets/images/sports/football.png'),
  'tennis': require('../assets/images/sports/tennis.png'),
  'Tennis': require('../assets/images/sports/tennis.png'),
  'Tênis': require('../assets/images/sports/tennis.png'),
  'volleyball': require('../assets/images/sports/volleyball.png'),
  'volei': require('../assets/images/sports/volleyball.png'),
  'Vôlei': require('../assets/images/sports/volleyball.png'),
  'basketball': require('../assets/images/sports/basketball.png'),
  'Basquete': require('../assets/images/sports/basketball.png'),
  'futevolei': require('../assets/images/sports/futevolei.png'),
  'Futevôlei': require('../assets/images/sports/futevolei.png'),
  'handball': require('../assets/images/sports/handball.png'),
  'Handebol': require('../assets/images/sports/handball.png'),
};

// Get the icon source for a sport, with fallback
export const getSportIcon = (sport: string): ImageSourcePropType | null => {
  // Try exact match first
  if (SPORT_ICONS[sport]) {
    return SPORT_ICONS[sport];
  }

  // Try lowercase
  const lowerSport = sport.toLowerCase();
  if (SPORT_ICONS[lowerSport]) {
    return SPORT_ICONS[lowerSport];
  }

  // Try replacing spaces with dashes
  const dashedSport = sport.toLowerCase().replace(/\s+/g, '-');
  if (SPORT_ICONS[dashedSport]) {
    return SPORT_ICONS[dashedSport];
  }

  // Try replacing spaces with underscores
  const underscoredSport = sport.toLowerCase().replace(/\s+/g, '_');
  if (SPORT_ICONS[underscoredSport]) {
    return SPORT_ICONS[underscoredSport];
  }

  return null;
};

interface SportIconProps {
  sport: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  showBackground?: boolean;
}

export function SportIcon({ sport, size = 40, style, showBackground = true }: SportIconProps) {
  const iconSource = getSportIcon(sport);

  if (!iconSource) {
    // Fallback - return empty view or placeholder
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 4,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      />
    );
  }

  if (showBackground) {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 4,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          },
          style,
        ]}
      >
        <Image
          source={iconSource}
          style={{
            width: size * 0.75,
            height: size * 0.75,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <Image
      source={iconSource}
      style={[
        {
          width: size,
          height: size,
        },
        style as any,
      ]}
      resizeMode="contain"
    />
  );
}

// Sport name mapping for display
export const SPORT_NAMES: Record<string, string> = {
  'beach-tennis': 'Beach Tennis',
  'beachtennis': 'Beach Tennis',
  'beach_tennis': 'Beach Tennis',
  'padel': 'Padel',
  'football': 'Futebol',
  'soccer': 'Futebol',
  'futebol': 'Futebol',
  'tennis': 'Tênis',
  'volleyball': 'Vôlei',
  'volei': 'Vôlei',
};

export const getSportName = (sport: string): string => {
  if (SPORT_NAMES[sport]) {
    return SPORT_NAMES[sport];
  }
  if (SPORT_NAMES[sport.toLowerCase()]) {
    return SPORT_NAMES[sport.toLowerCase()];
  }
  return sport;
};
