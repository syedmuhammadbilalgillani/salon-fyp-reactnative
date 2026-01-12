import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("screen");
const SIDEBAR_WIDTH = width * 0.75;

const Index = () => {
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleUploadPress = async () => {
    // Request permission
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photos");
      return;
    }

    // Open gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      // Navigate to uploader with image URI
      router.push({
        pathname: "/customer/uploader",
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  const toggleSidebar = () => {
    Animated.timing(translateX, {
      toValue: open ? -SIDEBAR_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const images = [
    { src: require("@/assets/images/eye.png"), title: "Eye Makeup" },
    { src: require("@/assets/images/makeup.png"), title: "Makeup looks" },
    { src: require("@/assets/images/dress.png"), title: "Dress Preview" },
  ];
  const bottomImages = [
    { src: require("@/assets/images/ring.png"), title: "Jewelry" },
    { src: require("@/assets/images/hair.png"), title: "Hairstyles" },
    { src: require("@/assets/images/heart.png"), title: "Favorite looks" },
  ];
  return (
    <ScrollView style={styles.container}>
      {/* Sidebar Overlay */}
      {open && <Pressable style={styles.overlay} onPress={toggleSidebar} />}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <Text style={styles.sidebarTitle}>Menu</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="home-outline" size={20} color={"white"} />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={20} color={"white"} />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={20} color={"white"} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>{" "}
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: height * 0.76,
        }}
      >
        <View
          style={{
            height: height / 3,
            backgroundColor: Colors.light.red,
            borderBottomEndRadius: 50,
            borderBottomStartRadius: 50,
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.title}>Virtual Try-on</Text>
          <Text style={{ color: Colors.light.white, fontSize: 18 }}>
            Makeup looks
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 12,
              marginTop: 12,
            }}
          >
            {images.map((imgSrc, index) => (
              <View key={index} style={{ alignItems: "center" }}>
                <Image
                  key={index}
                  source={imgSrc.src}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                  resizeMode="contain"
                />
                <Text style={{ color: Colors.light.white, fontSize: 18 }}>
                  {imgSrc.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            justifyContent: "center",
            marginVertical: "auto",
          }}
        >
         <TouchableOpacity
            style={{
              display: "flex",
              backgroundColor: Colors.light.red,
              flexDirection: "row",
              paddingHorizontal: 10,
              width: "70%",
              justifyContent: "center",
              paddingVertical: 10,
              borderRadius: 7,
            }}
            onPress={handleUploadPress}
          >
            <Text style={{ fontSize: 16, color: Colors.light.white }}>
              <Ionicons
                style={{ color: Colors.light.white }}
                name="cloud-upload-outline"
                size={20}
              />{" "}
              Upload your image
            </Text>
          </TouchableOpacity>
        
        </View>
        <View
          style={{
            height: height / 3,
            backgroundColor: Colors.light.red,

            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.title}>Virtual Try-on</Text>
          <Text style={{ color: Colors.light.white, fontSize: 18 }}>
            Makeup looks
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 12,
              marginTop: 12,
            }}
          >
            {bottomImages.map((imgSrc, index) => (
              <View key={index} style={{ alignItems: "center" }}>
                <Image
                  key={index}
                  source={imgSrc.src}
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                  resizeMode="contain"
                />
                <Text style={{ color: Colors.light.white, fontSize: 18 }}>
                  {imgSrc.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },

  header: {
    height: 60,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 4,
  },

  logo: {
    height: 80,
    width: 80,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.light.white,
  },

  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.light.red,
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 100,
    elevation: 10,
  },

  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.light.white,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.white,
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 50,
  },
});

export default Index;
