import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const notificationsData = [
  {
    id: '1',
    type: 'Записи',
    title: 'Запись на мойку подтверждена',
    description: 'Ваша запись на мойку автомобиля подтверждена на 15.10.2023 в 14:00.',
    date: '15.10.2023',
  },
  {
    id: '2',
    type: 'Отключения',
    title: 'Плановое отключение воды',
    description: 'Вода будет отключена 16.10.2023 с 10:00 до 14:00.',
    date: '16.10.2023',
  },
  {
    id: '3',
    type: 'Записи',
    title: 'Запись на мойку отменена',
    description: 'Ваша запись на мойку автомобиля отменена.',
    date: '14.10.2023',
  },
  {
    id: '4',
    type: 'Отключения',
    title: 'Плановое отключение электричества',
    description: 'Электричество будет отключено 17.10.2023 с 09:00 до 12:00.',
    date: '17.10.2023',
  },
  {
    id: '5',
    type: 'Записи',
    title: 'Новая запись на мойку',
    description: 'Вы записаны на мойку автомобиля на 18.10.2023 в 16:00.',
    date: '18.10.2023',
  },
];

export default function NotificationsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('Все'); // Состояние для фильтра

  // Фильтрация уведомлений
  const filteredNotifications = notificationsData.filter((notification) => {
    if (selectedFilter === 'Все') return true;
    return notification.type === selectedFilter;
  });

  return (
    <View style={styles.container}>
      {/* Заголовок на синем фоне */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Уведомления</Text>
      </View>

      {/* Фильтры */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'Все' && styles.activeFilter,
          ]}
          onPress={() => setSelectedFilter('Все')}
        >
          <Text style={styles.filterText}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'Записи' && styles.activeFilter,
          ]}
          onPress={() => setSelectedFilter('Записи')}
        >
          <Text style={styles.filterText}>Записи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'Отключения' && styles.activeFilter,
          ]}
          onPress={() => setSelectedFilter('Отключения')}
        >
          <Text style={styles.filterText}>Отключения</Text>
        </TouchableOpacity>
      </View>

      {/* Список уведомлений */}
      <ScrollView style={styles.notificationsList}>
        {filteredNotifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <Text style={styles.notificationType}>{notification.type}</Text>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationDescription}>
              {notification.description}
            </Text>
            <Text style={styles.notificationDate}>{notification.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
});