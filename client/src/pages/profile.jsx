import { reducerCases } from '../context/constants';
import { useStateProvider } from '../context/StateContext';
import { GET_USER_INFO, SET_USER_IMAGE, SET_USER_INFO } from '../utils/constants';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    username: "",
    fullName: "",
    description: "",
  });
  const [showVerificationTab, setShowVerificationTab] = useState(false);
  const MEET_LINK = "https://meet.google.com/wyu-nqxw-dqq";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const {
          data: { user },
        } = await axios.post(GET_USER_INFO, {}, {
          withCredentials: true,
        });

        dispatch({
          type: reducerCases.SET_USER,
          userInfo: {
            ...user,
            image: user.image,
          },
        });

        const handleData = {
          username: user?.username || "",
          description: user?.description || "",
          fullName: user?.fullName || "",
        };
        setData(handleData);
        if (user?.image) setPreview(user.image);

        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to fetch updated user info:", err);
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  const setProfile = async () => {
    try {
      console.log({...data});
      const response = await axios.post(SET_USER_INFO, { ...data }, { withCredentials: true });

      if (response?.data?.usernameError) {
        setErrorMessage("Enter a Unique Username");
        return;
      }

      // console.log(response);
      // console.log(response.data);
      if (response.status==400) {
        console.log("dsgdklds");
        setErrorMessage(response.data);
        return;
      }

      let imageName = "";
      if (image) {
        const formData = new FormData();
        formData.append("images", image);
        const { data: { img } } = await axios.post(SET_USER_IMAGE, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageName = img;
      }

      dispatch({
        type: reducerCases.SET_USER,
        userInfo: {
          ...userInfo,
          ...data,
          image: imageName || userInfo?.image || false,
        },
      });

      toast.success("Profile set up successfully");

      setTimeout(() => {
        router.push("/");
        setTimeout(() => window.location.reload(), 1000);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Some error occurred");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    const fileType = file?.type;
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (file && validImageTypes.includes(fileType)) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500";
  const labelClassName = "mb-2 text-lg font-medium text-gray-900";

  return (
    <>
      {isLoaded && (
        <div className="flex flex-col items-center justify-start min-h-[80vh] px-4 sm:px-6 gap-4 py-8">
          {errorMessage && (
            <div>
              <span className="text-red-600 font-bold">{errorMessage}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl">Welcome to Knell</h2>
          <h4 className="text-lg sm:text-xl text-center">
            Please complete your profile to get started
          </h4>

          {userInfo?.isSocialLogin ? (
  <div className="text-green-600 font-semibold">
    ✅ You are now a verified user.
  </div>
) : (
  <div className="text-yellow-600 font-medium">
    ⚠️ Your account is not yet verified.
  </div>
)}


          <div className="flex flex-col items-center w-full gap-6">
            {/* Profile Picture Upload */}
            <div
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <label className={labelClassName}>Select a profile picture</label>
              <div className="bg-purple-500 h-36 w-36 flex items-center justify-center rounded-full relative">
                {preview ? (
                  <Image
                    src={preview}
                    alt="profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-6xl text-white">
                    {userInfo?.email?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
                <div
                  className={`absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center transition-all duration-200 ${
                    imageHover ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="relative flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-white absolute"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <input
                      type="file"
                      onChange={handleFile}
                      className="opacity-0"
                      multiple={false}
                      name="profileImage"
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Username & Full Name */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]">
              <div className="flex-1">
                <label className={labelClassName} htmlFor="username">Username</label>
                <input
                  className={inputClassName}
                  type="text"
                  name="username"
                  id="username"
                  value={data.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>
              <div className="flex-1">
                <label className={labelClassName} htmlFor="fullName">Full Name</label>
                <input
                  className={inputClassName}
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Description */}
            <div className="w-full max-w-[500px]">
              <label className={labelClassName} htmlFor="description">Description</label>
              <textarea
                className={inputClassName}
                name="description"
                id="description"
                value={data.description}
                onChange={handleChange}
                placeholder="Tell us about yourself"
              />
            </div>

            {/* Verification Link */}
            {!userInfo?.isSocialLogin && (
              <button
                className="mt-4 text-blue-600 underline"
                onClick={() => setShowVerificationTab(!showVerificationTab)}
              >
                I want to verify my account
              </button>
            )}

            {showVerificationTab && (
              <div className="mt-6 p-5 w-full max-w-[500px] rounded-lg border border-blue-300 bg-blue-50">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">Account Verification</h3>
                <p className="mb-3 text-gray-700">
                  To verify your account, please join our live verification session on Google Meet.
                  Admins are available 24/7.
                </p>
                <a
                  href={MEET_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Join Verification Meet
                </a>
                <p className="text-sm text-gray-500 mt-4">
                  You will be approved manually by an admin after the session.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="border text-lg font-semibold px-6 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
              type="button"
              onClick={setProfile}
            >
              Set Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
