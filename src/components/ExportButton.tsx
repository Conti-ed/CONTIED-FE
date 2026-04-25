import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

// ─── Styled Components ──────────────────────────────────────────────────────

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 400;
  color: #4f8eec;
  background-color: transparent;
  border: 1.5px solid #4f8eec;
  border-radius: 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
  position: relative;

  &:hover {
    background-color: #eef4ff;
  }

  &:active {
    background-color: #d7e4ff;
  }
`;

const DropdownMenu = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  padding: 6px;
  min-width: 148px;
  z-index: 100;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transform: ${({ $visible }) => ($visible ? "translateY(0)" : "translateY(6px)")};
  transition: opacity 0.15s ease, transform 0.15s ease;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  color: #323743;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover {
    background: #f5f8ff;
  }

  &:active {
    background: #e8efff;
  }

  &:disabled {
    color: #9095a1;
    cursor: not-allowed;
    background: none;
  }
`;

const ToastContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #323743;
  color: #fff;
  font-size: 13px;
  padding: 10px 20px;
  border-radius: 20px;
  white-space: nowrap;
  z-index: 2000;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ExportSvg = styled.svg`
  flex-shrink: 0;
`;

// ─── Props ────────────────────────────────────────────────────────────────────

interface ExportButtonProps {
  exportRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const ExportButton: React.FC<ExportButtonProps> = ({
  exportRef,
  fileName = "conti",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const captureCanvas = async () => {
    const target = exportRef.current;
    if (!target) return null;

    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(target, {
      useCORS: true,
      allowTaint: false,
      scale: 2,
      ignoreElements: (el) => {
        return (el as HTMLElement).dataset?.exportHide === "true";
      },
    });
    return canvas;
  };

  const handleExportPng = async () => {
    setMenuOpen(false);
    if (isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
      showToast("PNG로 저장됐어요");
    } catch (err) {
      console.error("[ExportButton] PNG export 실패:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setMenuOpen(false);
    if (isExporting) return;
    setIsExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;

      const { jsPDF } = await import("jspdf");

      const imgData = canvas.toDataURL("image/png");
      const pxWidth = canvas.width;
      const pxHeight = canvas.height;

      // A4 기준 (pt 단위): 595 x 842
      const pageWidthPt = 595;
      const pageHeightPt = 842;

      // 이미지 비율 유지하며 페이지 너비에 맞춤
      const imgHeightPt = (pxHeight / pxWidth) * pageWidthPt;

      const pdf = new jsPDF({
        orientation: imgHeightPt > pageWidthPt ? "portrait" : "landscape",
        unit: "pt",
        format: "a4",
      });

      if (imgHeightPt <= pageHeightPt) {
        // 한 페이지에 맞음
        pdf.addImage(imgData, "PNG", 0, 0, pageWidthPt, imgHeightPt);
      } else {
        // 여러 페이지로 분할
        let yOffset = 0;
        let pageIndex = 0;
        while (yOffset < imgHeightPt) {
          if (pageIndex > 0) pdf.addPage();
          // 현재 페이지에서 보여줄 source y 좌표 (px 단위)
          const srcY = Math.round((yOffset / imgHeightPt) * pxHeight);
          const srcH = Math.round((pageHeightPt / imgHeightPt) * pxHeight);

          // 해당 슬라이스만 별도 canvas로 추출
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = pxWidth;
          sliceCanvas.height = Math.min(srcH, pxHeight - srcY);
          const ctx = sliceCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              srcY,
              pxWidth,
              sliceCanvas.height,
              0,
              0,
              pxWidth,
              sliceCanvas.height
            );
          }
          const sliceData = sliceCanvas.toDataURL("image/png");
          const sliceHeightPt =
            (sliceCanvas.height / pxHeight) * imgHeightPt;
          pdf.addImage(sliceData, "PNG", 0, 0, pageWidthPt, sliceHeightPt);

          yOffset += pageHeightPt;
          pageIndex++;
        }
      }

      pdf.save(`${fileName}.pdf`);
      showToast("PDF로 저장됐어요");
    } catch (err) {
      console.error("[ExportButton] PDF export 실패:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div ref={wrapperRef} style={{ position: "relative" }}>
        <Button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="콘티 내보내기"
          aria-expanded={menuOpen}
          disabled={isExporting}
        >
          <ExportSvg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4f8eec"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </ExportSvg>
          {isExporting ? "처리 중..." : "내보내기"}
        </Button>

        <DropdownMenu $visible={menuOpen} role="menu">
          <DropdownItem
            type="button"
            onClick={handleExportPng}
            disabled={isExporting}
            role="menuitem"
          >
            <ExportSvg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f8eec"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </ExportSvg>
            PNG로 저장
          </DropdownItem>
          <DropdownItem
            type="button"
            onClick={handleExportPdf}
            disabled={isExporting}
            role="menuitem"
          >
            <ExportSvg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e05c5c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="15" y2="17" />
              <line x1="9" y1="9" x2="12" y2="9" />
            </ExportSvg>
            PDF로 저장
          </DropdownItem>
        </DropdownMenu>
      </div>

      <ToastContainer $visible={!!toastMsg}>{toastMsg ?? ""}</ToastContainer>
    </>
  );
};

export default ExportButton;
