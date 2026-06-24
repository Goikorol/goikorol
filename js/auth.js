import { auth } from "./firebase.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

window.loginGoogle = async () => {

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
};

window.logoutUser = async () => {

    await signOut(auth);

};

onAuthStateChanged(auth, user => {

    console.log("Estado auth:", user);

});
