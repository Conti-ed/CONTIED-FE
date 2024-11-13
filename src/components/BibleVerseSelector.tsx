import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import bibleData from "../data/bibleData.json";

const SelectorContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  width: 100%;
  border: 2px solid #94b4ed;
  border-radius: 10px;
`;

const Select = styled(motion.select)`
  border-radius: 10px;
  border: none;
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
  flex: 2; /* 50% */
`;

const ChapterSelect = styled(Select)`
  flex: 1; /* 25% */
`;

const VerseSelect = styled(Select)`
  flex: 1; /* 25% */
`;

interface BibleVerseSelectorProps {
  onChange: (verse: string, abbreviation: string) => void;
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
  const [abbreviation, setAbbreviation] = useState("");

  useEffect(() => {
    const selectedBook = bibleData.books.find((b) => b.name === book);
    if (selectedBook) {
      setAbbreviation(selectedBook.abbreviation);
    } else {
      setAbbreviation("");
    }
  }, [book]);

  useEffect(() => {
    if (book && chapter && verse && abbreviation) {
      onChange(`${abbreviation}${chapter}:${verse}`, abbreviation);
    } else {
      onChange("", abbreviation);
    }
  }, [book, chapter, verse, abbreviation, onChange]);

  const selectedBook = bibleData.books.find((b) => b.name === book);
  const totalChapters = selectedBook ? selectedBook.chapters.length : 0;
  const totalVerses =
    selectedBook && chapter
      ? selectedBook.chapters.find((c) => c.number === Number(chapter))
          ?.verses || 0
      : 0;

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
        {bibleData.books.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </BookSelect>
      <ChapterSelect
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
        disabled={!book}
      >
        <option value="">장</option>
        {Array.from({ length: totalChapters }, (_, i) => i + 1).map((c) => (
          <option key={c} value={c}>
            {c}장
          </option>
        ))}
      </ChapterSelect>
      <VerseSelect
        value={verse}
        onChange={(e) => setVerse(e.target.value)}
        disabled={!chapter}
      >
        <option value="">절</option>
        {Array.from({ length: totalVerses }, (_, i) => i + 1).map((v) => (
          <option key={v} value={v}>
            {v}절
          </option>
        ))}
      </VerseSelect>
    </SelectorContainer>
  );
};

export default BibleVerseSelector;
