// Simulated Backend Database & Authentication Service for BRIDGE Smart Education Platform

const SEED_USERS = [
  {
    id: 'u-teacher-1',
    name: 'Dr. Sarah Jenkins',
    email: 'teacher@bridge.edu',
    password: 'password123',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    institution: 'National Institute of Technology',
    department: 'Computer Science & Engineering',
    subjectDomain: 'Operating Systems & Distributed Architecture',
    enrolledStudentsCount: 60
  },
  {
    id: 'u-student-1',
    name: 'Priya Sharma',
    email: 'priya@bridge.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    college: 'IIT Bombay',
    department: 'Computer Science Engineering',
    yearOfStudy: '3rd Year',
    level: 5,
    xp: 1420,
    status: 'Top Performer',
    targetRole: 'Cloud/DevOps Engineer',
    skills: { python: 85, sql: 75, cloud: 90, os: 92, dsa: 95, git: 88, ml: 60 },
    careerReadinessScore: 86
  },
  {
    id: 'u-student-2',
    name: 'Alex Vance',
    email: 'alex@bridge.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    college: 'BITS Pilani',
    department: 'Electronics & Communication',
    yearOfStudy: '2nd Year',
    level: 4,
    xp: 1100,
    status: 'On Track',
    targetRole: 'Embedded Systems Engineer',
    skills: { python: 70, sql: 60, cloud: 75, os: 85, dsa: 65, git: 80, ml: 40 },
    careerReadinessScore: 74
  },
  {
    id: 'u-student-3',
    name: 'Marcus Miller',
    email: 'marcus@bridge.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    college: 'Stanford University',
    department: 'Software Engineering',
    yearOfStudy: '1st Year',
    level: 2,
    xp: 420,
    status: 'Needs Assistance',
    targetRole: 'Software Developer',
    skills: { python: 60, sql: 45, cloud: 40, os: 50, dsa: 55, git: 50, ml: 30 },
    careerReadinessScore: 52
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

  // Email format validation
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Password validation (min 6 chars)
  validatePassword(password) {
    return typeof password === 'string' && password.length >= 6;
  }

  // Authentication API
  login(email, password) {
    if (!email || !this.validateEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password. Demo accounts: teacher@bridge.edu or priya@bridge.edu (password123)');
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
        college: user.college || user.institution || 'University Partner',
        department: user.department || 'Engineering',
        yearOfStudy: user.yearOfStudy || '3rd Year',
        subjectDomain: user.subjectDomain || 'Computer Science',
        level: user.level || 1,
        xp: user.xp || 0,
        skills: user.skills || { python: 70, sql: 60, cloud: 60, os: 70, dsa: 70, git: 70, ml: 50 },
        targetRole: user.targetRole || 'Software Developer',
        careerReadinessScore: user.careerReadinessScore || 70
      }
    };

    localStorage.setItem('bridge_session', JSON.stringify(session));
    return session;
  }

  register(userData) {
    const { name, email, password, role, college, institution, department, yearOfStudy, subjectDomain } = userData;

    if (!name || !name.trim()) throw new Error('Please provide your full name.');
    if (!email || !this.validateEmail(email)) throw new Error('Please provide a valid email address.');
    if (!password || !this.validatePassword(password)) throw new Error('Password must be at least 6 characters long.');

    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      college: college || institution || 'Engineering Institute',
      institution: institution || college || 'Engineering Institute',
      department: department || 'Computer Science & Engineering',
      yearOfStudy: yearOfStudy || '1st Year',
      subjectDomain: subjectDomain || 'STEM & Computer Science',
      level: 1,
      xp: 100,
      status: 'New Enrollee',
      targetRole: role === 'student' ? 'Software Developer' : 'Faculty Member',
      skills: { python: 60, sql: 50, cloud: 50, os: 50, dsa: 50, git: 50, ml: 30 },
      careerReadinessScore: 60
    };

    users.push(newUser);
    this.saveUsers(users);

    return this.login(email, password);
  }

  forgotPassword(email) {
    if (!email || !this.validateEmail(email)) {
      throw new Error('Please enter a valid registered email address.');
    }
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error('No registered account found with this email address.');
    }

    // Simulate password reset token generation
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    return {
      message: `Password reset verification code sent to ${email}. Verification Code: ${resetCode}`,
      resetCode,
      email: user.email
    };
  }

  updatePassword(email, newPassword) {
    if (!this.validatePassword(newPassword)) {
      throw new Error('New password must be at least 6 characters long.');
    }
    const users = this.getUsers();
    const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (userIdx === -1) throw new Error('User not found.');

    users[userIdx].password = newPassword;
    this.saveUsers(users);
    return true;
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
