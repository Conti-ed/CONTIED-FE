import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  width: 100%;
`;

const Tab = styled.div<{ $isSelected: boolean }>`
  font-size: 13.7px;
  color: #171a1f;
  font-weight: ${(props) => (props.$isSelected ? "500" : "300")};
  padding: 12px 0;
  cursor: pointer;
  position: relative;
  flex: 1;
  text-align: center;
`;

const TabIndicator = styled(motion.div)`
  position: absolute;
  bottom: 0;
  height: 2.5px;
  background-color: #000;
`;

interface SectionTabsProps {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}

const TABS = ["전체", "곡", "콘티", "가사"];

const SectionTabs: React.FC<SectionTabsProps> = ({
  selectedTab,
  onSelectTab,
}) => {
  const selectedIndex = TABS.indexOf(selectedTab);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);

  useEffect(() => {
    if (tabRefs.current[selectedIndex]) {
      const tab = tabRefs.current[selectedIndex];
      setIndicatorWidth(tab?.offsetWidth || 0);
      setIndicatorLeft(tab?.offsetLeft || 0);
    }
  }, [selectedIndex]);

  return (
    <TabsContainer>
      {TABS.map((tab, index) => (
        <Tab
          key={tab}
          $isSelected={tab === selectedTab}
          onClick={() => onSelectTab(tab)}
          ref={(el) => (tabRefs.current[index] = el)}
        >
          {tab}
        </Tab>
      ))}
      <TabIndicator
        style={{ width: indicatorWidth, left: indicatorLeft }}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </TabsContainer>
  );
};

export default SectionTabs;
