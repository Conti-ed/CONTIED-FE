import styled from "styled-components";
import SongPlaceholder from "./SongPlaceholder";

const SongItemContainer = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 19px;

  &:first-of-type {
    border-top: 1px solid #f3f4f6;
  }
`;

const SongImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 23px;
  margin-right: 20px; /* InfoText와의 간격 */
  border: 1px solid #9dbbe9;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: sticky;
`;

const SongInfo = styled.div`
  display: flex;
  height: 53px;
  padding: 0 20px 0 20px;

  & > div {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  & > .song-info {
    display: flex;
    flex-direction: column;
  }

  img {
    width: 42px;
    height: auto;
    border-radius: 10px;
  }
`;

const SongImage = styled.img`
  position: absolute;
  width: auto;
  height: 20px;
`;

const SongSummary = styled.div`
  margin-left: 11px;
`;

const SongTitle = styled.div`
  font-size: 11px;
  font-weight: 300;
  color: rgba(23, 26, 31, 0.8);
  margin-bottom: 4px;
`;

const SongArtistName = styled.div`
  font-size: 8px;
  font-weight: 300;
  color: rgba(23, 26, 31, 0.5);
`;

const LyricsContainer = styled.div`
  margin-top: 9px;
`;

const Lyrics = styled.div`
  padding: 0 24px 0 24px;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.5;
  color: rgba(23, 26, 31, 0.8);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LyricsOnlySongItem = ({
  song,
}: {
  song: { title: string; artist: string; thumbnail: string; lyrics: string };
}) => {
  return (
    <SongItemContainer>
      <SongInfo>
        <div>
          <SongImageWrapper>
            {song.thumbnail ? (
              <SongImage src={song.thumbnail} alt="Image" />
            ) : (
              <SongPlaceholder />
            )}
          </SongImageWrapper>
          <SongSummary className="song-info">
            <SongTitle>{song.title}</SongTitle>
            <SongArtistName>{song.artist}</SongArtistName>
          </SongSummary>
        </div>
      </SongInfo>
      <LyricsContainer>
        <Lyrics>{song.lyrics || "가사가 아직 제공되지 않았어요."}</Lyrics>
      </LyricsContainer>
    </SongItemContainer>
  );
};

export default LyricsOnlySongItem;
