// Simulated Backend Database & Authentication Service for BRIDGE Smart Education Platform

const SEED_USERS = [
  {
    id: 'u-teacher-1',
    name: 'Dr. Sarah Jenkins',
    email: 'teacher@bridge.edu',
    password: 'password123',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    enrolledStudentsCount: 60
  },
  {
    id: 'u-student-1',
    name: 'Priya Sharma',
    email: 'priya@bridge.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    level: 5,
    xp: 1420,
    status: 'Top Performer'
  },
  {
    id: 'u-student-2',
    name: 'Alex Vance',
    email: 'alex@bridge.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    level: 4,
    xp: 1100,
    status: 'On Track'
  },
  {
    id: 'u-student-3',
    name: 'Marcus Miller',
    email: 'marcus@bridge.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    level: 2,
    xp: 420,
    status: 'Needs Assistance'
  }
];

class BackendDB {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem('bridge_users')) {
      localStorage.setItem('bridge_users', JSON.stringify(SEED_USERS));
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem('bridge_users')) || SEED_USERS;
    } catch (e) {
      return SEED_USERS;
    }
  }

  saveUsers(users) {
    localStorage.setItem('bridge_users', JSON.stringify(users));
  }

  // Authentication API
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password. Please try teacher@bridge.edu or priya@bridge.edu with password123');
    }

    const token = `token_${user.id}_${Date.now()}`;
    const session = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        level: user.level || 1,
        xp: user.xp || 0
      }
    };

    localStorage.setItem('bridge_session', JSON.stringify(session));
    return session;
  }

  register({ name, email, password, role }) {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      throw new Error('Account with this email already exists.');
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      level: 1,
      xp: 100,
      status: 'New Enrollee'
    };

    users.push(newUser);
    this.saveUsers(users);

    return this.login(email, password);
  }

  getSession() {
    try {
      const sessData = localStorage.getItem('bridge_session');
      return sessData ? JSON.parse(sessData) : null;
    } catch (e) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('bridge_session');
  }
}

export const db = new BackendDB();
