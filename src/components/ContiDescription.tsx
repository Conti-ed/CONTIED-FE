import React, { useState } from "react";
import styled from "styled-components";

// ─── 헬퍼 ──────────────────────────────────────────────────────────────────

function stripContiPrefix(text: string): string {
  return text.replace(/^이\s*콘티는\s+/, "");
}

function highlightSongTitles(text: string, titles: string[]): React.ReactNode[] {
  if (!titles.length) return [text];
  const sorted = [...titles].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(pattern).map((part, i) =>
    sorted.includes(part) ? (
      <strong key={i} style={{ color: "#4f8eec", fontWeight: 600 }}>
        {part}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

// ─── Styled Components ──────────────────────────────────────────────────────

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FirstParagraph = styled.p`
  margin: 0 0 14px 0;
  border-left: 3px solid #94b4ed;
  padding-left: 14px;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: -0.01em;
  color: #323743;
  white-space: pre-wrap;
  word-break: keep-all;
`;

const SecondParagraph = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  letter-spacing: -0.01em;
  color: #525252;
  white-space: pre-wrap;
  word-break: keep-all;
`;

const MoreButton = styled.button`
  display: inline-block;
  margin-top: 8px;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: #4f8eec;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #376bb8;
  }
`;

const ClampedBlock = styled.div<{ $expanded: boolean }>`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? "unset" : "2")};
`;

// ─── Props ──────────────────────────────────────────────────────────────────

interface ContiDescriptionProps {
  description: string;
  songTitles?: string[];
  previewMode?: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

const CLAMP_THRESHOLD = 250;

const ContiDescription: React.FC<ContiDescriptionProps> = ({
  description,
  songTitles = [],
  previewMode = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!description) {
    return null;
  }

  const rawParagraphs = description.split(/\n\n+/);
  const firstParagraph = stripContiPrefix(rawParagraphs[0] ?? "");
  const restParagraphs = rawParagraphs.slice(1).join("\n\n");

  const needsToggle = !previewMode && description.length >= CLAMP_THRESHOLD;

  if (previewMode) {
    return (
      <Wrapper>
        <ClampedBlock $expanded={false}>
          <FirstParagraph>{firstParagraph}</FirstParagraph>
        </ClampedBlock>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {needsToggle ? (
        <ClampedBlock $expanded={expanded}>
          <FirstParagraph>{firstParagraph}</FirstParagraph>
          {restParagraphs ? (
            <SecondParagraph>
              {highlightSongTitles(restParagraphs, songTitles)}
            </SecondParagraph>
          ) : null}
        </ClampedBlock>
      ) : (
        <>
          <FirstParagraph>{firstParagraph}</FirstParagraph>
          {restParagraphs ? (
            <SecondParagraph>
              {highlightSongTitles(restParagraphs, songTitles)}
            </SecondParagraph>
          ) : null}
        </>
      )}

      {needsToggle && (
        <MoreButton
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? "접기" : "더보기"}
        </MoreButton>
      )}
    </Wrapper>
  );
};

export default ContiDescription;
