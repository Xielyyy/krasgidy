import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function CarWashScreen() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [carNumber, setCarNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAvailable, setIsAvailable] = useState(true); // Статус мойки (свободно/занято)
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]); // Локальное хранилище для записей
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null); // Выбранное место на карте

  const services = [
    { id: '1', name: 'Мойка Кузова' },
    { id: '2', name: 'Химчистка салона' },
    { id: '3', name: 'Полировка кузова' },
    { id: '4', name: 'Предпродажная мойка' },
  ];

  // Координаты Красноярска
  const initialRegion = {
    latitude: 56.0153,
    longitude: 92.8932,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // Проверка доступности мойки
  useEffect(() => {
    checkAvailability();
  }, [bookings]); // Зависимость от bookings

  const checkAvailability = () => {
    // Если есть активные записи, мойка занята
    const activeBookings = bookings.filter(booking => booking.status === 'active');
    setIsAvailable(activeBookings.length === 0);
  };

  // Выбор услуги
  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
  };

  // Выбор места на карте
  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  // Отправка данных (локально)
  const handleSubmit = () => {
    if (!selectedService || !carNumber || !carModel || !phoneNumber || !selectedLocation) {
      Alert.alert('Ошибка', 'Заполните все поля и выберите место на карте!');
      return;
    }

    if (!isAvailable) {
      Alert.alert('Ошибка', 'Мойка занята. Пожалуйста, попробуйте позже.');
      return;
    }

    setLoading(true);

    // Имитация задержки отправки данных
    setTimeout(() => {
      // Создаем новую запись
      const newBooking = {
        id: String(bookings.length + 1), // Уникальный ID
        service: selectedService,
        carModel,
        carNumber,
        phoneNumber,
        location: selectedLocation, // Место на карте
        status: 'active', // Статус мойки
        timestamp: new Date().toISOString(), // Время записи
      };

      // Добавляем запись в локальное хранилище
      setBookings(prevBookings => [...prevBookings, newBooking]);

      Alert.alert('Успех', 'Запись успешна!');
      setIsAvailable(false); // Мойка становится занятой
      setLoading(false);
    }, 1000); // Имитация задержки сети
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Заголовок в синем блоке */}
      <View style={styles.header}>
        <Text style={styles.headerText}>АвтоУслуги</Text>
      </View>

      {/* Иконка машины */}
      <View style={styles.iconContainer}>
        <Ionicons name="car" size={64} color="#007AFF" />
      </View>

      {/* Выбор услуги */}
      <View style={styles.servicesContainer}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceButton,
              selectedService === service.name && styles.selectedServiceButton,
            ]}
            onPress={() => handleServiceSelect(service.name)}
          >
            <Text
              style={[
                styles.serviceText,
                selectedService === service.name && styles.selectedServiceText,
              ]}
            >
              {service.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Карта */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Выбранное место"
              description="Здесь будет автомойка"
            />
          )}
        </MapView>
      </View>

      {/* Форма для заполнения данных */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Марка автомобиля"
          value={carModel}
          onChangeText={setCarModel}
        />
        <TextInput
          style={styles.input}
          placeholder="Госномер автомобиля"
          value={carNumber}
          onChangeText={setCarNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Номер телефона"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      {/* Статус мойки (светофор) */}
      <View style={styles.availabilityContainer}>
        <View
          style={[
            styles.availabilityIndicator,
            { backgroundColor: isAvailable ? 'green' : 'red' },
          ]}
        />
        <Text style={styles.availabilityText}>
          {isAvailable ? 'Свободно' : 'Занято'}
        </Text>
      </View>

      {/* Кнопка записи */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Записаться</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// Стили
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceButton: {
    width: '48%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedServiceButton: {
    backgroundColor: '#007AFF',
  },
  serviceText: {
    fontSize: 16,
    color: '#333',
  },
  selectedServiceText: {
    color: '#fff',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  availabilityIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});