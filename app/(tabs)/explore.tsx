import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Briefcase, BookOpen, Check, X, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function ExploreScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });
  
  const profiles = [
    {
      id: '1',
      name: 'Alexandra Chen',
      age: 28,
      location: 'San Francisco, CA',
      specialty: 'UX Research',
      profession: 'Senior UX Researcher',
      bio: 'Passionate about creating user-centered designs that solve real problems. I love conducting research and translating insights into actionable design recommendations.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      age: 31,
      location: 'Boston, MA',
      specialty: 'Machine Learning',
      profession: 'ML Engineer',
      bio: 'Working on cutting-edge AI solutions to solve complex business problems. Always eager to discuss new ideas and collaborate on innovative projects.',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
    {
      id: '3',
      name: 'Priya Sharma',
      age: 26,
      location: 'New York, NY',
      specialty: 'Product Management',
      profession: 'Product Manager',
      bio: 'Product enthusiast with a passion for building solutions that users love. I enjoy connecting business goals with user needs through thoughtful product development.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
  ];
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;
  
  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };
  
  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };
  
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };
  
  const renderProfiles = () => {
    if (currentIndex >= profiles.length) {
      return (
        <View style={styles.noMoreCardsContainer}>
          <Text style={styles.noMoreCardsText}>No more profiles to show</Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return profiles
      .map((profile, index) => {
        if (index < currentIndex) {
          return null;
        } else if (index === currentIndex) {
          return (
            <Animated.View
              key={profile.id}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: position.x },
                    { rotate: rotation },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Image source={{ uri: profile.image }} style={styles.cardImage} />
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.cardGradient}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{profile.name}, {profile.age}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#FFFFFF" />
                    <Text style={styles.locationText}>{profile.location}</Text>
                  </View>
                </View>
                
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Briefcase size={16} color="#FFFFFF" />
                    <Text style={styles.detailText}>{profile.profession}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <BookOpen size={16} color="#FFFFFF" />
                    <Text style={styles.detailText}>{profile.specialty}</Text>
                  </View>
                </View>
                
                <Text style={styles.bioText}>{profile.bio}</Text>
              </View>
              
              <Animated.View
                style={[
                  styles.likeLabel,
                  { opacity: likeOpacity },
                ]}
              >
                <Text style={styles.likeLabelText}>CONNECT</Text>
              </Animated.View>
              
              <Animated.View
                style={[
                  styles.dislikeLabel,
                  { opacity: dislikeOpacity },
                ]}
              >
                <Text style={styles.dislikeLabelText}>PASS</Text>
              </Animated.View>
            </Animated.View>
          );
        } else if (index === currentIndex + 1) {
          return (
            <Animated.View
              key={profile.id}
              style={[
                styles.card,
                styles.nextCard,
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }],
                },
              ]}
            >
              <Image source={{ uri: profile.image }} style={styles.cardImage} />
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.cardGradient}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{profile.name}, {profile.age}</Text>
                </View>
              </View>
            </Animated.View>
          );
        }
      })
      .reverse();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filters</Text>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Specialties</Text>
            <View style={styles.tagsContainer}>
              <TouchableOpacity style={[styles.filterTag, styles.selectedFilterTag]}>
                <Text style={styles.selectedFilterTagText}>Design</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTag}>
                <Text style={styles.filterTagText}>Engineering</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTag}>
                <Text style={styles.filterTagText}>Business</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTag}>
                <Text style={styles.filterTagText}>Marketing</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Location</Text>
            <View style={styles.tagsContainer}>
              <TouchableOpacity style={[styles.filterTag, styles.selectedFilterTag]}>
                <Text style={styles.selectedFilterTagText}>San Francisco</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTag}>
                <Text style={styles.filterTagText}>New York</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTag}>
                <Text style={styles.filterTagText}>Remote</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.cardsContainer}>
        {renderProfiles()}
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.dislikeButton]}
          onPress={swipeLeft}
        >
          <X size={24} color="#E11D48" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.likeButton]}
          onPress={swipeRight}
        >
          <Check size={24} color="#0077B5" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterTag: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterTag: {
    backgroundColor: '#0077B5',
  },
  filterTagText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
  selectedFilterTagText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
  },
  applyButton: {
    backgroundColor: '#0077B5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextCard: {
    top: 10,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  nameContainer: {
    marginBottom: 16,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    marginLeft: 4,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    marginLeft: 8,
  },
  bioText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  likeLabel: {
    position: 'absolute',
    top: 40,
    right: 40,
    padding: 8,
    backgroundColor: '#0077B5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '30deg' }],
  },
  likeLabelText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  dislikeLabel: {
    position: 'absolute',
    top: 40,
    left: 40,
    padding: 8,
    backgroundColor: '#E11D48',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-30deg' }],
  },
  dislikeLabelText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0077B5',
  },
  dislikeButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E11D48',
  },
  noMoreCardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  noMoreCardsText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#0077B5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});