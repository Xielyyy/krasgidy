import React, { useState, useEffect, createContext, useContext, useMemo, ReactNode } from 'react';
import { View, Text, StyleSheet, Button, TextInput, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Тип для маршрута
type Route = {
  id: number;
  type: string;
  number: string;
  route: string;
  arrivalTime: string;
};

// Пример данных о маршрутах
const initialRoutes: Route[] = [
  { id: 1, type: 'Автобус', number: '25', route: 'Центр - Южный район', arrivalTime: '10 минут' },
  { id: 2, type: 'Трамвай', number: '3', route: 'Северный район - Вокзал', arrivalTime: '15 минут' },
];

// Контекст для транспорта
type TransportContextType = {
  routes: Route[];
  addRoute: (route: Omit<Route, 'id'>) => void;
  deleteRoute: (id: number) => void;
  updateArrivalTimes: () => void;
};

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};

export const TransportProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);

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
    <TransportContext.Provider value={{ routes, addRoute, deleteRoute, updateArrivalTimes }}>
      {children}
    </TransportContext.Provider>
  );
};

// Компонент элемента маршрута
const RouteItem = React.memo(({ route, onDelete }: { route: Route; onDelete: (id: number) => void }) => (
  <View style={styles.route}>
    <Text style={styles.routeText}>
      {route.type} №{route.number}: {route.route}
    </Text>
    <Text style={styles.routeText}>Время прибытия: {route.arrivalTime}</Text>
    <TouchableOpacity onPress={() => onDelete(route.id)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Удалить</Text>
    </TouchableOpacity>
  </View>
));

// Список маршрутов
const RouteList = React.memo(({ routes }: { routes: Route[] }) => {
  const { deleteRoute } = useTransport();
  return (
    <>
      {routes.map((route) => (
        <RouteItem key={route.id} route={route} onDelete={deleteRoute} />
      ))}
    </>
  );
});

// Форма добавления маршрута
const AddRouteForm = () => {
  const [newRoute, setNewRoute] = useState<Omit<Route, 'id'>>({ type: '', number: '', route: '', arrivalTime: '' });
  const { addRoute } = useTransport();

  const handleAddRoute = () => {
    if (newRoute.type && newRoute.number && newRoute.route && newRoute.arrivalTime) {
      addRoute(newRoute);
      setNewRoute({ type: '', number: '', route: '', arrivalTime: '' });
    }
  };

  return (
    <View style={styles.addRouteContainer}>
      <TextInput
        style={styles.input}
        placeholder="Тип транспорта (например, Автобус)"
        value={newRoute.type}
        onChangeText={(text) => setNewRoute((prev) => ({ ...prev, type: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Номер маршрута (например, 25)"
        value={newRoute.number}
        onChangeText={(text) => setNewRoute((prev) => ({ ...prev, number: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Маршрут (например, Центр - Южный район)"
        value={newRoute.route}
        onChangeText={(text) => setNewRoute((prev) => ({ ...prev, route: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Время прибытия (например, 10 минут)"
        value={newRoute.arrivalTime}
        onChangeText={(text) => setNewRoute((prev) => ({ ...prev, arrivalTime: text }))}
      />
      <Button title="Добавить маршрут" onPress={handleAddRoute} />
    </View>
  );
};

// Основной экран
export default function TransportScreen() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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
    return filter === 'all' ? routes : routes.filter((route) => route.type.toLowerCase() === filter);
  }, [routes, filter]);

  const sortedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      const timeA = parseInt(a.arrivalTime);
      const timeB = parseInt(b.arrivalTime);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }, [filteredRoutes, sortOrder]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Общественный транспорт</Text>
      <Text style={styles.subHeader}>Маршруты:</Text>

      <View style={styles.filterContainer}>
        <Button title="Все" onPress={() => setFilter('all')} />
        <Button title="Автобусы" onPress={() => setFilter('автобус')} />
        <Button title="Трамваи" onPress={() => setFilter('трамвай')} />
      </View>

      <View style={styles.sortContainer}>
        <Button title="↑ По возрастанию" onPress={() => setSortOrder('asc')} />
        <Button title="↓ По убыванию" onPress={() => setSortOrder('desc')} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <RouteList routes={sortedRoutes} />
      )}

      <AddRouteForm />
      <Button title="Обновить время прибытия" onPress={updateArrivalTimes} />
      <Button title="Загрузить данные" onPress={fetchData} />
    </ScrollView>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 16,
    color: '#666',
  },
  route: {
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
  routeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addRouteContainer: {
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  sortContainer: {
    marginBottom: 16,
  },
});