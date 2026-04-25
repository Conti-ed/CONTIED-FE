import React, { useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// ─── Styled Components ──────────────────────────────────────────────────────

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1500;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 431px) {
    align-items: center;
  }
`;

const Sheet = styled(motion.div)`
  width: 100%;
  max-width: 430px;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 20px 0 32px;
  outline: none;

  @media (min-width: 431px) {
    border-radius: 20px;
    padding: 24px 0;
    max-width: 360px;
  }
`;

const Handle = styled.div`
  width: 36px;
  height: 4px;
  background: #d9d9d9;
  border-radius: 2px;
  margin: 0 auto 20px;

  @media (min-width: 431px) {
    display: none;
  }
`;

const SheetTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: #323743;
  text-align: center;
  margin: 0 0 6px;
`;

const ContiTitleText = styled.p`
  font-size: 13px;
  color: #9095a1;
  text-align: center;
  margin: 0 0 20px;
  padding: 0 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 0 0 12px;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 8px;
`;

const MenuItem = styled.li``;

const MenuItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 13px 16px;
  background: none;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  color: #323743;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;

  &:hover {
    background: #f5f8ff;
  }

  &:active {
    background: #e8efff;
  }
`;

const MenuIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  flex-shrink: 0;
  font-size: 18px;
`;

const CloseButton = styled.button`
  display: block;
  margin: 12px auto 0;
  padding: 10px 32px;
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  color: #525252;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #ebebeb;
  }
`;

// ─── 공유 항목 아이콘 (SVG 인라인) ─────────────────────────────────────────

const LinkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4f8eec"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#525252"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const NativeShareIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4f8eec"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// ─── Props & 타입 ─────────────────────────────────────────────────────────────

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  contiId: number;
  title: string;
  onCopied?: () => void;
}

interface MenuItemConfig {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  onClick: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

const ShareMenu: React.FC<ShareMenuProps> = ({
  isOpen,
  onClose,
  contiId,
  title,
  onCopied,
}) => {
  const url = `${window.location.origin}/conti/${contiId}`;
  const shareText = `안녕하세요 여러분 !! "${title}" 를 공유합니다 :)\n꼭 들어봐주세요 🍀`;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    onCopied?.();
    onClose();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`"${title}" 콘티를 공유합니다`);
    const body = encodeURIComponent(`${shareText}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: shareText,
        url,
      });
    } catch {
      // 사용자 취소 무시
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<Element>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const menuItems: MenuItemConfig[] = [
    {
      icon: <LinkIcon />,
      iconBg: "#eef4ff",
      label: "링크 복사",
      onClick: handleCopyLink,
    },
    {
      icon: <EmailIcon />,
      iconBg: "#f5f5f5",
      label: "이메일로 공유",
      onClick: handleEmail,
    },
    ...("share" in navigator && typeof navigator.share === "function"
      ? [
          {
            icon: <NativeShareIcon />,
            iconBg: "#eef4ff",
            label: "다른 앱으로 공유",
            onClick: handleNativeShare,
          } as MenuItemConfig,
        ]
      : []),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
          aria-label="공유 메뉴"
        >
          <Sheet
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            tabIndex={-1}
          >
            <Handle />
            <SheetTitle>공유하기</SheetTitle>
            <ContiTitleText>{title}</ContiTitleText>
            <Divider />
            <MenuList>
              {menuItems.map((item) => (
                <MenuItem key={item.label}>
                  <MenuItemButton type="button" onClick={item.onClick}>
                    <MenuIconWrapper style={{ background: item.iconBg }}>
                      {item.icon}
                    </MenuIconWrapper>
                    {item.label}
                  </MenuItemButton>
                </MenuItem>
              ))}
            </MenuList>
            <CloseButton type="button" onClick={onClose}>
              닫기
            </CloseButton>
          </Sheet>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ShareMenu;
