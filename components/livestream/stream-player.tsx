"use client";
import { LiveKitRoom, VideoTrack, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import "@livekit/components-styles";

export function StreamPlayer({ streamKey, isLive }: { streamKey: string; isLive: boolean }) {
  const [token, setToken] = useState("");
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    if (!streamKey) return;
    (async () => {
      try {
        const resp = await fetch("/api/livestream/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName: streamKey, identity: `viewer-${Date.now()}` }),
        });
        const data = await resp.json();
        if (!resp.ok || !data?.token) {
          setTokenError(data?.error || "Unable to generate stream token");
          return;
        }
        setToken(data.token);
      } catch {
        setTokenError("Unable to connect to streaming service");
      }
    })();
  }, [streamKey]);

  if (!isLive) return (
    <div className="aspect-video w-full flex flex-col items-center justify-center border border-gold-400/20 rounded-xl bg-neutral-900/50 backdrop-blur-sm text-gold-100/60 font-serif">
      <div className="w-16 h-16 rounded-full border border-gold-400/30 flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gold-400/10" />
      </div>
      <p className="tracking-widest uppercase text-sm">Stream is currently offline</p>
    </div>
  );

  if (!token) return (
    <div className="aspect-video w-full flex flex-col items-center justify-center border border-gold-400/20 rounded-xl bg-neutral-900 text-gold-100 font-serif">
      <div className="animate-pulse tracking-widest uppercase text-sm">
        {tokenError || "Connecting to sanctuary..."}
      </div>
    </div>
  );

  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_WS_URL;
  if (!livekitUrl) {
    return (
      <div className="aspect-video w-full flex flex-col items-center justify-center border border-gold-400/20 rounded-xl bg-neutral-900 text-gold-100 font-serif">
        <div className="tracking-widest uppercase text-sm">Set NEXT_PUBLIC_LIVEKIT_URL to enable streaming</div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gold-400/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] luxury-ring">
      <div className="absolute top-4 left-4 z-10 bg-red-900/80 backdrop-blur-md border border-red-500/30 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
        Live Service
      </div>
      
      <LiveKitRoom
        serverUrl={livekitUrl}
        token={token}
        connect={true}
        video={true}
        audio={true}
        data-lk-theme="default"
        style={{ height: '100%', aspectRatio: '16/9' }}
      >
        <VideoContainer />
      </LiveKitRoom>

      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-400/50 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-400/50 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-400/50 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-400/50 rounded-br-lg pointer-events-none" />
    </div>
  );
}

function VideoContainer() {
  const tracks = useTracks([Track.Source.Camera]);
  return tracks[0] ? (
    <VideoTrack trackRef={tracks[0]} className="w-full h-full object-cover" />
  ) : (
    <div className="flex flex-col items-center justify-center h-full bg-neutral-900 text-gold-100/50 font-serif">
      <p className="tracking-widest uppercase text-sm animate-pulse">Waiting for broadcast signal...</p>
    </div>
  );
}
