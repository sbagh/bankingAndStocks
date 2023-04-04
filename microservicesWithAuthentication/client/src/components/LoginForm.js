import axios from "axios";
import React from "react";
import { useState } from "react";

const userAccoutnsURL = "http://localhost:4000";

const LoginForm = ({ setLoggedIn }) => {
   //state for setting user credentials when loging in
   const [userCredentials, setUserCredentials] = useState({
      username: "",
      password: "",
   });
   const [feedbackMessage, setFeedbackMessage] = useState("");

   // handle change in form and save changes to userCredentials
   const handleChange = (event) => {
      const { name, value } = event.target;
      setUserCredentials({ ...userCredentials, [name]: value });
   };

   //handle submit to send credentials to back end, and receive JWT and feedback message
   const handleSubmit = (event) => {
      event.preventDefault();
      console.log(userCredentials);
      startLogin(userCredentials);
   };

   // start user's login
   const startLogin = async (userCredentials) => {
      // axios post to backend
      try {
         const response = await axios.post(
            `${userAccoutnsURL}/login`,
            userCredentials
         );
         // get the userID and JWT token returned from the back-end
         const { userID, token } = response.data;
         // save the token and UserID in the local storage
         localStorage.setItem("token", token);
         localStorage.setItem("userID", userID);
         // set loggedIn state to true in App.js
         setLoggedIn(true);
      } catch (error) {
         console.log("error in sending login credentials to backend");
         throw error;
      }
   };

   return (
      <div className="login-form">
         <form onSubmit={handleSubmit}>
            <label>
               username
               <input
                  type="text"
                  onChange={handleChange}
                  value={userCredentials.username}
                  name="username"
               />
            </label>
            <label>
               password
               <input
                  type="password"
                  onChange={handleChange}
                  value={userCredentials.password}
                  name="password"
               />
            </label>
            <button type="submit" onClick={handleSubmit}>
               Log in
            </button>
         </form>
      </div>
   );
};

export default LoginForm;
