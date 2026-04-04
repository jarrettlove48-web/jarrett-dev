import Image from "next/image";
import { getAllEvents } from "@/lib/lifestyle";

export default function LifestylePage() {
  const events = getAllEvents();

  return (
    <div className="flex flex-col gap-12 py-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Lifestyle</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Moments outside the code. Trips, events, and the life in between.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface p-10 text-center">
          <p className="mb-2 text-text-secondary">No moments yet.</p>
          <p className="text-sm text-text-dim">
            Drop photos into <code className="font-mono text-accent">public/lifestyle/</code> and
            add an event JSON to <code className="font-mono text-accent">src/content/lifestyle/</code> to
            get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          {events.map((event) => (
            <section key={event.slug}>
              {/* Event Header */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {event.title}
                  </h2>
                  <p className="mt-1 text-text-secondary">{event.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-xs text-text-dim">
                    {event.date}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {event.location}
                  </div>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {event.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-surface"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
