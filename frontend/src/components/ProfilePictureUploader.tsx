import React, { useContext, useRef, useState } from "react";
import { uploadProfilePicture } from "../api/user";
import { AuthContext } from "../contexts/AuthContext";

interface User {
  id: string;
  username: string;
  profilePicture: string;
}

interface ProfilePictureUploaderProps {
  targetUser: User;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  targetUser,
}) => {
  const [profilePicture, setProfilePicture] = useState<string>(
    targetUser.profilePicture
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { triggerRefresh } = useContext(AuthContext);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const newProfilePicture = await uploadProfilePicture(file, targetUser.id);
      setProfilePicture(newProfilePicture);
      triggerRefresh();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div>
      <img
        src={profilePicture || "/default-profile-pic.jpg"}
        alt={targetUser.username}
        className="h-40 w-40 border-8 border-primary shadow-xl cursor-pointer hover:opacity-50"
        style={{ borderRadius: "100%" }}
        onClick={handleImageClick}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePictureUploader;
