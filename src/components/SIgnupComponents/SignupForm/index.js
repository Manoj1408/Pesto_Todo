import React, { useState } from "react";
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FIleInput from "../../common/Input/FIleInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const ProfileImageHandle = (file) => {
    setProfileImage(file);
  };

  const handleSignup = async () => {
    console.log("Handling Signup .....");
    setLoading(true);

    // Validate inputs
    if (!fullName || !email || !password || !confirmpassword) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Please make sure your password and confirm password match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password length must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Creating user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("userCredential", userCredential);
      const user = userCredential.user;

      let profileImageUrl = null;
      if (profileImage) {
        const profileImageRef = ref(storage, `users/${user.uid}/${Date.now()}`);
        await uploadBytes(profileImageRef, profileImage);

        profileImageUrl = await getDownloadURL(profileImageRef);
        console.log("profileImageUrl", profileImageUrl);

        // Save in Firebase database
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          pImage: profileImageUrl,
          uid: user.uid,
        });
      }

      // Save data into Redux
      dispatch(
        setUser({
          name: fullName,
          email: user.email,
          pImage: profileImageUrl,
          uid: user.uid,
        })
      );

      toast.success("User has been created");
      setLoading(false);
      navigate("/profile");
    } catch (e) {
      console.log("error", e);
      toast.error(e.message); // Corrected `e.massage` to `e.message`
      setLoading(false);
    }
  };
  return (
    <>
      <InputComponent
        state={fullName}
        setState={setFullName}
        placeholder="Full Name"
        type="text"
        required={true}
      />
      <InputComponent
        state={email}
        setState={setEmail}
        placeholder="Email"
        type="text"
        required={true}
      />
      <InputComponent
        state={password}
        setState={setPassword}
        placeholder="Password"
        type="password"
        required={true}
      />
      <InputComponent
        state={confirmpassword}
        setState={setConfirmPassword}
        placeholder="Confirm Password"
        type="password"
        required={true}
      />
      <FIleInput
        accept={"image/*"}
        id="profile-pic"
        fileHandleFnc={ProfileImageHandle}
        text={"Profile Image Upload"}
      />
      <Button
        on
        text={loading ? "loading...." : "Signup"}
        disabled={loading}
        onClick={handleSignup}
      />
    </>
  );
}

export default SignupForm;
