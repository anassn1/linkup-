import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Clock } from 'lucide-react-native';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  image: string;
  unread: number;
}

interface ScheduledCall {
  id: string;
  name: string;
  date: string;
  image: string;
}

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Alexandra Chen',
      lastMessage: 'Looking forward to our video call tomorrow!',
      time: '10:30 AM',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      unread: 2,
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      lastMessage: "I enjoyed our conversation about machine learning. Let's connect again soon!",
      time: 'Yesterday',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      unread: 0,
    },
    {
      id: '3',
      name: 'Priya Sharma',
      lastMessage: 'Thanks for the product management advice!',
      time: 'Yesterday',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      unread: 0,
    },
    {
      id: '4',
      name: 'David Kim',
      lastMessage: "Let's schedule another meeting next week.",
      time: 'Monday',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
      unread: 0,
    },
  ];

  const scheduledCalls: ScheduledCall[] = [
    {
      id: '1',
      name: 'Alexandra Chen',
      date: 'Today, 3:00 PM',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      id: '2',
      name: 'Michael Chen',
      date: 'Tomorrow, 11:00 AM',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
  ];

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.conversationItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>

      <View style={styles.conversationDetails}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        <Text
          style={[
            styles.conversationMessage,
            item.unread > 0 && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderScheduledCallItem = ({ item }: { item: ScheduledCall }) => (
    <TouchableOpacity style={styles.scheduledCallItem}>
      <Image source={{ uri: item.image }} style={styles.callAvatar} />
      <View style={styles.callDetails}>
        <Text style={styles.callName}>{item.name}</Text>
        <View style={styles.callTimeContainer}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.callTime}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.joinCallButton}>
        <Text style={styles.joinCallButtonText}>Join</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.newChatButton}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {scheduledCalls.length > 0 && (
        <View style={styles.scheduledCallsContainer}>
          <Text style={styles.sectionTitle}>Scheduled Calls</Text>
          <FlatList
            data={scheduledCalls}
            renderItem={renderScheduledCallItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scheduledCallsList}
          />
        </View>
      )}

      <View style={styles.conversationsContainer}>
        <Text style={styles.sectionTitle}>Recent Conversations</Text>
        {filteredConversations.length > 0 ? (
          <FlatList
            data={filteredConversations}
            renderItem={renderConversationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.conversationsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16 },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  newChatButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0077B5', justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#0F172A' },
  scheduledCallsContainer: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', paddingHorizontal: 16, marginBottom: 12 },
  scheduledCallsList: { paddingLeft: 16, paddingRight: 8 },
  scheduledCallItem: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginRight: 12, flexDirection: 'row', alignItems: 'center', width: 280, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  callAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  callDetails: { flex: 1 },
  callName: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  callTimeContainer: { flexDirection: 'row', alignItems: 'center' },
  callTime: { fontSize: 14, color: '#64748B', marginLeft: 4 },
  joinCallButton: { backgroundColor: '#0077B5', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  joinCallButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
  conversationsContainer: { flex: 1 },
  conversationsList: { paddingHorizontal: 16, paddingBottom: 16 },
  conversationItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  unreadBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#0077B5', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  unreadText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  conversationDetails: { flex: 1, justifyContent: 'center' },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  conversationName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  conversationTime: { fontSize: 12, color: '#64748B' },
  conversationMessage: { fontSize: 14, color: '#64748B' },
  unreadMessage: { fontWeight: '500', color: '#0F172A' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 16, color: '#64748B' },
});
