
import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';

interface RadarChartProps {
    data: {
        label: string;
        value: number; // 0 to 100
        fullMark: number;
    }[];
    size?: number;
    color?: string;
}

export function RadarChart({ data, size = 200, color = "#8B5CF6" }: RadarChartProps) {
    const center = size / 2;
    const radius = (size / 2) - 40; // Padding for labels
    const angleSlice = (Math.PI * 2) / data.length;

    // Helper to calculate coordinates
    const getCoordinates = (value: number, index: number) => {
        const angle = index * angleSlice - Math.PI / 2;
        return {
            x: center + (Math.cos(angle) * radius * (value / 100)),
            y: center + (Math.sin(angle) * radius * (value / 100))
        };
    };

    // Calculate polygon points for the data
    const points = data.map((d, i) => {
        const { x, y } = getCoordinates(d.value, i);
        return `${x},${y}`;
    }).join(' ');

    // Calculate background grids (concentric pentagons/hexagons)
    const gridLevels = [25, 50, 75, 100];

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg height={size} width={size}>
                {/* Background Grid */}
                {gridLevels.map((level, i) => (
                    <Polygon
                        key={i}
                        points={data.map((_, index) => {
                            const { x, y } = getCoordinates(level, index);
                            return `${x},${y}`;
                        }).join(' ')}
                        stroke="#E2E8F0"
                        strokeWidth="1"
                        fill={i === gridLevels.length - 1 ? "#F8FAFC" : "none"}
                    />
                ))}

                {/* Axis Lines */}
                {data.map((_, i) => {
                    const { x, y } = getCoordinates(100, i);
                    return (
                        <Line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="#E2E8F0"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <Polygon
                    points={points}
                    fill={color}
                    fillOpacity="0.4"
                    stroke={color}
                    strokeWidth="2"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(d.value, i);
                    return (
                        <Circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill={color}
                        />
                    );
                })}

                {/* Labels */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(115, i); // Push labels out slightly
                    return (
                        <SvgText
                            key={i}
                            x={x}
                            y={y}
                            fill="#64748B"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                            {d.label}
                        </SvgText>
                    );
                })}
            </Svg>
        </View>
    );
}
