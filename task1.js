import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
    authDomain: "sign-2fd98.firebaseapp.com",
    projectId: "sign-2fd98",
    storageBucket: "sign-2fd98.appspot.com",
    messagingSenderId: "548682903618",
    appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const screenshotsMap = {
    task1: ['hero-char-r.png', 'snc-icon-2.png'],
    task2: ['https://via.placeholder.com/300x150?text=Instagram+Profile', 'https://via.placeholder.com/300x150?text=Follow+Proof'],
    task3: ['https://via.placeholder.com/300x150?text=YouTube+Sub', 'https://via.placeholder.com/300x150?text=Liked+Video']
  };

  // Show screenshots
  window.showScreenshots = function (taskId) {
    const container = document.getElementById('screenshots');
    container.innerHTML = '';
    screenshotsMap[taskId].forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      container.appendChild(img);
    });
    document.getElementById('screenshotPopup').style.display = 'flex';
  };

  // Show form and handle task submission status
  window.showForm = function (taskId) {
    document.getElementById('taskSubject').value = `Task Proof Submission: ${taskId}`;
    document.getElementById('formPopup').style.display = 'flex';

    const user = auth.currentUser;
    if (!user) return;

    const statusKey = `taskStatus_${user.email}_${taskId}`;
    const statusEl = document.getElementById(`status-${taskId}`);

    // Set pending
    statusEl.textContent = '⏳ Pending';
    statusEl.className = 'task-status pending';
    localStorage.setItem(statusKey, 'pending');

    // After 12hrs, mark as Seen
    setTimeout(() => {
      statusEl.textContent = '✅ Seen';
      statusEl.className = 'task-status seen';
      localStorage.setItem(statusKey, 'seen');
    }, 43200000);
  };

  // Restore saved statuses on page load
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("userEmail").value = user.email;
      
      ['task1', 'task2', 'task3', 'task4', 'task5', 'task6', 'task7', 'task8', 'task9', 'task10',].forEach(taskId => {
        const statusKey = `taskStatus_${user.email}_${taskId}`;
        const savedStatus = localStorage.getItem(statusKey);
        const statusEl = document.getElementById(`status-${taskId}`);

        if (savedStatus === 'pending') {
          statusEl.textContent = '⏳ Pending';
          statusEl.className = 'task-status pending';
        } else if (savedStatus === 'seen') {
          statusEl.textContent = '✅ Seen';
          statusEl.className = 'task-status seen';
        }
      });
    }
  });

  // Close popup
  window.closePopup = function () {
    document.querySelectorAll('.popup').forEach(p => p.style.display = 'none');
  };

  // Show success popup if redirected after submission
  if (window.location.href.includes('?success=true')) {
    setTimeout(() => {
      document.getElementById('successPopup').style.display = 'flex';
    }, 500);
  }