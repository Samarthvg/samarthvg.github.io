import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * What I'm listening to, read through a rained-on window.
 *
 * The feed is the nowplaying Worker's /now.json, never Last.fm directly: the
 * Worker holds a KV snapshot written by a once-a-minute cron, so this is a
 * read of cached state and cannot be made slow by Last.fm being slow. CORS is
 * open on that route, so the page can take it straight from the browser.
 *
 * The cover is the point. It is the one colour on this page that is not a
 * palette token and not fixed — it changes with whatever is actually playing,
 * which is what a page of charcoal and two restrained pigments cannot do for
 * itself.
 */
const FEED = 'https://nowplaying.samarthg.workers.dev/now.json'
const REFRESH = 60_000

export default function NowPlaying({ className = '' }) {
  const [track, setTrack] = useState(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const ctl = new AbortController()
    let timer

    const read = async () => {
      try {
        const r = await fetch(FEED, { signal: ctl.signal })
        if (!r.ok) return
        const data = await r.json()
        if (data?.track?.title) setTrack(data.track)
      } catch {
        /* offline, blocked, or the Worker is down: the panel just stays away */
      }
    }

    read()
    timer = setInterval(read, REFRESH)
    return () => {
      ctl.abort()
      clearInterval(timer)
    }
  }, [])

  // Nothing renders until there is something to say. A placeholder card would
  // be a worse hole than the empty space it is filling.
  if (!track) return null

  return (
    <figure className={`np ${className}`}>
      <a
        href={track.url || 'https://www.last.fm/user/Samarthvg'}
        target="_blank"
        rel="noreferrer noopener"
        className="np-pane group"
      >
        {track.artUrl && (
          <>
            {/* the light behind the glass */}
            <span
              aria-hidden="true"
              className="np-wash"
              style={{ backgroundImage: `url(${track.artUrl})` }}
            />
            {/* the water on it */}
            <span aria-hidden="true" className="np-drops" />
            <span aria-hidden="true" className={`np-runs ${reduce ? '' : 'np-runs--live'}`} />
          </>
        )}

        <span className="np-frost" aria-hidden="true" />

        <span className="np-body">
          {track.artUrl && (
            <img
              src={track.artUrl}
              alt=""
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              className="np-art"
            />
          )}
          <span className="min-w-0">
            <span className="np-label">
              {track.playing ? (
                <>
                  <span className="np-dot" aria-hidden="true" />
                  Now playing
                </>
              ) : (
                'Last played'
              )}
            </span>
            <span className="np-title">{track.title}</span>
            <span className="np-artist">{track.artist}</span>
          </span>
        </span>
      </a>
    </figure>
  )
}
