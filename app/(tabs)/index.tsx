import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ListRenderItem,
  StatusBar
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Типы данных
type AlertType = 'water' | 'electricity' | 'carwash';

interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  date: string;
  description: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

const HomeScreen = () => {
  // Данные для оповещений
  const alerts: AlertItem[] = [
    {
      id: '1',
      type: 'water',
      title: 'Отключение воды',
      date: '15.05.2023 09:00-17:00',
      description: 'Плановые работы в Центральном районе'
    },
    {
      id: '2',
      type: 'electricity',
      title: 'Отключение электричества',
      date: '16.05.2023 10:00-14:00',
      description: 'Ремонтные работы на подстанции'
    },
    {
      id: '3',
      type: 'carwash',
      title: 'Автомойка свободна',
      date: 'Сегодня до 18:00',
      description: 'Мойка на ул. Ленина, 42'
    }
  ];

  // Данные для новостей
  const news: NewsItem[] = [
    {
      id: '1',
      title: 'Открытие нового парка',
      description: 'В центре города открылся новый парк с детскими площадками и велодорожками',
      image: 'https://placehold.co/600x400?text=Парк',
      date: '14.05.2023'
    },
    {
      id: '2',
      title: 'Фестиваль еды',
      description: 'Городской фестиваль еды пройдет в эти выходные на центральной площади',
      image: 'https://placehold.co/600x400?text=Фестиваль',
      date: '12.05.2023'
    },
    {
      id: '3',
      title: 'Ремонт дорог',
      description: 'Начался плановый ремонт дорожного покрытия на улице Советской',
      image: 'https://placehold.co/600x400?text=Дороги',
      date: '10.05.2023'
    },
    {
      id: '4',
      title: 'Новый маршрут автобуса',
      description: 'С 1 июня вводится новый автобусный маршрут №25',
      image: 'https://placehold.co/600x400?text=Автобус',
      date: '08.05.2023'
    }
  ];

  // Функция для получения иконки по типу оповещения
  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'water': 
        return <MaterialIcons name="water-drop" size={24} color="#2196F3" />;
      case 'electricity': 
        return <MaterialIcons name="flash-on" size={24} color="#FFC107" />;
      case 'carwash': 
        return <MaterialIcons name="local-car-wash" size={24} color="#4CAF50" />;
      default: 
        return <MaterialIcons name="info" size={24} color="#9E9E9E" />;
    }
  };

  // Рендер карточки оповещения
const renderAlertItem: ListRenderItem<AlertItem> = ({ item }) => {
  return (
    <View style={[
      styles.alertCard,
      { 
        borderLeftColor: 
          item.type === 'water' ? '#2196F3' : 
          item.type === 'electricity' ? '#FFC107' : 
          '#4CAF50' 
      }
    ]}>
      <View style={styles.alertIcon}>
        {getAlertIcon(item.type)}
      </View>
      <View style={styles.alertText}>
        <Text style={styles.alertTitle}>{item.title}</Text>
        <Text style={styles.alertDate}>{item.date}</Text>
        <Text style={styles.alertDescription}>{item.description}</Text>
      </View>
    </View>
  );
};

// Рендер карточки новости
const renderNewsItem: ListRenderItem<NewsItem> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.newsCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.newsImage}
        resizeMode="cover"
      />
      <View style={styles.newsText}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDate}>{item.date}</Text>
        <Text style={styles.newsDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Главная</Text>
        <TouchableOpacity style={styles.notificationButton} 
        onPress={() => router.push('/notification')}>
          
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

<ScrollView style={styles.container}>
        {/* Секция с оповещениями */}
        <Text style={styles.sectionTitle}>Ближайшие события</Text>
        <FlatList
          horizontal
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.alertsContainer}
          showsHorizontalScrollIndicator={false}
        />

        {/* Секция с новостями */}
        <Text style={styles.sectionTitle}>Новости города</Text>
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Стили
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
    color: '#333',
  },
  alertsContainer: {
    paddingBottom: 8,
  },
  alertCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    flexDirection: 'row',
    borderLeftWidth: 4,
    elevation: 2,
  },
  alertIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  alertDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#444',
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  newsImage: {
    width: '100%',
    height: 150,
  },
  newsText: {
    padding: 12,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#333',
  },
});

export default HomeScreen;