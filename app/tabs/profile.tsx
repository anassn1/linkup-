import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

import { User as UserIcon, Settings, Bell, CreditCard, Lock, Shield, LogOut, Camera, ChevronRight, Eye, EyeOff } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();

  const [isVisible, setIsVisible] = useState(user?.isVisible ?? true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

const handleVisibilityToggle = (value: boolean) => {
  if (!user) return; // <- prevent unsafe spread of possibly undefined user
  setIsVisible(value);
  updateUser({
    ...user,
    isVisible: value,
  });
};


  const handleUpgrade = () => {
    Alert.alert(
      'Premium Subscription',
      'Ready to unlock all premium features?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Navigate to payment') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user?.profilePicture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{user?.name || 'Your Name'}</Text>
          <Text style={styles.profileHeadline}>{user?.headline || 'Your Headline'}</Text>

          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>About Me</Text>
          <Text style={styles.infoCardText}>{user?.bio || 'Add a bio to tell others about yourself, your experience, and your interests.'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Professional Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Specialty</Text>
            <Text style={styles.infoValue}>{user?.specialty || 'Not specified'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Profession</Text>
            <Text style={styles.infoValue}>{user?.profession || 'Not specified'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{user?.location || 'Not specified'}</Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                {isVisible ? (
                  <Eye size={20} color="#0F172A" />
                ) : (
                  <EyeOff size={20} color="#0F172A" />
                )}
                <Text style={styles.settingLabel}>Visible to Others</Text>
              </View>
              <Switch
                value={isVisible}
                onValueChange={handleVisibilityToggle}
                trackColor={{ false: '#D1D5DB', true: '#0077B5' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.settingDescription}>
              When turned off, you won't appear in the matching system
            </Text>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Bell size={20} color="#0F172A" />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#0077B5' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <Text style={styles.settingDescription}>
              Receive alerts for new matches and messages
            </Text>
          </View>

          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Lock size={20} color="#0F172A" />
                <Text style={styles.settingLabel}>Privacy</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} onPress={handleUpgrade}>
            <View style={styles.premiumContainer}>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>PREMIUM</Text>
              </View>
              <View style={styles.settingLabelContainer}>
                <CreditCard size={20} color="#0F172A" />
                <Text style={styles.settingLabel}>Subscription</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </View>
            <Text style={styles.settingDescription}>
              Upgrade to unlock premium features
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Shield size={20} color="#0F172A" />
                <Text style={styles.settingLabel}>Security</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <LogOut size={20} color="#E11D48" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  settingsButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  profileImageContainer: { position: 'relative', marginBottom: 16 },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0077B5', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  profileName: { fontSize: 24, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  profileHeadline: { fontSize: 16, color: '#64748B', marginBottom: 16 },
  editProfileButton: { backgroundColor: '#0077B5', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  editProfileButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  infoCardTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginBottom: 12 },
  infoCardText: { fontSize: 14, color: '#64748B', lineHeight: 22 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  infoLabel: { fontSize: 14, color: '#64748B' },
  infoValue: { fontSize: 14, color: '#0F172A', fontWeight: '500' },
  settingsSection: { marginHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginBottom: 16 },
  settingCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabelContainer: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '500', color: '#0F172A', marginLeft: 12 },
  settingDescription: { fontSize: 14, color: '#64748B', marginTop: 8 },
  premiumContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  premiumBadge: { backgroundColor: '#FFB636', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, position: 'absolute', top: -10, left: 0 },
  premiumText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, marginHorizontal: 16, marginBottom: 32, backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1, borderColor: '#FECACA' },
  logoutButtonText: { fontSize: 16, fontWeight: '500', color: '#E11D48', marginLeft: 8 },
});
