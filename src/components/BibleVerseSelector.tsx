import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const SelectorContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const Select = styled(motion.select)`
  border-radius: 10px;
  border: 2px solid #94b4ed;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 10px;
  padding-right: 10px;
  transition: all 0.3s ease-in-out;
  font-family: inherit;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%2394b4ed" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position: right 3px top 50%;

  &:focus {
    outline: none;
    background-color: rgba(148, 180, 237, 0.2);
    font-weight: 300;
  }

  option {
    font-size: 12px;
    font-weight: 300;
  }
`;

const BookSelect = styled(Select)`
  width: 50%;
`;

const ChapterSelect = styled(Select)`
  width: 25%;
`;

const VerseSelect = styled(Select)`
  width: 25%;
`;

const bibleBooks = ["창세기", "출애굽기", "레위기" /* ... */];
const chapters = Array.from({ length: 50 }, (_, i) => i + 1);
const verses = Array.from({ length: 50 }, (_, i) => i + 1);

interface BibleVerseSelectorProps {
  onChange: (verse: string) => void;
  $hasError: boolean;
  expanded: boolean;
  placeholder: string;
}

const BibleVerseSelector: React.FC<BibleVerseSelectorProps> = ({
  onChange,
  $hasError,
  expanded,
  placeholder,
}) => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");

  useEffect(() => {
    if (book && chapter && verse) {
      onChange(`${book} ${chapter}:${verse}`);
    } else {
      onChange("");
    }
  }, [book, chapter, verse, onChange]);

  return (
    <SelectorContainer
      animate={{
        borderColor: $hasError ? "#ea8c8c" : "#94b4ed",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <BookSelect
        value={book}
        onChange={(e) => setBook(e.target.value)}
        animate={{
          width: expanded ? "calc(50% + 44px)" : "50%",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <option value="">{placeholder}</option>
        {bibleBooks.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </BookSelect>
      <ChapterSelect
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
      >
        <option value="">장</option>
        {chapters.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </ChapterSelect>
      <VerseSelect value={verse} onChange={(e) => setVerse(e.target.value)}>
        <option value="">절</option>
        {verses.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </VerseSelect>
    </SelectorContainer>
  );
};

export default BibleVerseSelector;
