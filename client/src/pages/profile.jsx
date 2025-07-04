import { reducerCases } from '../context/constants';
import { useStateProvider } from '../context/StateContext';
import { HOST, SET_USER_IMAGE, SET_USER_INFO } from '../utils/constants';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(true);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    username: "",
    fullName: "",
    description: "",
  });

  useEffect(() => {
    const populateData = () => {
      const handleData = { ...data };
      if (userInfo) {
        if (userInfo?.username) handleData.username = userInfo?.username;
        if (userInfo?.description) handleData.description = userInfo?.description;
        if (userInfo?.fullName) handleData.fullName = userInfo?.fullName;

        if (userInfo?.imageName) {
          const fileName = image;
          fetch(userInfo.imageName).then(async (response) => {
            const contentType = response.headers.get("content-type");
            const blob = await response.blob();
            const files = new File([blob], fileName, { contentType });
            setImage(files);
          });
        }

        setData(handleData);
        setIsLoaded(true);
      }
    };
    populateData();
  }, [userInfo]);

  const setProfile = async () => {
    try {
      const response = await axios.post(
        SET_USER_INFO,
        { ...data },
        { withCredentials: true }
      );
      if (response.data.usernameError) {
        setErrorMessage("Enter a Unique Username");
      } else {
        let imageName = "";
        if (image) {
          const formData = new FormData();
          formData.append("images", image);
          const {
            data: { img },
          } = await axios.post(SET_USER_IMAGE, formData, {
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
            image: imageName.length ? imageName : false,
          },
        });
        toast.success("Profile set up successfully");

setTimeout(() => {
  router.push("/"); // navigates to home page
  setTimeout(() => {
    window.location.reload(); // forces reload after navigation
  }, 1000); // small delay to ensure navigation happens
}, 1000); // optional delay to let toast show before redirect
      }
    } catch (err) {
      console.error(err);
      toast.error("Some error occurred");
    }
  };

  const handleFile = (e) => {
    let file = e.target.files;
    const fileType = file[0]["type"];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (validImageTypes.includes(fileType)) {
      setImage(file[0]);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500";
  const labelClassName =
    "mb-2 text-lg font-medium text-gray-900";

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

          <div className="flex flex-col items-center w-full gap-6">
            {/* Profile Picture Upload */}
            <div
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <label className={labelClassName}>Select a profile Picture</label>
              <div className="bg-purple-500 h-36 w-36 flex items-center justify-center rounded-full relative">
                {image ? (
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="profile"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-6xl text-white">
                    {userInfo?.email[0].toUpperCase()}
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

            {/* Username and Full Name */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]">
              <div className="flex-1">
                <label className={labelClassName} htmlFor="username">
                  Username
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  value={data.username}
                  onChange={handleChange}
                />
              </div>

              <div className="flex-1">
                <label className={labelClassName} htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  name="fullName"
                  id="fullName"
                  placeholder="Full Name"
                  value={data.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="w-full max-w-[500px]">
              <label className={labelClassName} htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={data.description}
                onChange={handleChange}
                className={inputClassName}
                placeholder="Description"
              ></textarea>
            </div>

            {/* Button */}
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
