import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import logger from "@/utils/logger";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { getUser, isAuthenticated } = useAuthStore();
  const user = getUser();

  logger.log("+================");
  logger.log(isAuthenticated, user);
  logger.log("+================");

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000, // same as redirect time
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/home");
    }, 1000);

    if (isAuthenticated) {
      if (user?.role === "salon_admin") {
        logger.log("Admin User Logged In");
        router.push("/admin/profile");
      } else {
        logger.log("Customer User Logged In");
        router.push("/customer/home");
      }
    }
    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.slogan}>Say Yes to Your Dream Look!</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5E6E5",
  },

  logoContainer: {
    marginBottom: 20,
  },

  logo: {
    width: 280,
    height: 280,
  },

  slogan: {
    fontSize: 16,
    color: Colors.light.red,
    marginTop: 10,
    marginBottom: 20,
  },

  progressContainer: {
    width: "70%",
    height: 6,
    backgroundColor: "#E0C2C0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: Colors.light.red,
  },
});
