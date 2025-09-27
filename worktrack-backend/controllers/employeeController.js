import pool from "../config/db.js";

export const getAllEmployees = async (req, res) => {
  try {
    const [employees] = await pool.query("SELECT * FROM employee");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createEmployee = async (req, res) => {
  const { name, position, address } = req.body;
  const photo = req.file ? `uploads/${req.file.filename}` : null;
  try {
    const [result] = await pool.query(
      "INSERT INTO employee (name, position, address, photo) VALUES (?, ?, ?, ?)",
      [name, position, address, photo]
    );
    res
      .status(201)
      .json({ id: result.insertId, name, position, address, photo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, position, address } = req.body;
  let photo = req.body.photo;
  if (req.file) {
    photo = `uploads/${req.file.filename}`;
  }

  try {
    await pool.query(
      "UPDATE employee SET name = ?, position = ?, address = ?, photo = ? WHERE id = ?",
      [name, position, address, photo, id]
    );
    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employee WHERE id = ?", [id]);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
