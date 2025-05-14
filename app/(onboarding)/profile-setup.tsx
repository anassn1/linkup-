import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight, Camera } from 'lucide-react-native';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    age: '',
    location: '',
    specialty: '',
    profession: 'working professional', // Default value
    bio: '',
    interests: '',
    isVisible: true,
  });

  const professionOptions = ['student', 'graduate', 'working professional'];

  const handleChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const updatedUser = {
      ...user,
      ...profileData,
      onboardingComplete: true,
      id: user?.id ?? '', // ✅ fix for TypeScript error
    };

    updateUser(updatedUser);
    router.replace('/' as any); // ✅ fix for router type error
  };

  const isFormValid = () => {
    const { age, location, specialty, profession, bio } = profileData;
    return age && location && specialty && profession && bio;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Let others know about your expertise and interests
        </Text>
      </View>

      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: user?.profilePicture || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <Camera size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={user?.name || ''}
            editable={false}
            placeholder="Your name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={profileData.age}
            onChangeText={(text) => handleChange('age', text)}
            placeholder="Your age"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={profileData.location}
            onChangeText={(text) => handleChange('location', text)}
            placeholder="City, Country"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Specialty</Text>
          <TextInput
            style={styles.input}
            value={profileData.specialty}
            onChangeText={(text) => handleChange('specialty', text)}
            placeholder="e.g., Machine Learning, Marketing"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profession</Text>
          <View style={styles.optionsContainer}>
            {professionOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  profileData.profession === option && styles.selectedOption,
                ]}
                onPress={() => handleChange('profession', option)}
              >
                <Text style={[
                  styles.optionText,
                  profileData.profession === option && styles.selectedOptionText,
                ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={profileData.bio}
            onChangeText={(text) => handleChange('bio', text)}
            placeholder="Tell others about yourself"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interests</Text>
          <TextInput
            style={styles.input}
            value={profileData.interests}
            onChangeText={(text) => handleChange('interests', text)}
            placeholder="e.g., AI, Blockchain, Design"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.visibilityContainer}>
            <Text style={styles.label}>Visible to Others</Text>
            <Switch
              value={profileData.isVisible}
              onValueChange={(value) => handleChange('isVisible', value)}
              trackColor={{ false: '#D1D5DB', true: '#0077B5' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Text style={styles.helperText}>
            Toggle off to become invisible in the matching system
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !isFormValid() && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!isFormValid()}
      >
        <Text style={styles.submitButtonText}>Complete Setup</Text>
        <ChevronRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentContainer: { paddingHorizontal: 24, paddingVertical: 48 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748B', lineHeight: 24 },
  profileImageContainer: { alignItems: 'center', marginBottom: 32, position: 'relative' },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  cameraButton: {
    position: 'absolute', bottom: 0, right: '35%',
    backgroundColor: '#0077B5', width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#FFFFFF',
  },
  formContainer: { marginBottom: 32 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, color: '#0F172A',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  optionButton: {
    flex: 1, backgroundColor: '#F8FAFC', paddingVertical: 12, marginHorizontal: 4,
    borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0',
  },
  selectedOption: { backgroundColor: '#0077B5', borderColor: '#0077B5' },
  optionText: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  selectedOptionText: { color: '#FFFFFF' },
  visibilityContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  helperText: { fontSize: 14, color: '#64748B', marginTop: 4 },
  submitButton: {
    backgroundColor: '#0077B5', paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
  },
  disabledButton: { backgroundColor: '#94A3B8' },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginRight: 8 },
});
