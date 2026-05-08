const overlay = document.getElementById('networkOverlay');
    const message = document.getElementById('networkMessage');

    function showDisconnected() {
      message.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="No Internet Icon"><span>POOR INTERNET CONNECTION</span>';
      message.classList.remove('restored');
      overlay.classList.remove('hidden');
    }

    function showRestored() {
      message.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Connected Icon"><span>Connection Restored</span>';
      message.classList.add('restored');
      setTimeout(() => overlay.classList.add('hidden'), 2000);
    }

    window.addEventListener('offline', showDisconnected);
    window.addEventListener('online', showRestored);

    setInterval(() => {
      if (!navigator.onLine) {
        showDisconnected();
      }
    }, 3000);