const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Cấu hình kết nối MariaDB
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'sapassword',
  database: 'users_db',
});

// Kết nối MariaDB
db.connect((err) => {
  if (err) {
    console.error('Kết nối MariaDB thất bại:', err);
    process.exit(1); // Thoát nếu không kết nối được
  }
  console.log('Kết nối MariaDB thành công.');
});

// Khởi tạo Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. (CREATE) - Đăng ký người dùng
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm người dùng:', err);
      return res.status(500).json({ message: 'Lỗi khi thêm người dùng.' });
    }
    res.status(201).json({ message: 'Đăng ký thành công.', userId: result.insertId });
  });
});

// 2. (READ) - Lấy danh sách người dùng
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng.' });
    }
    res.status(200).json(results);
  });
});

// 3. (UPDATE) - Cập nhật thông tin người dùng
app.patch('/users/:id', (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE users SET password = ? WHERE id = ?';
  db.query(sql, [password, id], (err, result) => {
    if (err) {
      console.error('Lỗi khi cập nhật mật khẩu:', err);
      res.status(500).send('Lỗi khi cập nhật mật khẩu.');
    } else {
      res.send('Mật khẩu đã được cập nhật thành công.');
    }
  });
});


// 4. (DELETE) - Xóa người dùng
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      return res.status(500).json({ message: 'Lỗi khi xóa người dùng.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.status(200).json({ message: 'Xóa người dùng thành công.' });
  });
});

// Khởi chạy server
app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000');
});
