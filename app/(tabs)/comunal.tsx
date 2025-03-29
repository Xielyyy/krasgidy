import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

// Типы данных
type Outage = {
  id: number;
  type: 'Вода' | 'Электричество' | 'Газ';
  time: string;
  reason: string;
  read: boolean;
};

type District = 'Центральный' | 'Советский' | 'Октябрьский' | 'Свердловский' | 'Кировский' | 'Ленинский' | 'Железнодорожный';

type DistrictOutages = {
  [key in District]: Outage[];
};

interface OutageAnalytics {
  Вода: number;
  Электричество: number;
  Газ: number;
}

interface EmergencyContacts {
  water: string;
  electricity: string;
  gas: string;
}

// Константы данных
const districtOutages: DistrictOutages = {
  Центральный: [
    { id: 1, type: 'Вода', time: '10:00 - 14:00', reason: 'Плановые работы', read: false },
    { id: 2, type: 'Электричество', time: '15:00 - 17:00', reason: 'Ремонт сети', read: false },
  ],
  Советский: [
    { id: 3, type: 'Газ', time: '09:00 - 12:00', reason: 'Техническое обслуживание', read: false },
  ],
  Октябрьский: [
    { id: 4, type: 'Вода', time: '08:00 - 10:00', reason: 'Авария на магистрали', read: false },
  ],
  Свердловский: [
    { id: 5, type: 'Электричество', time: '14:00 - 16:00', reason: 'Замена оборудования', read: false },
  ],
  Кировский: [
    { id: 6, type: 'Вода', time: '11:00 - 13:00', reason: 'Профилактические работы', read: false },
  ],
  Ленинский: [
    { id: 7, type: 'Газ', time: '12:00 - 14:00', reason: 'Проверка системы', read: false },
  ],
  Железнодорожный: [
    { id: 8, type: 'Электричество', time: '16:00 - 18:00', reason: 'Ремонт подстанции', read: false },
  ],
};

const tips = [
  'При отключении воды запаситесь бутилированной водой.',
  'При отключении электричества используйте фонари.',
  'Заранее зарядите power bank и мобильные устройства.',
];

const outageAnalytics: OutageAnalytics = {
  Вода: 12,
  Электричество: 8,
  Газ: 5,
};

const emergencyContacts: EmergencyContacts = {
  water: '+7 (XXX) XXX-XX-XX',
  electricity: '+7 (XXX) XXX-XX-XX',
  gas: '+7 (XXX) XXX-XX-XX'
};

// Основной компонент
export default function ComunalkaScreen() {
  const [district, setDistrict] = useState<District>('Центральный');
  const [outages, setOutages] = useState<Outage[]>(districtOutages[district]);
  const [report, setReport] = useState({
    address: '',
    type: '' as 'Вода' | 'Электричество' | 'Газ' | '',
    description: '',
    phone: '',
  });

  const markAsRead = (id: number) => {
    setOutages(prevOutages => 
      prevOutages.map(outage => 
        outage.id === id ? { ...outage, read: true } : outage
      )
    );
  };

  const changeDistrict = (newDistrict: District) => {
    setDistrict(newDistrict);
    setOutages(districtOutages[newDistrict]);
  };

  const submitReport = () => {
    if (report.address && report.type && report.description && report.phone) {
      alert('Сообщение о поломке отправлено!');
      setReport({ address: '', type: '', description: '', phone: '' });
    } else {
      alert('Заполните все поля!');
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Подготовка данных для диаграммы
  const chartData = Object.keys(outageAnalytics).map((key) => {
    const type = key as keyof OutageAnalytics;
    return {
      name: type,
      population: outageAnalytics[type],
      color: getRandomColor(),
      legendFontColor: '#333',
      legendFontSize: 12
    };
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Коммунальные услуги</Text>

      {/* Выбор района */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ваш район:</Text>
        <View style={styles.districtButtons}>
          {(Object.keys(districtOutages) as District[]).map((districtName) => (
            <TouchableOpacity
              key={districtName}
              style={[
                styles.districtButton,
                district === districtName && styles.activeDistrictButton
              ]}
              onPress={() => changeDistrict(districtName)}
            >
              <Text style={styles.districtButtonText}>{districtName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Список отключений */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ближайшие отключения:</Text>
        {outages.map((outage) => (
          <TouchableOpacity
            key={outage.id}
            style={styles.outageItem}
            onPress={() => markAsRead(outage.id)}
          >
            <Ionicons
              name={outage.read ? 'checkmark-circle' : 'alert-circle'}
              size={24}
              color={outage.read ? '#4CAF50' : '#FF5252'}
            />
            <View style={styles.outageTextContainer}>
              <Text style={styles.outageType}>{outage.type}</Text>
              <Text style={styles.outageTime}>{outage.time}</Text>
              <Text style={styles.outageReason}>{outage.reason}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Советы */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Советы:</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="bulb" size={20} color="#FFC107" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Контакты */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Контакты аварийных служб:</Text>
        <Text style={styles.contactText}>Водоканал: {emergencyContacts.water}</Text>
        <Text style={styles.contactText}>Электросети: {emergencyContacts.electricity}</Text>
        <Text style={styles.contactText}>Газовая служба: {emergencyContacts.gas}</Text>
      </View>

      {/* Форма отчетности */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Сообщить о поломке:</Text>
        <TextInput
          style={styles.input}
          placeholder="Адрес"
          value={report.address}
          onChangeText={text => setReport({...report, address: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Тип поломки (вода, свет, газ)"
          value={report.type}
          onChangeText={text => setReport({...report, type: text as 'Вода' | 'Электричество' | 'Газ'})}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Описание"
          value={report.description}
          onChangeText={text => setReport({...report, description: text})}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Номер телефона"
          value={report.phone}
          onChangeText={text => setReport({...report, phone: text})}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
          <Text style={styles.submitButtonText}>Отправить</Text>
        </TouchableOpacity>
      </View>

      {/* Аналитика */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Аналитика поломок за месяц:</Text>
        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  districtButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  districtButton: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    alignItems: 'center',
  },
  activeDistrictButton: {
    backgroundColor: '#1E88E5',
  },
  districtButtonText: {
    fontSize: 14,
    color: '#333',
  },
  outageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  outageTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  outageType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  outageTime: {
    fontSize: 14,
    color: '#666',
  },
  outageReason: {
    fontSize: 12,
    color: '#999',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#1E88E5',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});