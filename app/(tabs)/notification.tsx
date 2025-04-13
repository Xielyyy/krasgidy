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
  const [selectedFilter, setSelectedFilter] = useState('Все');

  const filteredNotifications = notificationsData.filter((notification) => {
    if (selectedFilter === 'Все') return true;
    return notification.type === selectedFilter;
  });

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Уведомления</Text>
      </View>

      {/* Фильтры - стилизованы как в примере */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'Все' && styles.activeFilter,
          ]}
          onPress={() => setSelectedFilter('Все')}
        >
          <Text style={selectedFilter === 'Все' ? styles.activeFilterText : styles.filterText}>Все</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'Записи' && styles.activeFilter,
          ]}
          onPress={() => setSelectedFilter('Записи')}
        >
          <Text style={selectedFilter === 'Записи' ? styles.activeFilterText : styles.filterText}>Записи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'Отключения' && styles.activeFilter,
          ]}
          onPress={() => setSelectedFilter('Отключения')}
        >
          <Text style={selectedFilter === 'Отключения' ? styles.activeFilterText : styles.filterText}>Отключения</Text>
        </TouchableOpacity>
      </View>

      {/* Список уведомлений - стилизован как в примере */}
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 16,
    color: '#333333',
  },
  activeFilterText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationType: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  notificationDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 22,
  },
  notificationDate: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'right',
  },
});