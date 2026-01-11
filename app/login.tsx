import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type UserType = "salon" | "customer" | null;

export default function Login() {
  const router = useRouter();

  const [userType, setUserType] = useState<UserType>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  const handleLogin = () => {
    if (!userType) {
      Alert.alert("Select Account Type", "Please select Salon or Customer");
      return;
    }

    console.log("Login Data:", {
      userType,
      email,
      password,
    });

    // Call Login API here
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, userType === "salon" && styles.activeTab]}
          onPress={() => setUserType("salon")}
        >
          <Text
            style={[
              styles.tabText,
              userType === "salon" && styles.activeTabText,
            ]}
          >
            Salon
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, userType === "customer" && styles.activeTab]}
          onPress={() => setUserType("customer")}
        >
          <Text
            style={[
              styles.tabText,
              userType === "customer" && styles.activeTabText,
            ]}
          >
            Customer
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? "eye-off" : "eye"}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/admin/profile")}>
          <Text style={styles.signupText}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    marginBottom: 25,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#9B1B30",
  },
  tabText: {
    fontSize: 16,
    color: "#9B1B30",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },

  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#9B1B30",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#9B1B30",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    fontSize: 14,
    color: "#444",
  },
  signupText: {
    fontSize: 14,
    color: "#9B1B30",
    fontWeight: "bold",
  },
});
