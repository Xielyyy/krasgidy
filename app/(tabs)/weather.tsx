import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type WeatherData = {
  city: string;
  temperature: string;
  condition: string;
  humidity: string;
  pressure: string;
  wind: string;
  icon: string;
};

const WeatherScreen = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Мок данные, соответствующие стилю KRA$GID
        const mockData: WeatherData = {
          city: 'Красноярск',
          temperature: '+15°',
          condition: 'Облачно',
          humidity: '75% влажность',
          pressure: '755 мм давление',
          wind: '5 м/с ветер',
          icon: 'https://openweathermap.org/img/wn/04d@4x.png'
        };
        
        setWeatherData(mockData);
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
        >
          <Text style={styles.retryText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2F80ED" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Погода</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Основная информация */}
        <View style={styles.mainInfo}>
          <Text style={styles.city}>{weatherData?.city}</Text>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{weatherData?.temperature}</Text>
            <Image 
              source={{ uri: weatherData?.icon }} 
              style={styles.weatherIcon}
            />
          </View>
          <Text style={styles.condition}>{weatherData?.condition}</Text>
        </View>

        {/* Детали */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={20} color="#2F80ED" />
            <Text style={styles.detailText}>{weatherData?.humidity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={20} color="#2F80ED" />
            <Text style={styles.detailText}>{weatherData?.pressure}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="flag-outline" size={20} color="#2F80ED" />
            <Text style={styles.detailText}>{weatherData?.wind}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  city: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '300',
    color: '#1A1A1A',
    marginRight: 16,
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  condition: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  detailItem: {
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    padding: 16,
    borderRadius: 12,
    width: '30%',
  },
  detailText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EB5757',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WeatherScreen;