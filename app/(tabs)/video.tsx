import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Modal, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Mic, MicOff, Video as VideoIcon, VideoOff, MessageSquare, X, Phone, Lock, Shield } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function VideoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi there! Great to connect.', sender: 'other', time: '10:30 AM' },
    { id: '2', text: 'Hello! Yes, excited to chat about UX design.', sender: 'self', time: '10:31 AM' },
    { id: '3', text: 'What projects are you currently working on?', sender: 'other', time: '10:32 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const chatWidth = useSharedValue(0);
  
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);
  
  const animatedChatStyle = useAnimatedStyle(() => {
    return {
      width: chatWidth.value,
    };
  });
  
  const toggleChat = () => {
    if (isChatOpen) {
      chatWidth.value = withTiming(0);
    } else {
      chatWidth.value = withTiming(300);
    }
    setIsChatOpen(!isChatOpen);
  };
  
  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'self',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };
  
  const handleEndCall = () => {
    // In a real app, this would handle ending the WebRTC connection
    // and potentially showing a feedback screen
    setIsPremiumModalOpen(true);
  };
  
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need camera permission to enable video calls.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.videoContainer}>
        {/* Remote user's video */}
        <View style={styles.remoteVideoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }} 
            style={styles.remoteVideo}
          />
          <View style={styles.userInfoOverlay}>
            <Text style={styles.remoteUserName}>Alexandra Chen</Text>
            <Text style={styles.remoteUserTitle}>UX Researcher</Text>
          </View>
        </View>
        
        {/* Local user's video */}
        <View style={styles.localVideoContainer}>
          {isCameraOn ? (
            <CameraView 
              style={styles.localVideo} 
              facing="front"
            />
          ) : (
            <View style={styles.cameraOffContainer}>
              <VideoOff size={24} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        {/* Chat panel */}
        <Animated.View style={[styles.chatPanel, animatedChatStyle]}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat</Text>
            <TouchableOpacity onPress={toggleChat}>
              <X size={20} color="#0F172A" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message) => (
              <View 
                key={message.id} 
                style={[
                  styles.messageContainer,
                  message.sender === 'self' ? styles.selfMessage : styles.otherMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
      
      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, !isMicOn && styles.controlButtonOff]} 
          onPress={() => setIsMicOn(!isMicOn)}
        >
          {isMicOn ? (
            <Mic size={24} color="#FFFFFF" />
          ) : (
            <MicOff size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]} 
          onPress={handleEndCall}
        >
          <Phone size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, !isCameraOn && styles.controlButtonOff]} 
          onPress={() => setIsCameraOn(!isCameraOn)}
        >
          {isCameraOn ? (
            <VideoIcon size={24} color="#FFFFFF" />
          ) : (
            <VideoOff size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, isChatOpen && styles.controlButtonActive]} 
          onPress={toggleChat}
        >
          <MessageSquare size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Premium Modal */}
      <Modal
        visible={isPremiumModalOpen}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upgrade to Premium</Text>
              <TouchableOpacity onPress={() => setIsPremiumModalOpen(false)}>
                <X size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.premiumFeaturesContainer}>
              <Text style={styles.premiumSubtitle}>Unlock Premium Features</Text>
              
              <FlatList
                data={[
                  { 
                    id: '1', 
                    title: 'Priority Matching', 
                    description: 'Get matched with professionals faster',
                    icon: <Lock size={20} color="#0077B5" /> 
                  },
                  { 
                    id: '2', 
                    title: 'Advanced Filters', 
                    description: 'Filter by experience, company, and more',
                    icon: <Shield size={20} color="#0077B5" /> 
                  },
                  { 
                    id: '3', 
                    title: 'Unlimited Calls', 
                    description: 'No restrictions on call duration or frequency',
                    icon: <Phone size={20} color="#0077B5" /> 
                  },
                ]}
                renderItem={({ item }) => (
                  <View style={styles.premiumFeatureItem}>
                    <View style={styles.featureIconContainer}>
                      {item.icon}
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>{item.title}</Text>
                      <Text style={styles.featureDescription}>{item.description}</Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.premiumFeaturesList}
              />
              
              <View style={styles.pricingContainer}>
                <View style={styles.planContainer}>
                  <Text style={styles.planDuration}>Monthly</Text>
                  <Text style={styles.planPrice}>$9.99</Text>
                </View>
                <View style={styles.planContainer}>
                  <Text style={styles.planDuration}>Yearly</Text>
                  <Text style={styles.planPrice}>$69.99</Text>
                  <Text style={styles.planSavings}>Save 40%</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsPremiumModalOpen(false)}
              >
                <Text style={styles.closeButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  permissionButton: {
    backgroundColor: '#0077B5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  userInfoOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 8,
  },
  remoteUserName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  remoteUserTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  localVideo: {
    flex: 1,
  },
  cameraOffContainer: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: 'Inter_600SemiBold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  selfMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0077B5',
    borderTopRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    fontFamily: 'Inter_400Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  sendButton: {
    backgroundColor: '#0077B5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonOff: {
    backgroundColor: '#475569',
  },
  controlButtonActive: {
    backgroundColor: '#0077B5',
  },
  endCallButton: {
    backgroundColor: '#E11D48',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: 'Inter_600SemiBold',
  },
  premiumFeaturesContainer: {
    padding: 16,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  premiumFeaturesList: {
    marginBottom: 16,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 119, 181, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  planContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  planDuration: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  planSavings: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  upgradeButton: {
    backgroundColor: '#0077B5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});