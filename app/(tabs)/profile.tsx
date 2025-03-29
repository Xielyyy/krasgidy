import React, { useState, createContext, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';

// Тип для данных профиля
type Profile = {
  name: string;
  phone: string;
  district: string;
};

// Тип для настроек
type Settings = {
  notificationsEnabled: boolean;
};

// Контекст для управления состоянием профиля и настроек
type ProfileContextType = {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>({
    name: 'Иванов Иван',
    phone: '+7 (999) 123-45-67',
    district: 'Центральный',
  });

  const [settings, setSettings] = useState<Settings>({
    notificationsEnabled: true,
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile, settings, setSettings }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Компонент для отображения и редактирования профиля
const ProfileSection: React.FC<{ isEditing: boolean; setIsEditing: (value: boolean) => void }> = React.memo(({ isEditing, setIsEditing }) => {
  const { profile, setProfile } = useProfile();

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile((prevProfile) => ({ ...prevProfile, [field]: value }));
  };

  const saveChanges = () => {
    setIsEditing(false);
    // Здесь можно добавить логику для сохранения данных на сервере
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Личные данные</Text>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => handleProfileChange('name', text)}
            placeholder="Имя"
          />
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={(text) => handleProfileChange('phone', text)}
            placeholder="Телефон"
          />
          <TextInput
            style={styles.input}
            value={profile.district}
            onChangeText={(text) => handleProfileChange('district', text)}
            placeholder="Район"
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionText}>Имя: {profile.name}</Text>
          <Text style={styles.sectionText}>Телефон: {profile.phone}</Text>
          <Text style={styles.sectionText}>Район: {profile.district}</Text>
        </>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={isEditing ? saveChanges : () => setIsEditing(true)}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Сохранить' : 'Редактировать'}</Text>
      </TouchableOpacity>
    </View>
  );
});

// Компонент для отображения настроек
const SettingsSection: React.FC = React.memo(() => {
  const { settings, setSettings } = useProfile();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Настройки</Text>
      <View style={styles.settingItem}>
        <Text style={styles.sectionText}>Уведомления</Text>
        <Switch
          value={settings.notificationsEnabled}
          onValueChange={(value) => setSettings((prevSettings) => ({ ...prevSettings, notificationsEnabled: value }))}
        />
      </View>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => console.log('Переход к смене пароля')}
      >
        <Text style={styles.sectionText}>Смена пароля</Text>
      </TouchableOpacity>
    </View>
  );
});

// Основной компонент
export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <ProfileProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Профиль</Text>
        <ProfileSection isEditing={isEditing} setIsEditing={setIsEditing} />
        <SettingsSection />
      </ScrollView>
    </ProfileProvider>
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
    marginBottom: 8,
    color: '#333',
  },
  sectionText: {
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
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});