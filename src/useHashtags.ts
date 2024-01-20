import { useState } from "react";

const useHashtags = (initialHashtags: string[] = []) => {
  const [hashtags, setHashtags] = useState<string[]>(initialHashtags);
  const [hashtagInput, setHashtagInput] = useState("");
  const [isExceeding, setIsExceeding] = useState(false);

  const addHashtag = (newHashtag: string) => {
    if (newHashtag && !hashtags.includes(newHashtag) && hashtags.length < 3) {
      setHashtags([...hashtags, newHashtag]);
    } else if (hashtags.length >= 3) {
      setIsExceeding(true);
    }
    setHashtagInput("");
  };

  const handleAddHashtag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      addHashtag(hashtagInput.trim());
    }
  };

  const deleteHashtag = (index: number) => {
    setHashtags(hashtags.filter((_, idx) => idx !== index));
    if (hashtags.length <= 3) {
      setIsExceeding(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setHashtagInput(value);
    if (!value.trim() || hashtags.length < 3) {
      setIsExceeding(false);
    }
  };

  return {
    hashtags,
    setHashtags,
    deleteHashtag,
    isExceeding,
    hashtagInput,
    handleInputChange,
    handleAddHashtag,
  };
};

export default useHashtags;
