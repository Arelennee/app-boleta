# Database Usage Patterns

## Option A: Promise-based (Recommended)
```javascript
// db.js
import mysql from "mysql2/promise";

// All functions should be async
export const getUserById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};
```

## Option B: Callback-based (Legacy)
```javascript
// db.js
import mysql from "mysql2"; // NOT mysql2/promise

// All functions use callbacks
export const getUserById = (id, callback) => {
  pool.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
};
```

## ❌ NEVER MIX BOTH STYLES
