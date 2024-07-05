import { Media } from "@/defs";
import React from "react";

interface MediaPlaybackProps {
  media: Media;
}

interface Props {
  media: Media;
}

export function MediaPlayback({ media }: MediaPlaybackProps) {
  return (
    <video
      controls
      width="100%"
      src={`/api/stream?type=${media.mediaType}&id=${media.id}`}
    >
      Your browser does not support the video tag.
    </video>
  );
}
