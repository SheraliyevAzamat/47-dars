import fs from "fs/promises";
import path from "path";

const usersFilePath = path.resolve("src/db/users.json");

const readUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Barcha maydonlarni to'ldiring!" });
  }

  const users = await readUsers();
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    username,
    email,
    password,
  };

  users.push(newUser);
  await writeUsers(users);

  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const users = await readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Email yoki parol noto'g'ri!" });
  }

  res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};

export const getUsers = async (req, res) => {
  const users = await readUsers();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const users = await readUsers();
  const user = users.find((u) => u.id === parseInt(req.params.userId));

  if (!user) {
    return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
  }

  res.json(user);
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email } = req.body;
  const users = await readUsers();

  const userIndex = users.findIndex((u) => u.id === parseInt(userId));
  if (userIndex === -1) {
    return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
  }

  users[userIndex] = {
    ...users[userIndex],
    username,
    email,
  };

  await writeUsers(users);
  res.json(users[userIndex]);
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  let users = await readUsers();

  const initialLength = users.length;
  users = users.filter((u) => u.id !== parseInt(userId));

  if (users.length === initialLength) {
    return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
  }

  await writeUsers(users);
  res.json({ message: "Foydalanuvchi o'chirildi!" });
};