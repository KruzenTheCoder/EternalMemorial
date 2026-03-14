"use client";

import { LiveKitRoom, VideoConference, useTracks } from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Track } from "livekit-client";

interface StreamBroadcasterProps {
  streamKey: string;
  adminName: string;
}

export default function StreamBroadcaster({ streamKey, adminName }: StreamBroadcasterProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/api/livestream/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: streamKey,
            identity: `admin-${adminName}`,
          }),
        });
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
        setError("Failed to connect to streaming server");
      }
    })();
  }, [streamKey, adminName]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-muted rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      video={true}
      audio={true}
      data-lk-theme="default"
      style={{ height: "100%", minHeight: "600px" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
