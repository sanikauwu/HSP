// ------------------------------
// Firebase 初始化（全站通用）
// ------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyDAgGnUQurF-8akgjRcKQR62LwSWsIOU9o",
  authDomain: "workshop-f30a7.firebaseapp.com",
  databaseURL: "https://workshop-f30a7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "workshop-f30a7",
  storageBucket: "workshop-f30a7.firebasestorage.app",
  messagingSenderId: "347050299118",
  appId: "1:347050299118:web:aa6ec84019ccd6ee05edff",
  measurementId: "G-SKEQWTDDPX"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 创建 Database 实例
const db = firebase.database();
