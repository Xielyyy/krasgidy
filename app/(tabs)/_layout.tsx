import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { TransportProvider } from './TransportScreen';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <TransportProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Домашняя',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="comunal"
          options={{
            title: 'Ком.услуги',
            tabBarIcon: ({ color }) => (
              <Ionicons name="build" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ServicesScreen"
          options={{
            title: 'Сервисы',
            tabBarIcon: ({ color }) => (
              <Ionicons name="list" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: 'Погода',
            tabBarIcon: ({ color }) => (
              <Ionicons name="cloud" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="carwash"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="TransportScreen"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </TransportProvider>
  );
}