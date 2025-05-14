import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';
import { Linkedin } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_SECRET ?? '';
const REDIRECT_URI = process.env.EXPO_PUBLIC_LINKEDIN_REDIRECT_URI ?? AuthSession.makeRedirectUri();

const discovery = {
  authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  revocationEndpoint: 'https://www.linkedin.com/oauth/v2/revoke',
};

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['r_liteprofile', 'r_emailaddress'],
      redirectUri: REDIRECT_URI,
      responseType: 'code',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleLinkedInCallback(code);
    } else if (response?.type === 'error' || response?.type === 'dismiss') {
      setIsLoading(false);
    }
  }, [response]);

  async function handleLinkedInCallback(code: string) {
    try {
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
        }).toString(),
      });

      const tokenData = await tokenResponse.json();

      const profileResponse = await fetch(
        'https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))',
        { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
      );
      const profileData = await profileResponse.json();

      const emailResponse = await fetch(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
      );
      const emailData = await emailResponse.json();

      const userData = {
        id: profileData.id,
        name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
        email: emailData.elements[0]['handle~'].emailAddress,
        profilePicture: profileData.profilePicture?.['displayImage~']?.elements[0]?.identifiers[0]?.identifier,
        headline: 'LinkedIn Member',
        token: tokenData.access_token,
      };

      await signIn(userData);
      router.replace('/(onboarding)/profile-setup');
    } catch (error) {
      console.error('LinkedIn auth error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient colors={['#0077B5', '#00A0DC', '#E6F7FF']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LinkUp</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>Connect with Professionals</Text>
          <Text style={styles.subtitle}>Join thousands of students and professionals for meaningful 1-on-1 video networking</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.linkedinButton}
            onPress={() => {
              setIsLoading(true);
              promptAsync().catch(() => setIsLoading(false));
            }}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <><Linkedin color="#FFFFFF" size={24} /><Text style={styles.buttonText}>Continue with LinkedIn</Text></>}
          </TouchableOpacity>
        </View>

        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>By continuing, you agree to LinkUp's Terms of Service and Privacy Policy</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoText: { fontSize: 48, fontWeight: '700', color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.15)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 10 },
  infoContainer: { marginBottom: 48, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#FFFFFF', textAlign: 'center', lineHeight: 24 },
  buttonContainer: { marginBottom: 24 },
  linkedinButton: { backgroundColor: '#0077B5', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 12 },
  legalContainer: { alignItems: 'center', paddingHorizontal: 24 },
  legalText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' },
});
