import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/logo.png')}
          style={styles.logo} 
        />
      </View>
      <Text style={styles.slogan}>Say Yes to Your Dream Look!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6E5',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 400,
    height: 400,
  },
  slogan: {
    fontSize: 16,
    color: '#9B1B30',
    marginTop: 20,
  },
});