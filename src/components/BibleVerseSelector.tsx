import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const SelectorContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  width: 90%;
`;

const Select = styled.select`
  border-radius: 10px;
  border: 2px solid #94b4ed;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 10px;
  transition: all 0.3s ease-in-out;
  font-family: inherit;

  &:focus {
    outline: none;
    background-color: rgba(148, 180, 237, 0.2);
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

// 이 부분은 실제 성경 데이터로 대체해야 합니다.
const bibleBooks = ["창세기", "출애굽기", "레위기" /* ... */];
const chapters = Array.from({ length: 50 }, (_, i) => i + 1);
const verses = Array.from({ length: 30 }, (_, i) => i + 1);

interface BibleVerseSelectorProps {
  onChange: (verse: string) => void;
  $hasError: boolean;
}

const BibleVerseSelector: React.FC<BibleVerseSelectorProps> = ({
  onChange,
  $hasError,
}) => {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");

  const handleChange = () => {
    if (book && chapter && verse) {
      onChange(`${book} ${chapter}:${verse}`);
    }
  };

  return (
    <SelectorContainer
      initial={{ width: "90%" }}
      animate={{
        width: "90%", // 여기도 90%로 변경
        borderColor: $hasError ? "#ea8c8c" : "#94b4ed",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <BookSelect
        value={book}
        onChange={(e) => {
          setBook(e.target.value);
          handleChange();
        }}
      >
        <option value="">성경 선택</option>
        {bibleBooks.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </BookSelect>
      <ChapterSelect
        value={chapter}
        onChange={(e) => {
          setChapter(e.target.value);
          handleChange();
        }}
      >
        <option value="">장</option>
        {chapters.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </ChapterSelect>
      <VerseSelect
        value={verse}
        onChange={(e) => {
          setVerse(e.target.value);
          handleChange();
        }}
      >
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
