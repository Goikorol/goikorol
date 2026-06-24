import { auth } from "./firebase.js";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
const provider = new GoogleAuthProvider();
const authBtn = document.getElementById("auth-btn");
const userName = document.getElementById("user-name");
async function loginGoogle() {
    try {
        const result = await signInWithPopup(
            auth,
            provider
        );
        console.log("Login OK");
        console.log(result.user);
    } catch (err) {
        console.error(err);
    }
}
async function logoutUser() {
    try {
        await signOut(auth);
    } catch (err) {
        console.error(err);
    }
}

onAuthStateChanged(auth, user => {
    const avatar = document.getElementById("user-avatar");

   if (user) {
    avatar.src = user.photoURL;
    avatar.classList.add("show");

    userName.textContent = user.displayName;
    authBtn.textContent = "Logout";
    authBtn.onclick = logoutUser;
} else {
    avatar.classList.remove("show");

    userName.textContent = "";
    authBtn.textContent = "Login Google";
    authBtn.onclick = loginGoogle;
}
    
    console.log("Estado auth:", user);
    if (user) {
        userName.textContent = user.displayName;
        authBtn.textContent = "Logout";
        authBtn.onclick = logoutUser;
    } else {
        userName.textContent = "";
        authBtn.textContent = "Login Google";
        authBtn.onclick = loginGoogle;
    }

});
