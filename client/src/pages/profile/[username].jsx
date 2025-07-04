import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import { GET_USER_PUBLIC_PROFILE } from "../../utils/constants";
import SearchGridItem from "../../components/search/SearchGridItem";

const PublicProfile = () => {
  const router = useRouter();
  const { username } = router.query;

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
        console.error("Failed to fetch profile:", err);
        // router.push("/404");
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
            src={`${user.profileImage}`}
            width={100}
            height={100}
            className="rounded-full object-cover"
            alt="Profile"
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
