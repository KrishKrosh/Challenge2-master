import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";

const config = {
  apiKey: "apiHERE",
  projectId: " ",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async register(name, email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    fetch("https://api.youthcomputing.ca/shop/new-user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify({
        userId: this.auth.currentUser.uid,
        userName: name,
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        this.setState({ postId: data.id });
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    return this.auth.currentUser.updateProfile({});
  }

  isInitialized() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  async isLoggedIn() {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.auth.onAuthStateChanged(function (user) {
        if (user) {
          console.log("signed in");
          resolve(user);
        } else {
          console.log("signed out");
          reject(null);
        }
      });
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }

  getUid() {
    return this.auth.currentUser.uid;
  }
}

export default new Firebase();
