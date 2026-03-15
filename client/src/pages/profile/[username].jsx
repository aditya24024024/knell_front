import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { GET_USER_PUBLIC_PROFILE } from "../../utils/constants";
import SearchGridItem from "../../components/search/SearchGridItem";
import { useStateProvider } from "../../context/StateContext";
import { optimizeImage } from "../../utils/cloudinary";

const getLinkIcon = (url) => {
  if (url.includes('instagram')) return '📸';
  if (url.includes('twitter') || url.includes('x.com')) return '🐦';
  if (url.includes('linkedin')) return '💼';
  if (url.includes('github')) return '💻';
  if (url.includes('youtube')) return '▶️';
  return '🔗';
};

const getLinkLabel = (url) => {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
};

const PublicProfile = () => {
  const router = useRouter();
  const { username } = router.query;
  const [{ userInfo }] = useStateProvider();
  const [user, setUser] = useState(null);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    if (!username) return;
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`${GET_USER_PUBLIC_PROFILE}/${username}`);
        setUser(data.user);
        setGigs(data.gigs);
      } catch (err) {
        // console.error("Failed to fetch profile:", err);
      }
    };
    fetchUserProfile();
  }, [username]);

  if (!user) return <p className="p-10 text-center">Loading profile...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* User Info */}
      <div className="flex flex-col items-center gap-4 text-center mb-10">
        {user.profileImage ? (
          <Image
            src={optimizeImage(user.profileImage, 'sm')}
            width={100} height={100}
            className="rounded-full object-cover" alt="Profile"
          />
        ) : (
          <div className="bg-purple-500 w-[100px] h-[100px] rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {user.email[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-gray-600">@{user.username}</p>
        </div>

        {user.description && (
          <p className="max-w-xl text-center text-gray-700">{user.description}</p>
        )}

        {/* Links */}
        {user.links?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {user.links.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700 hover:border-[#1DBF73] hover:text-[#1DBF73] transition-colors"
              >
                <span>{getLinkIcon(link)}</span>
                <span>{getLinkLabel(link)}</span>
              </a>
            ))}
          </div>
        )}

        {userInfo?.id === user?.id ? (
          <div className="flex gap-4">
            <button
              className="border text-lg font-semibold px-6 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
              type="button"
              onClick={() => router.push("/profile/set")}
            >
              Edit Profile
            </button>
            <button
              className="border text-lg font-semibold px-6 py-3 border-[#1DBF73] text-[#1DBF73] rounded-md"
              type="button"
              onClick={() => router.push("/logout")}
            >
              Logout
            </button>
          </div>
        ) : <div></div>}
      </div>

      {/* Gigs List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Gigs by {user.username}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <SearchGridItem key={gig.id} gig={gig} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;