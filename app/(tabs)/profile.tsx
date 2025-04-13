import React from 'react';
import { View, Text, Button, Switch, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface UserData {
  name: string;
  phone: string;
  district: string;
}

const UserProfile: React.FC = () => {
  // Состояние пользовательских данных
  const [userData, setUserData] = React.useState<UserData>({
    name: 'Иванов Иван',
    phone: '+7 (999) 123-45-67',
    district: 'Центральный',
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [tempData, setTempData] = React.useState<UserData>({ ...userData });

  const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

  const handleEdit = () => {
    if (isEditing) {
      // Сохраняем изменения
      setUserData({ ...tempData });
    }
    setIsEditing(!isEditing);
  };

  const handleChangePassword = () => {
    // Здесь может быть логика для смены пароля
    console.log('Инициирована смена пароля');
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Личные данные</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Имя:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={tempData.name}
            onChangeText={(text: string) => handleInputChange('name', text)}
          />
        ) : (
          <Text style={styles.value}>{userData.name}</Text>
        )}
        
        <Text style={styles.label}>Телефон:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={tempData.phone}
            onChangeText={(text: string) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{userData.phone}</Text>
        )}
        
        <Text style={styles.label}>Район:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={tempData.district}
            onChangeText={(text: string) => handleInputChange('district', text)}
          />
        ) : (
          <Text style={styles.value}>{userData.district}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, isEditing && styles.saveButton]}
        onPress={handleEdit}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'СОХРАНИТЬ' : 'РЕДАКТИРОВАТЬ'}
        </Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.settingsTitle}>Настройки</Text>
        
        <View style={styles.settingsRow}>
          <Text style={styles.settingLabel}>Уведомления</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleSwitch}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleChangePassword}
      >
        <Text style={styles.buttonText}>ИЗМЕНИТЬ ПАРОЛЬ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#007BFF',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default UserProfile;