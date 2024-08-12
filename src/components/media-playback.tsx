import { Media } from "@/defs";
import styled from "@emotion/styled";
import React, { useEffect } from "react";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  background-color: black;
`;

interface Props {
  media: Media;
}

export function MediaPlayback({ media }: Props) {
  useEffect(() => {
    const head = document.head;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(
      document.createTextNode("html, body { margin: 0; padding: 0; }")
    );
    head.appendChild(style);
    return () => {
      head.removeChild;
    };
  }, []);
  return (
    <StyledMain>
      <video
        controls
        width={"100%"}
        height={"100%"}
        src={`/api/stream?type=${media.mediaType}&id=${media.id}`}
      >
        Your browser does not support the video tag.
      </video>
    </StyledMain>
  );
}
