import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdHistory } from "react-icons/md";
import {
  RecentKeywordSection,
  RecentKeywordHeader,
  RecentKeywordLabel,
  RecentKeywordHint,
  RecentKeywordChipList,
  RecentKeywordChip,
} from "../styles/Upload.styles";

interface SearchHistoryItem {
  id: number;
  query: string;
  updatedAt: string;
}

interface RecentKeywordChipsProps {
  chips: SearchHistoryItem[];
  addedChips: Set<string>;
  contiKeyword: string;
  onChipClick: (query: string) => void;
}

const chipListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const chipItemVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const RecentKeywordChips: React.FC<RecentKeywordChipsProps> = ({
  chips,
  addedChips,
  contiKeyword,
  onChipClick,
}) => {
  const visibleChips = chips.slice(0, 8);
  const showHint = contiKeyword.trim() === "" && addedChips.size === 0;

  return (
    <AnimatePresence>
      {visibleChips.length > 0 && (
        <RecentKeywordSection
          key="recent-chips"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <RecentKeywordHeader>
            <RecentKeywordLabel>
              <MdHistory size={13} />
              최근 검색에서 추가
            </RecentKeywordLabel>
            {showHint && (
              <RecentKeywordHint>탭하여 추가하세요</RecentKeywordHint>
            )}
          </RecentKeywordHeader>
          <RecentKeywordChipList
            variants={chipListVariants}
            initial="hidden"
            animate="visible"
          >
            {visibleChips.map((item) => {
              const added = addedChips.has(item.query);
              return (
                <motion.li key={item.id} variants={chipItemVariants}>
                  <RecentKeywordChip
                    type="button"
                    $added={added}
                    onClick={() => onChipClick(item.query)}
                    aria-pressed={added}
                    layout
                  >
                    {added && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 10 10"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1.5 5L4 7.5L8.5 2.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {item.query}
                  </RecentKeywordChip>
                </motion.li>
              );
            })}
          </RecentKeywordChipList>
        </RecentKeywordSection>
      )}
    </AnimatePresence>
  );
};

export default RecentKeywordChips;
