import { useRouter } from "expo-router";
import React from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomePage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/hello.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whiteTextButton}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.registerText}>Create new account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // optional dark overlay
    justifyContent: "flex-end",
    padding: 20,
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: "#9B1B30",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  whiteTextButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    color: "#9B1B30",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#9B1B30",
    fontSize: 18,
    fontWeight: "bold",
  },
});
