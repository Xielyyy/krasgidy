import React, { useState, useEffect, createContext, useContext, useMemo, ReactNode } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Типы данных
type Route = {
  id: number;
  type: string;
  number: string;
  route: string;
  arrivalTime: string;
  stop: string;
};

type Stop = {
  id: number;
  name: string;
};

// Пример данных
const initialStops: Stop[] = [
  { id: 1, name: 'Центральная площадь' },
  { id: 2, name: 'Железнодорожный вокзал' },
  { id: 3, name: 'Северный автовокзал' },
  { id: 4, name: 'Университет' },
  { id: 5, name: 'Торговый центр' },
];

const initialRoutes: Route[] = [
  { id: 1, type: 'Автобус', number: '25', route: 'Центр - Южный район', arrivalTime: '10 минут', stop: 'Центральная площадь' },
  { id: 2, type: 'Трамвай', number: '3', route: 'Северный район - Вокзал', arrivalTime: '15 минут', stop: 'Железнодорожный вокзал' },
  { id: 3, type: 'Автобус', number: '42', route: 'Восточный район - Западный район', arrivalTime: '8 минут', stop: 'Университет' },
  { id: 4, type: 'Троллейбус', number: '7', route: 'Центр - Северный район', arrivalTime: '12 минут', stop: 'Торговый центр' },
];

// Контекст транспорта
const TransportContext = createContext<{
  routes: Route[];
  stops: Stop[];
  addRoute: (route: Omit<Route, 'id'>) => void;
  deleteRoute: (id: number) => void;
  updateArrivalTimes: () => void;
} | undefined>(undefined);

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};

export const TransportProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [stops] = useState<Stop[]>(initialStops);

  const addRoute = (newRoute: Omit<Route, 'id'>) => {
    const route: Route = { id: routes.length + 1, ...newRoute };
    setRoutes((prev) => [...prev, route]);
  };

  const deleteRoute = (id: number) => {
    setRoutes((prev) => prev.filter((route) => route.id !== id));
  };

  const updateArrivalTimes = () => {
    setRoutes((prev) =>
      prev.map((route) => ({
        ...route,
        arrivalTime: `${Math.floor(Math.random() * 20) + 1} минут`,
      }))
    );
  };

  return (
    <TransportContext.Provider value={{ routes, stops, addRoute, deleteRoute, updateArrivalTimes }}>
      {children}
    </TransportContext.Provider>
  );
};

