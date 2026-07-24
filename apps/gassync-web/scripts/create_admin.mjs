import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQrglyNrWfQ49NUVcp5VHlrDtBDw-Hz4Q",
  authDomain: "gassync-app.firebaseapp.com",
  projectId: "gassync-app",
  storageBucket: "gassync-app.firebasestorage.app",
  messagingSenderId: "238029454044",
  appId: "1:238029454044:web:870e1008388bde38721219"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Secondary app to create user without logging out the primary app
const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
const secondaryAuth = getAuth(secondaryApp);

async function run() {
  try {
    console.log('Logging in as Superadmin...');
    await signInWithEmailAndPassword(auth, 'test@test.com', 'test1234');
    console.log('Logged in successfully.');

    // 1. Fetch the company.
    const companiesSnap = await getDocs(collection(db, 'companies'));
    let companyId = null;
    companiesSnap.forEach(d => {
      const data = d.data();
      if (data.name && data.name.toLowerCase().includes('gas chile')) {
        companyId = d.id;
      }
    });

    if (!companyId) {
      console.log('No Gas Chile company found. Finding first available company as fallback.');
      if (!companiesSnap.empty) {
        companyId = companiesSnap.docs[0].id;
        console.log('Using company:', companiesSnap.docs[0].data().name);
      } else {
        console.log('No companies exist.');
        process.exit(1);
      }
    }
    
    const email = 'admin@gaschile.cl';
    const password = 'Password123!';
    
    console.log('Creating user in Auth (Secondary App)...');
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const user = userCredential.user;
      
      console.log('Creating user in Firestore (Primary App as Superadmin)...', user.uid);
      await setDoc(doc(db, 'users', user.uid), {
        email,
        name: 'Administrador Gas Chile',
        role: 'ADMIN',
        companyId: companyId,
        createdAt: new Date().toISOString()
      });
      console.log('Success! Email:', email, 'Password:', password);
    } catch(e) {
      if (e.code === 'auth/email-already-in-use') {
        const uEmail = 'admin2@gaschile.cl';
        console.log('Email taken, trying', uEmail);
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, uEmail, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          email: uEmail,
          name: 'Administrador Gas Chile',
          role: 'ADMIN',
          companyId: companyId,
          createdAt: new Date().toISOString()
        });
        console.log('Success! Email:', uEmail, 'Password:', password);
      } else {
        throw e;
      }
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
