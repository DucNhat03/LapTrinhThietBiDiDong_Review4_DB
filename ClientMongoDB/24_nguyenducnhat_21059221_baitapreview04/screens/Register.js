import React, { useState } from "react";
import CheckBox from "react-native-check-box";
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
import { launchImageLibrary } from "react-native-image-picker";  // Thêm thư viện chọn ảnh


export default function Register({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);  // Checkbox đồng ý
  const [isChecked2, setIsChecked2] = useState(false); // Hiển thị mật khẩu
  const [username, setUsername] = useState(""); // Lưu username
  const [email, setEmail] = useState("");       // Lưu email
  const [password, setPassword] = useState(""); // Lưu password
  const [avatar, setAvatar] = useState(null);   // Lưu ảnh đại diện

  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    checkbox: false,
  });

  const handleContinue = async () => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);

  // Gửi ảnh đại diện nếu người dùng đã chọn
  if (avatar) {
    formData.append("avatar", {
      uri: avatar.uri,
      type: avatar.type || 'image/jpeg',
      name: avatar.fileName || 'avatar.jpg',
    });
  } else {
    formData.append("avatar", {
      uri: 'default.jpg',  // Ảnh mặc định trên server
      type: 'image/jpeg',
      name: 'default.jpg',
    });
  }

  try {
    const response = await axios.post("http://localhost:3000/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      Alert.alert("Thông báo", "Đăng ký thành công!");
      navigation.navigate("Login");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng ký.");
  }
};



  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
      },
      (response) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          console.log("ImagePicker Error: ", response.errorMessage);
        } else {
          const selectedImage = response.assets[0];
          setAvatar(selectedImage);  // Lưu ảnh đại diện vào state
          console.log("Avatar selected: ", selectedImage);
        }
      }
    );
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {/* Phần tiêu đề phía trên */}
      <View style={{ width: "100%" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/back.png")}
            style={{
              marginLeft: 20,
              marginTop: 20,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Phần nội dung chính */}
      <View style={{ width: "100%" }}>
        <View
          style={{
            marginTop: 0,
            backgroundColor: "white",
            width: "100%",
            height: 600,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          {/* Phần hiển thị hình ảnh và tiêu đề */}
          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Image
              source={require("../assets/logoo.png")}
              style={{ width: 70, height: 70, borderRadius: 100 }}
              resizeMode="cover"
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              Nice to see you! !
            </Text>
            <Text style={{ fontSize: 15, opacity: 0.6 }}>Create your account</Text>
          </View>

          {/* Input cho username */}
          <View style={{ marginTop: 20, marginLeft: 20, borderRadius: 15 }}>
            <Image
              source={require("../assets/account.png")}
              style={{
                width: 25,
                height: 25,
                resizeMode: "contain",
                marginLeft: 10,
                marginTop: 23,
                position: "absolute",
              }}
            />
            <TextInput
              placeholder={errors.username ? "Username is required" : "Enter your username"}
              style={[
                styles.input,
                { borderColor: errors.username ? "red" : "#EEEEEE" },
              ]}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Input cho email */}
          <View style={{ marginTop: 0, marginLeft: 20, borderRadius: 15 }}>
            <Image
              source={require("../assets/email.png")}
              style={{
                width: 22,
                height: 22,
                resizeMode: "contain",
                marginLeft: 10,
                marginTop: 23,
                position: "absolute",
              }}
            />
            <TextInput
              placeholder={errors.email ? "Email is required" : "Enter your email address"}
              style={[
                styles.input,
                { borderColor: errors.email ? "red" : "#EEEEEE" },
              ]}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Input cho password */}
          <View style={{ marginTop: 0, marginLeft: 20, borderRadius: 15 }}>
            <Image
              source={require("../assets/lock.png")}
              style={{
                width: 27,
                height: 27,
                resizeMode: "contain",
                marginLeft: 10,
                marginTop: 23,
                position: "absolute",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setIsChecked2(!isChecked2);  // Hiển thị/ẩn mật khẩu
              }}
            >
              <Image
                source={require("../assets/eye.png")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                  right: 35,
                  marginTop: 23,
                  position: "absolute",
                  transform: [{ rotate: "180deg" }],
                }}
              />
            </TouchableOpacity>

            <TextInput
              placeholder={errors.password ? "Password is required" : "Enter your password"}
              secureTextEntry={!isChecked2}
              style={[
                styles.input,
                { borderColor: errors.password ? "red" : "#EEEEEE" },
              ]}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Checkbox đồng ý điều kiện */}
          <View style={{ marginTop: 0, marginLeft: 20, borderRadius: 15 }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <View>
                <CheckBox
                  isChecked={isChecked}
                  onClick={() => setIsChecked(!isChecked)}
                />
              </View>
              <Text style={{ marginLeft: 10 }}>I agree with </Text>
              <Text style={{ color: "#33CCFF", fontWeight: "bold" }}>
                Terms & Conditions
              </Text>
            </View>
            {errors.checkbox && (
              <Text style={{ color: "red", marginLeft: 20 }}>
                You must agree to the Terms & Conditions
              </Text>
            )}
          </View>

          {/* Thêm mục upload ảnh dưới các ô nhập */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            {avatar ? (
              <Image
                source={{ uri: avatar.uri }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <Image
                source={require("../assets/homeicon.png")}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />
            )}
            <TouchableOpacity onPress={selectImage}>
              <Text style={{ color: "#33CCFF", fontWeight: "bold", marginTop: 10 }}>
                Upload Profile Picture
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nút "Continue" */}
          <View style={{ marginTop: 25, marginLeft: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#33CCFF",
                borderRadius: 10,
                width: "95%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleContinue}
            >
              <Text style={{ fontSize: 20, color: "white" }}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#EEEEEE",
    height: 50,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "95%",
    fontSize: 18,
    paddingLeft: 50,
  },
});
