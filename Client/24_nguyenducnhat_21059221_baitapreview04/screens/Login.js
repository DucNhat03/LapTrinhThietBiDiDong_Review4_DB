import React, { useState , useEffect} from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Alert
} from "react-native";

export default function Login({ navigation, route }) {
  // Lấy mảng userData từ Screen_03 được truyền qua navigation

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked3, setIsChecked3] = useState(false);

   const [errors, setErrors] = useState({
    email: false,
    password: false,
    invalidLogin: false,
  });

  // Lấy danh sách người dùng từ API khi component được mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/users") // Gọi API GET để lấy danh sách người dùng
      .then((response) => {
        setUsers(response.data); // Lưu danh sách người dùng vào state
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu người dùng.");
      });
  }, []);

  // Hàm xử lý khi người dùng nhấn nút "Login"
  const handleLogin = () => {
    const newErrors = {
      email: email === "",
      password: password === "",
      invalidLogin: false,
    };
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Kiểm tra xem người dùng có tồn tại trong danh sách không
    const user = users.find(
      (user) =>
        user.email.trim().toLowerCase() === trimmedEmail &&
        user.password.trim() === trimmedPassword
    );

    if (user) {
      Alert.alert("Thông báo", "Đăng nhập thành công!");
      navigation.navigate("Screen01"); // Điều hướng đến màn hình tiếp theo nếu đăng nhập thành công
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, invalidLogin: true }));
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/photo1.png")}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
        </View>

        {/* Input cho email */}
        <View style={styles.inputContainer}>
          <Image
            source={require("../assets/lock.png")}
            style={styles.icon}
          />
          <TextInput
            placeholder={errors.email ? "Email is required" : "Enter your email"}
            style={[
              styles.input,
              { borderColor: errors.email ? "red" : "#EEEEEE" }, // Đổi màu viền nếu có lỗi
            ]}
            value={email}
            onChangeText={setEmail} // Cập nhật email khi người dùng nhập
          />
          {errors.email && (
            <Text style={styles.errorText}>Please enter your email.</Text>
          )}
        </View>

        {/* Input cho password */}
        <View style={styles.inputContainer}>
          <Image
            source={require("../assets/lock.png")}
            style={styles.icon}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => {
              setIsChecked3(!isChecked3); // Hiển thị/ẩn mật khẩu
            }}
          >
            <Image
              source={require("../assets/eye.png")}
              style={[
                styles.eyeIcon,
                { transform: [{ rotate: isChecked3 ? "0deg" : "180deg" }] },
              ]}
            />
          </TouchableOpacity>
          <TextInput
            placeholder={errors.password ? "Password is required" : "Enter your password"}
            secureTextEntry={!isChecked3} // Hiển thị hoặc ẩn mật khẩu
            style={[
              styles.input,
              { borderColor: errors.password ? "red" : "#EEEEEE", }, // Đổi màu viền nếu có lỗi
            ]}
            value={password}
            onChangeText={setPassword} // Cập nhật password khi người dùng nhập
          />
          {errors.password && (
            <Text style={styles.errorText}>Please enter your password.</Text>
          )}
        </View>

        {/* Hiển thị lỗi nếu email hoặc password không khớp */}
        {errors.invalidLogin && (
          <Text style={styles.errorText}>
            Incorrect email or password. Please try again.
          </Text>
        )}


        {/*Nút reset password*/}

        <View style={{width: '30%', alignItems: 'center', marginLeft: '65%'}}>
            <TouchableOpacity onPress={ () => { navigation.navigate("ResetPassword")}}>
              <Text>Forgot password?</Text>
            </TouchableOpacity>
        </View>

        {/* Nút "Login" */}
        <View style={styles.loginButtonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin} // Gọi hàm handleLogin khi nhấn nút
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
    marginTop: 10
  },
  imageContainer: {
    width: "100%",
    alignItems: 'center',
    marginTop: 10
  },
  headerImage: {
    width: "95%",
    height: 400,
    borderRadius: 10
  },
  formContainer: {
    width: "100%",
    backgroundColor: "white",
    height: 800,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  welcomeContainer: {
    marginTop: 10,
    marginLeft: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: 10,
    marginLeft: 20,
    borderRadius: 15,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    marginLeft: 10,
    marginTop: 23,
    position: "absolute",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  eyeIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    right: 20,
    top: 8,
  },
  input: {
    backgroundColor: "#EEEEEE",
    height: 50,
    borderColor: "#EEEEEE",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "95%",
    fontSize: 18,
    paddingLeft: 50,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 10,
    marginTop: -15,
    marginBottom: 10,
  },
  loginButtonContainer: {
    marginTop: 30,
    marginLeft: 20,
  },
  loginButton: {
    backgroundColor: "#33CCFF",
    borderRadius: 10,
    width: "95%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
