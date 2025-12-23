import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

interface BookingCalendarProps {
    onSelectDate: (date: Date) => void;
    onSelectTime: (time: string | null) => void;
    pricePerHour: number;
}

export function BookingCalendar({ onSelectDate, onSelectTime, pricePerHour }: BookingCalendarProps) {
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Generate next 7 days
    const days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            date: d,
            label: i === 0 ? 'Hoje' : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()],
            day: d.getDate(),
        };
    });

    const timeSlots = [
        '07:00', '08:00', '09:00', '10:00', '11:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    return (
        <View style={{ paddingVertical: 24, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16, paddingHorizontal: 20 }}>
                Disponibilidade
            </Text>

            {/* Days Horizontal Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 20 }}
            >
                {days.map((d, index) => {
                    const isSelected = selectedDateIndex === index;
                    return (
                        <Pressable
                            key={index}
                            onPress={() => {
                                setSelectedDateIndex(index);
                                onSelectDate(d.date);
                                setSelectedTime(null); // Reset time on date change
                                onSelectTime(null);
                            }}
                            style={{
                                width: 70,
                                height: 80,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: isSelected ? '#000' : '#E5E7EB',
                                backgroundColor: isSelected ? '#F3F4F6' : '#FFFFFF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 4
                            }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '600', color: isSelected ? '#000' : '#6B7280' }}>
                                {d.label}
                            </Text>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: '#000' }}>
                                {d.day}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Time Slots Horizontal Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
                {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                        <Pressable
                            key={time}
                            onPress={() => {
                                setSelectedTime(time);
                                onSelectTime(time);
                            }}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: isSelected ? '#000' : '#E5E7EB',
                                backgroundColor: isSelected ? '#1F2937' : '#FFFFFF',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '600', color: isSelected ? '#FFFFFF' : '#374151' }}>
                                {time}
                            </Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    );
}
