 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDocs, collection, updateDoc, increment, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDim9k5CHfNythq6ORypN_RfwyLNMuxVLs",
      authDomain: "sign-2fd98.firebaseapp.com",
      projectId: "sign-2fd98",
      storageBucket: "sign-2fd98.appspot.com",
      messagingSenderId: "548682903618",
      appId: "1:548682903618:web:0f0ca286f902c7fbacfddb"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const signupForm = document.getElementById('signupForm');
    const joinBtn = document.getElementById('joinGroup');
    const signupBtn = document.getElementById('signupBtn');
    const referralDisplay = document.getElementById('referralDisplay');

    // Get referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      referralDisplay.textContent = `Referral Code: ${refCode}`;
      document.getElementById('referralCode').value = refCode;
    }

    let joinedGroup = false;
    joinBtn.addEventListener('click', () => {
      window.open('https://whatsapp.com/channel/0029Vb6uT8WAu3aXhCY03p0d', '_blank');
      joinedGroup = true;
      signupBtn.disabled = false;
      joinBtn.textContent = '✅ Joined WhatsApp Group';
      joinBtn.style.background = 'lime';
      joinBtn.style.color = '#000';
    });

    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const referralCode = document.getElementById('referralCode').value.trim();

      if (!joinedGroup) return alert('Please join the WhatsApp group first.');
      if (password !== confirmPassword) return alert('Passwords do not match.');

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);
        alert('A verification link has been sent to your email. Please verify to continue.');

        const referralId = Math.random().toString(36).substring(2, 10);

        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
          referralCode: referralId,
          referredBy: referralCode || null,
          balance: 0,
          joinedGroup: true
        });

        // Reward referrer ₦50 if valid
        if (referralCode) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('referralCode', '==', referralCode));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const refUser = querySnapshot.docs[0];
            await updateDoc(doc(db, 'users', refUser.id), {
              balance: increment(50)
            });
          }
        }

        window.location.href = 'login.html';
      } catch (error) {
        alert(error.message);
      }
    });