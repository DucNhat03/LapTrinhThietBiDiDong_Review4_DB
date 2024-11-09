import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import axios from "axios";

export default function Profile({ navigation, route }) {
  const { user } = route.params; // Lấy thông tin user từ route
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        username: user.username,
        email: user.email,
        password: "******", // Ẩn mật khẩu
      });
    }
  }, [user]);

  const handleDeleteAccount = async () => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/users?email=${userData.email}`
    ); // Xóa user theo email
    if (response.status === 200) {
      Alert.alert("Thông báo", "Tài khoản đã bị xóa thành công!");
      navigation.navigate("Login"); // Quay về trang đăng nhập
    }
  } catch (error) {
    console.error("Lỗi:", error);
    Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa tài khoản.");
  }
};

  const handleLogout = () => {
    Alert.alert("Thông báo", "Đã đăng xuất!");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <Image
          source={require("../assets/logoo.png")}
          style={styles.avatar}
        />
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={userData.username}
          editable={false}
          style={styles.input}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={userData.email}
          editable={false}
          style={styles.input}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={userData.password}
          secureTextEntry={true}
          editable={false}
          style={styles.input}
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6", padding: 20 },
  header: { alignItems: "center", marginBottom: 30 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginTop: 10 },
  infoContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#555", marginBottom: 5 },
  input: {
    backgroundColor: "white",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: "#DDD",
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  deleteButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
