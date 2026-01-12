import { loginUser } from "@/actions/api";
import { initAxiosApi } from "@/services/axios";
import { useAuthStore } from "@/store/authStore";
import { LoginRequest, UserType } from "@/types";
import logger from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const { getUser, isAuthenticated } = useAuthStore();
  const user = getUser();

  logger.log("+================");
  logger.log(isAuthenticated, user);
  logger.log("+================");

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "salon_admin") {
        logger.log("Admin User Logged In");
        router.push("/admin/profile");
      } else {
        logger.log("Customer User Logged In");
        router.push("/customer/home");
      }
    }
  }, [isAuthenticated, user]);

  const [userType, setUserType] = useState<UserType>(null);
  const [email, setEmail] = useState("");
  useEffect(() => {
    userType === "customer"
      ? setEmail("bilal@gmail.com")
      : setEmail("bilal1@gmail.com");
  }, [userType]);

  const [password, setPassword] = useState("12345678");
  const [secureText, setSecureText] = useState(true);

  // Registration mutation
  const logMutation = useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onSuccess: async (data) => {
      logger.log("Login successful:", data);
      // Move to OTP step on success
      await initAxiosApi({ isLoggedIn: true, token: data?.access_token });
      // setStep("otp");
      useAuthStore.getState().login(data?.access_token);
      useAuthStore.getState().setUser(data?.user);

      Alert.alert("Login successful", "You are logged in successfully");
      if (userType === "salon_admin") {
        router.push("/admin/profile");
      } else {
        router.push("/customer/home");
      }
      // router.push("/login")
    },
    onError: (error: any) => {
      logger.log("Registration error:", JSON.stringify(error, null, 2));
      logger.log("Error response:", error?.response?.data);

      // Handle 422 validation errors with detailed messages
      let errorMessage = "Registration failed. Please try again.";

      if (error?.response?.status === 422) {
        const errorData = error.response.data;

        // Handle different error response formats
        if (errorData?.detail) {
          // If detail is an array of validation errors (common in FastAPI)
          if (Array.isArray(errorData?.detail)) {
            errorMessage = errorData?.detail
              .map((err: any) => {
                if (err.msg && err.loc) {
                  return `${err.loc.join(".")}: ${err.msg}`;
                }
                return err.msg || JSON.stringify(err);
              })
              .join("\n");
          } else if (typeof errorData?.detail === "string") {
            errorMessage = errorData?.detail;
          } else {
            errorMessage = JSON.stringify(errorData?.detail);
          }
        } else if (errorData?.errors) {
          // Handle errors object format
          errorMessage = JSON.stringify(errorData?.errors);
        } else if (errorData?.message) {
          errorMessage = errorData?.message;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data?.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Failed", errorMessage);
    },
  });
  const handleLogin = () => {
    if (!userType) {
      Alert.alert("Select Account Type", "Please select Salon or Customer");
      return;
    }

    logger.log("Login Data:", {
      userType,
      email,
      password,
    });
    logMutation.mutate({
      email,
      password,
      userType,
    });
    // Call Login API here
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, userType === "salon_admin" && styles.activeTab]}
          onPress={() => setUserType("salon_admin")}
        >
          <Text
            style={[
              styles.tabText,
              userType === "salon_admin" && styles.activeTabText,
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
        <Text style={styles.buttonText}>
          {logMutation.isPending ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
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
