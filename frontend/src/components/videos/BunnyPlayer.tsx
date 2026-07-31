'use client';

interface BunnyPlayerProps {
  videoGuid: string;
  title: string;
}

export default function BunnyPlayer({ videoGuid, title }: BunnyPlayerProps) {
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;

  if (!videoGuid || !libraryId) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
        <p className="text-slate-500">
          Vídeo não disponível ou em processamento.
        </p>
      </div>
    );
  }

  const embedUrl =
    `https://iframe.mediadelivery.net/embed/${libraryId}/${videoGuid}` +
    `?autoplay=false&loop=false&muted=false&preload=true`;

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
