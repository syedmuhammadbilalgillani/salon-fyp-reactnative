import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ImageEditorScreen() {
  const { imageUri: initialImageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [imageUri, setImageUri] = useState<string | null>(initialImageUri || null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme as keyof typeof Colors];

  // Dummy images for effects
  const effectImages = {
    traditional: require("@/assets/images/eye.png"),
    bold: require("@/assets/images/makeup.png"),
    soft: require("@/assets/images/dress.png"),
  };

  useEffect(() => {
    if (initialImageUri) {
      setImageUri(initialImageUri);
    }
  }, [initialImageUri]);

  /* ======================
     PICK FROM GALLERY
  ====================== */
  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setSelectedEffect(null);
    }
  };

  /* ======================
     OPEN CAMERA
  ====================== */
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setSelectedEffect(null);
    }
  };

  /* ======================
     IMAGE EFFECTS
  ====================== */

  // 🟤 Traditional (Grayscale)
  const applyTraditional = async () => {
    if (!imageUri) {
      setSelectedEffect("traditional");
      return;
    }

    const result = await ImageManipulator.manipulateAsync(imageUri, [], {
      format: ImageManipulator.SaveFormat.PNG,
      compress: 1,
    });

    setImageUri(result.uri);
    setSelectedEffect("traditional");
  };

  // 🔥 Bold (Rotate + Resize)
  const applyBold = async () => {
    if (!imageUri) {
      setSelectedEffect("bold");
      return;
    }

    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ rotate: 90 }, { resize: { width: 350 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    setImageUri(result.uri);
    setSelectedEffect("bold");
  };

  // 🌸 Soft (Blur)
  const applySoft = async () => {
    if (!imageUri) {
      setSelectedEffect("soft");
      return;
    }

    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ flip: ImageManipulator.FlipType.Vertical }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    setImageUri(result.uri);
    setSelectedEffect("soft");
  };

  /* ======================
     DOWNLOAD IMAGE
  ====================== */
  const downloadImage = async () => {
    if (!imageUri) {
      Alert.alert("No image", "Please select an image first");
      return;
    }

    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied");
      return;
    }

    await MediaLibrary.saveToLibraryAsync(imageUri);
    Alert.alert("Success", "Image saved to gallery");
  };

  /* ======================
     SHARE IMAGE
  ====================== */
  const shareImage = async () => {
    if (!imageUri) {
      Alert.alert("No image", "Please select an image first");
      return;
    }

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Sharing not available");
      return;
    }

    await Sharing.shareAsync(imageUri);
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      backgroundColor: themeColors.background,
    },
    title: {
      color: themeColors.text,
    },
    mainBtn: {
      backgroundColor: themeColors.red,
    },
    btnText: {
      color: themeColors.white,
    },
    preview: {
      backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    previewPlaceholder: {
      backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#f0f0f0",
    },
    placeholderText: {
      color: themeColors.icon,
    },
    effectBtn: {
      backgroundColor: colorScheme === "dark" ? "#2a2a2a" : "#1a1a1a",
      borderColor: "transparent",
    },
    effectBtnSelected: {
      borderColor: themeColors.red,
      backgroundColor: colorScheme === "dark" ? "#3a1a1a" : "#2a1a1a",
    },
    effectText: {
      color: themeColors.white,
    },
    actionBtn: {
      backgroundColor: themeColors.red,
    },
    actionText: {
      color: themeColors.white,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.title, dynamicStyles.title]}>Image Editor</Text>

      {/* TOP BUTTONS */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.mainBtn, dynamicStyles.mainBtn]}
          onPress={pickFromGallery}
        >
          <Text style={[styles.btnText, dynamicStyles.btnText]}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainBtn, dynamicStyles.mainBtn]}
          onPress={openCamera}
        >
          <Text style={[styles.btnText, dynamicStyles.btnText]}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGE PREVIEW OR DUMMY IMAGE */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.preview, dynamicStyles.preview]} />
      ) : (
        <View style={[styles.previewPlaceholder, dynamicStyles.previewPlaceholder]}>
          <Text style={[styles.placeholderText, dynamicStyles.placeholderText]}>
            No image selected
          </Text>
        </View>
      )}

      {/* EFFECT BUTTONS WITH DUMMY IMAGES */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.effectBtn,
            dynamicStyles.effectBtn,
            selectedEffect === "traditional" && dynamicStyles.effectBtnSelected,
          ]}
          onPress={applyTraditional}
        >
          <Image
            source={effectImages.traditional}
            style={styles.effectImage}
            resizeMode="cover"
          />
          <Text style={[styles.effectText, dynamicStyles.effectText]}>Traditional</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.effectBtn,
            dynamicStyles.effectBtn,
            selectedEffect === "bold" && dynamicStyles.effectBtnSelected,
          ]}
          onPress={applyBold}
        >
          <Image
            source={effectImages.bold}
            style={styles.effectImage}
            resizeMode="cover"
          />
          <Text style={[styles.effectText, dynamicStyles.effectText]}>Bold</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.effectBtn,
            dynamicStyles.effectBtn,
            selectedEffect === "soft" && dynamicStyles.effectBtnSelected,
          ]}
          onPress={applySoft}
        >
          <Image
            source={effectImages.soft}
            style={styles.effectImage}
            resizeMode="cover"
          />
          <Text style={[styles.effectText, dynamicStyles.effectText]}>Soft</Text>
        </TouchableOpacity>
      </View>

      {/* DOWNLOAD & SHARE */}
      {imageUri && (
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.actionBtn, dynamicStyles.actionBtn]}
            onPress={downloadImage}
          >
            <Text style={[styles.actionText, dynamicStyles.actionText]}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, dynamicStyles.actionBtn]}
            onPress={shareImage}
          >
            <Text style={[styles.actionText, dynamicStyles.actionText]}>Share</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ======================
   STYLES
====================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  mainBtn: {
    padding: 14,
    borderRadius: 8,
    flex: 1,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 20,
  },
  previewPlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
  },
  effectBtn: {
    padding: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    borderWidth: 2,
  },
  effectImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginBottom: 6,
  },
  effectText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
  },
  actionBtn: {
    padding: 14,
    borderRadius: 8,
    flex: 1,
  },
  actionText: {
    textAlign: "center",
    fontWeight: "600",
  },
});