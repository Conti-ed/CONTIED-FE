import React from "react";

interface SvgIconProps {
  id: string;
  width?: string;
  height?: string;
  [x: string]: any;
}

const Icon: React.FC<SvgIconProps> = ({
  id,
  width = "16",
  height = "16",
  ...props
}) => {
  return (
    <svg width={width} height={height} {...props}>
      <use href={`#${id}`} />
    </svg>
  );
};

export default Icon;
