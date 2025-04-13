import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
        // Мок данные в стиле KRA$GID
        const mockData: WeatherData = {
          city: 'Красноярск',
          temperature: '+15°',
          condition: 'Облачно',
          humidity: '75% влажность',
          pressure: '755 мм рт.ст.',
          wind: '5 м/с, СЗ',
          icon: 'https://openweathermap.org/img/wn/04d@4x.png'
        };
        
        setWeatherData(mockData);
      } catch (err) {
        setError('Не удалось загрузить данные о погоде');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
          <Text style={styles.retryText}>Повторить попытку</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Погода</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Основная информация */}
        <View style={styles.weatherCard}>
          <Text style={styles.city}>{weatherData?.city}</Text>
          <View style={styles.weatherMain}>
            <Text style={styles.temperature}>{weatherData?.temperature}</Text>
            <View>
              <Text style={styles.condition}>{weatherData?.condition}</Text>
              {weatherData?.icon && (
                <Image 
                  source={{ uri: weatherData.icon }} 
                  style={styles.weatherIcon}
                />
              )}
            </View>
          </View>
        </View>

        {/* Детали погоды */}
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <MaterialIcons name="opacity" size={24} color="#007AFF" />
            <Text style={styles.detailLabel}>Влажность</Text>
            <Text style={styles.detailValue}>{weatherData?.humidity}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="speed" size={24} color="#007AFF" />
            <Text style={styles.detailLabel}>Давление</Text>
            <Text style={styles.detailValue}>{weatherData?.pressure}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MaterialIcons name="air" size={24} color="#007AFF" />
            <Text style={styles.detailLabel}>Ветер</Text>
            <Text style={styles.detailValue}>{weatherData?.wind}</Text>
          </View>
        </View>

        {/* Прогноз на неделю */}
        <Text style={styles.sectionTitle}>Прогноз на неделю</Text>
        <View style={styles.forecastContainer}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
            <View key={day} style={styles.forecastDay}>
              <Text style={styles.forecastDayText}>{day}</Text>
              <MaterialIcons 
                name={i % 2 ? "wb-sunny" : "wb-cloudy"} 
                size={28} 
                color={i % 2 ? "#FFC107" : "#9E9E9E"} 
              />
              <Text style={styles.forecastTemp}>{i % 2 ? '+18°' : '+14°'}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  weatherCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  city: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
  },
  condition: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  weatherIcon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  forecastContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
  },
  forecastDay: {
    alignItems: 'center',
  },
  forecastDayText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#EB5757',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WeatherScreen;