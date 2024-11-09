const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/users_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Định nghĩa Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: String, // Lưu đường dẫn ảnh
});

const User = mongoose.model('User', userSchema);

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// 1. (CREATE) - Đăng ký người dùng
app.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const avatar = req.file ? req.file.filename : 'logoo.png';

    const newUser = new User({ username, email, password, avatar });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

// 2. (READ) - Lấy danh sách người dùng
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng.' });
  }
});

// 3. (UPDATE) - Cập nhật mật khẩu người dùng bằng email
app.patch('/users/email/:email', async (req, res) => {
  try {
    const { password } = req.body;
    const { email } = req.params;

    const user = await User.findOneAndUpdate(
      { email: email },
      { password: password },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
    }

    res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công.', user });
  } catch (err) {
    console.error('Lỗi khi cập nhật mật khẩu:', err);
    res.status(500).send('Lỗi khi cập nhật mật khẩu.');
  }
});

// 4. (DELETE) - Xóa người dùng
// Xóa người dùng theo email
app.delete('/users', async (req, res) => {
  try {
    const { email } = req.query; // Lấy email từ query params
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const result = await User.findOneAndDelete({ email }); // Xóa user theo email
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({ message: 'Xóa người dùng thành công.' });
  } catch (err) {
    console.error('Lỗi khi xóa người dùng:', err);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng.' });
  }
});

// Khởi chạy server
app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000');
});