// Компонент выбора остановки
const StopSelector = ({ 
  selectedStop, 
  onSelect 
}: {
  selectedStop: string;
  onSelect: (stop: string) => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { stops } = useTransport();

  const filteredStops = stops.filter(stop =>
    stop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.stopSelector} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={selectedStop ? styles.stopSelectedText : styles.stopPlaceholder}>
          {selectedStop || 'Выберите остановку'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выберите остановку</Text>
            
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Поиск остановки"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView style={styles.stopsList}>
              {filteredStops.map((stop) => (
                <TouchableOpacity
                  key={stop.id}
                  style={styles.stopItem}
                  onPress={() => {
                    onSelect(stop.name);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.stopName}>{stop.name}</Text>
                  {selectedStop === stop.name && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Компонент элемента маршрута
const RouteItem = React.memo(({ route, onDelete }: { route: Route; onDelete: (id: number) => void }) => {
  const getIconName = () => {
    switch(route.type) {
      case 'Автобус': return 'bus';
      case 'Трамвай': return 'train';
      case 'Троллейбус': return 'bus';
      default: return 'car';
    }
  };

  const getIconColor = () => {
    switch(route.type) {
      case 'Автобус': return '#FF5722';
      case 'Трамвай': return '#4CAF50';
      case 'Троллейбус': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <Ionicons name={getIconName()} size={24} color={getIconColor()} />
        <Text style={styles.routeNumber}>{route.number}</Text>
        <Text style={styles.routeType}>{route.type}</Text>
      </View>
      <Text style={styles.routePath}>{route.route}</Text>
      <View style={styles.routeInfoRow}>
        <Text style={styles.routeStop}>
          <Ionicons name="location" size={14} color="#666" /> {route.stop}
        </Text>
        <Text style={styles.arrivalTime}>
          <Ionicons name="time" size={14} color="#666" /> {route.arrivalTime}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(route.id)} style={styles.deleteButton}>
        <Ionicons name="trash" size={18} color="#F44336" />
      </TouchableOpacity>
    </View>
  );
});

// Список маршрутов
const RouteList = React.memo(({ routes }: { routes: Route[] }) => {
  const { deleteRoute } = useTransport();
  return (
    <View style={styles.routesContainer}>
      {routes.map((route) => (
        <RouteItem key={route.id} route={route} onDelete={deleteRoute} />
      ))}
    </View>
  );
});

// Основной экран
export default function TransportScreen() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStop, setSelectedStop] = useState('');
  const { routes, updateArrivalTimes } = useTransport();

  useEffect(() => {
    const interval = setInterval(updateArrivalTimes, 60000);
    return () => clearInterval(interval);
  }, [updateArrivalTimes]);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const filteredRoutes = useMemo(() => {
    let result = routes;
    
    if (filter !== 'all') {
      result = result.filter(route => route.type.toLowerCase() === filter.toLowerCase());
    }
    
    if (selectedStop) {
      result = result.filter(route => route.stop === selectedStop);
    }
    
    return result;
  }, [routes, filter, selectedStop]);

  const sortedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      const timeA = parseInt(a.arrivalTime);
      const timeB = parseInt(b.arrivalTime);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }, [filteredRoutes, sortOrder]);

  return (
    <View style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Общественный транспорт</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Поиск остановки */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Выберите остановку:</Text>
          <StopSelector 
            selectedStop={selectedStop} 
            onSelect={setSelectedStop} 
          />
        </View>

        {/* Фильтры */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Тип транспорта:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>Все</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'автобус' && styles.activeFilter]}
              onPress={() => setFilter('автобус')}
            >
              <Text style={[styles.filterText, filter === 'автобус' && styles.activeFilterText]}>Автобусы</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'трамвай' && styles.activeFilter]}
              onPress={() => setFilter('трамвай')}
            >
              <Text style={[styles.filterText, filter === 'трамвай' && styles.activeFilterText]}>Трамваи</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'троллейбус' && styles.activeFilter]}
              onPress={() => setFilter('троллейбус')}
            >
              <Text style={[styles.filterText, filter === 'троллейбус' && styles.activeFilterText]}>Троллейбусы</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Сортировка */}
        <View style={styles.sortSection}>
          <Text style={styles.sectionTitle}>Сортировка:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity 
              style={[styles.sortButton, sortOrder === 'asc' && styles.activeSort]}
              onPress={() => setSortOrder('asc')}
            >
              <Text style={[styles.sortText, sortOrder === 'asc' && styles.activeSortText]}>
                <Ionicons name="arrow-up" size={14} /> По времени
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sortButton, sortOrder === 'desc' && styles.activeSort]}
              onPress={() => setSortOrder('desc')}
            >
              <Text style={[styles.sortText, sortOrder === 'desc' && styles.activeSortText]}>
                <Ionicons name="arrow-down" size={14} /> По времени
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Статус */}
        {selectedStop && (
          <Text style={styles.statusText}>
            Показан транспорт для остановки: <Text style={styles.statusHighlight}>{selectedStop}</Text>
          </Text>
        )}

        {/* Список маршрутов */}
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <RouteList routes={sortedRoutes} />
        )}

        {/* Кнопки действий */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={updateArrivalTimes} 
            style={[styles.actionButton, styles.refreshButton]}
          >
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Обновить</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpacer} />
          <TouchableOpacity 
            onPress={fetchData} 
            style={[styles.actionButton, styles.loadButton]}
          >
            <Ionicons name="download" size={18} color="#FFF" />
            <Text style={styles.actionButtonText}>Загрузить</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  searchSection: {
    marginBottom: 20,
  },
  stopSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  stopPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  stopSelectedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  stopsList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stopName: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingRight: 16,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  sortSection: {
    marginBottom: 20,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  activeSort: {
    backgroundColor: '#007AFF',
  },
  sortText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  activeSortText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusHighlight: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  routesContainer: {
    marginBottom: 20,
  },
  routeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  routeType: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  routePath: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  routeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeStop: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  arrivalTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  loader: {
    marginVertical: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonSpacer: {
    width: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 14,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
  },
  loadButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});