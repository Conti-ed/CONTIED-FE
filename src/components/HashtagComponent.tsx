import React from "react";
import {
  Hashtag,
  HashtagContainer,
  DeleteButton,
} from "../styles/UploadDrawer.styles";
import { TiDelete } from "react-icons/ti";

type Props = {
  hashtags: string[];
  onDeleteHashtag: (index: number) => void;
};

const HashtagComponent: React.FC<Props> = ({ hashtags, onDeleteHashtag }) => {
  return (
    <HashtagContainer $hashTags={hashtags.length > 0}>
      {hashtags.map((hashtag, index) => (
        <Hashtag key={index}>
          #{hashtag}
          <DeleteButton onClick={() => onDeleteHashtag(index)}>
            <TiDelete size="20" color="#8ab1e8" />
          </DeleteButton>
        </Hashtag>
      ))}
    </HashtagContainer>
  );
};

export default HashtagComponent;
