// components/Notification.tsx

import React, { useEffect } from "react";
import styled, { css, keyframes } from "styled-components";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(100%);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from { 
    opacity: 1; 
    transform: translateY(0);
  }
  to { 
    opacity: 0; 
    transform: translateY(100%);
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const NotificationContent = styled.div<{ $type: string; $visible: boolean }>`
  background-color: ${({ $type }) =>
    $type === "success"
      ? "#4CAF50"
      : $type === "error"
      ? "#F44336"
      : "#2196F3"};
  color: white;
  padding: 12px 20px;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  animation: ${({ $visible }) =>
    $visible
      ? css`
          ${fadeIn} 0.5s forwards
        `
      : css`
          ${fadeOut} 0.5s forwards
        `};
  z-index: 1000;
`;

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  onClose,
}) => {
  const [visible, setVisible] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <NotificationContainer>
      <NotificationContent $type={type} $visible={visible}>
        {message}
      </NotificationContent>
    </NotificationContainer>
  );
};

export default Notification;
