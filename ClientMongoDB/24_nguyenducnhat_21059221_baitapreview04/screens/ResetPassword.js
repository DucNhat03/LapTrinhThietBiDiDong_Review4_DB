import React, { useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";

export default function ResetPassword({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [userId, setUserId] = useState(""); 
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [errors, setErrors] = useState({
    userId: false,
    password: false,
    passwordMismatch: false,
  });

  const handleResetPassword = async () => {
  const newErrors = {
    userId: false, // Không cần kiểm tra userId nữa
    password: password === "",
    passwordMismatch: password !== passwordRepeat,
  };
  setErrors(newErrors);

  if (Object.values(newErrors).includes(true)) {
    console.log("Có lỗi trong biểu mẫu");
    return;
  }

  try {
    const response = await axios.patch(
      `http://localhost:3000/users/email/${userId}`, // Thay userId bằng email
      { password }
    );

    console.log("Response:", response.data);

    if (response.status === 200) {
      Alert.alert("Thông báo", "Mật khẩu đã được thay đổi!");
      navigation.navigate("Login");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    Alert.alert("Lỗi", "Có lỗi xảy ra khi thay đổi mật khẩu.");
  }
};

  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Image
            source={require("../assets/back.png")}
            style={{ marginLeft: 20, marginTop: 20, width: 25, height: 25 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Image
            source={require("../assets/resetpassword.png")}
            style={{ width: 120, height: 120, borderRadius: 100 }}
            resizeMode="cover"
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Reset Password
          </Text>
          <Text style={{ fontSize: 15, opacity: 0.6 }}>
            Reset your password
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder={
              errors.userId ? "User ID is required" : "Enter your email"
            }
            style={[
              styles.input,
              { borderColor: errors.userId ? "red" : "#EEEEEE" },
            ]}
            value={userId}
            onChangeText={setUserId}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter new password"
            secureTextEntry={!isChecked2}
            style={[
              styles.input,
              { borderColor: errors.password ? "red" : "#EEEEEE" },
            ]}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setIsChecked2(!isChecked2)}
            style={styles.eyeButton}
          >
            <Image
              source={require("../assets/eye.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Repeat new password"
            secureTextEntry={!isChecked}
            style={[
              styles.input,
              {
                borderColor: errors.passwordMismatch ? "red" : "#EEEEEE",
              },
            ]}
            value={passwordRepeat}
            onChangeText={setPasswordRepeat}
          />
          <TouchableOpacity
            onPress={() => setIsChecked(!isChecked)}
            style={styles.eyeButton}
          >
            <Image
              source={require("../assets/eye.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>

        {errors.passwordMismatch && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    backgroundColor: "#EEEEEE",
    height: 50,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  buttonContainer: {
    marginTop: 25,
  },
  resetButton: {
    backgroundColor: "#33CCFF",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 20,
    color: "white",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
