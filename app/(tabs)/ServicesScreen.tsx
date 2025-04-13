import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { Link } from 'expo-router';

type ServiceItem = {
  id: string;
  name: string;
  icon: string;
  link?: '/(tabs)/carwash' | string; // Явно указываем возможные пути
};

const ServicesScreen = () => {
  // Данные для секций
  const sections = [
    {
      title: 'Популярное',
      data: [
        { id: '1', name: 'Транспорт', icon: 'bus', link: '/(tabs)/TransportScreen' },
        { id: '2', name: 'Мойка', icon: 'car', link: '/(tabs)/carwash' }, // Указываем полный путь
        { id: '3', name: 'Заправка', icon: 'flame' },
      ] as ServiceItem[],
    }, // ща ща аща все будет
    {
      title: 'Избранное',
      data: [
        { id: '4', name: 'Автосервис', icon: 'settings' },
        { id: '5', name: 'Техника', icon: 'build' },
        { id: '6', name: 'Транспорт', icon: 'bus', link: '/(tabs)/TransportScreen' },
      ] as ServiceItem[],
    },
  ];

  // Рендер элемента списка
  const renderItem = ({ item }: { item: ServiceItem }) => {
    if (item.link) {
      return (
        <Link href={item.link as '/(tabs)/carwash'} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemContent}>
              <Ionicons name={item.icon as any} size={24} color="#1E88E5" />
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </Link>
      );
    }

    return (
      <TouchableOpacity style={styles.item} onPress={() => console.log('Selected:', item.name)}>
        <View style={styles.itemContent}>
          <Ionicons name={item.icon as any} size={24} color="#1E88E5" />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  // Остальной код без изменений...
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Услуги и сервисы</Text>
      
      <FlatList
        data={sections}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

// Стили остаются без изменений...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    paddingHorizontal: 8,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});

export default ServicesScreen;