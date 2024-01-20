import { useCallback } from "react";
import { InputFileUploadRef } from "./components/UploadDrawer";

const useFormReset = (
  reset: () => void,
  setHashtags: (hashtags: string[]) => void,
  inputFileUploadRef: React.MutableRefObject<InputFileUploadRef | null>
) => {
  const resetAllFields = useCallback(() => {
    reset();
    setHashtags([]);
    inputFileUploadRef.current?.resetUpload();
  }, [reset, setHashtags, inputFileUploadRef]);

  return resetAllFields;
};

export default useFormReset;
