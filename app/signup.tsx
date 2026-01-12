import { registerUser } from "@/actions/api";
import { RegisterRequest, UserType } from "@/types";
import logger from "@/utils/logger";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Signup() {
  const router = useRouter();

  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [userType, setUserType] = useState<UserType>(null);

  const [name, setName] = useState(""); // Add name field

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onSuccess: (data) => {
      logger.log("Registration successful:", data);
      // Move to OTP step on success
      // setStep("otp");
      router.push("/login");
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
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map((err: any) => {
                if (err.msg && err.loc) {
                  return `${err.loc.join(".")}: ${err.msg}`;
                }
                return err.msg || JSON.stringify(err);
              })
              .join("\n");
          } else if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else if (errorData?.errors) {
          // Handle errors object format
          errorMessage = JSON.stringify(errorData.errors);
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Failed", errorMessage);
    },
  });

  const handleSignup = () => {
    if (!userType) {
      Alert.alert("Select Account Type", "Please select Salon or Customer");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // Call Signup API
    registerMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
      role: userType,
    });
  };

  const handleVerifyOtp = () => {
    logger.log("OTP Verify:", {
      email,
      otp,
      userType,
    });

    // Call OTP Verify API
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      {step === "signup" && (
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
      )}

      <Text style={styles.title}>
        {step === "signup" ? "Create Account" : "Verify OTP"}
      </Text>

      {step === "signup" ? (
        <>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </View>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={securePassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setSecurePassword(!securePassword)}
            >
              <Ionicons
                name={securePassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Retype Password"
              secureTextEntry={secureConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
            >
              <Ionicons
                name={secureConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[
              styles.button,
              registerMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleSignup}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.linkText}> Login</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* OTP */}
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonDisabled: {
    opacity: 0.6,
  },
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#9B1B30",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#F2F2F2",
  },
  button: {
    backgroundColor: "#9B1B30",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
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
  linkText: {
    fontSize: 14,
    color: "#9B1B30",
    fontWeight: "bold",
  },
});
