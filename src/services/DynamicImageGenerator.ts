import type { EventDetails } from '@/types';

export class DynamicImageGenerator {
    /**
     * Generate a dynamic SVG image for an event
     */
    static generateEventSVG(event: EventDetails): string {
        const eventName = event.n;
        const eventDate = new Date(event.d);
        const timezone = event.otz.replace('_', ' ');

        // Format date for display
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: event.otz,
        });

        // Calculate time until/from event
        const now = new Date();
        const isInFuture = eventDate > now;
        const timeDiff = Math.abs(eventDate.getTime() - now.getTime());
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const timeStatus = isInFuture
            ? `in ${daysDiff} days and ${hoursDiff} hours`
            : `${daysDiff} days and ${hoursDiff} hours ago`;

        // Truncate event name if too long
        const displayName = eventName.length > 40 ? eventName.substring(0, 37) + '...' : eventName;

        return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#1a1a1a"/>

  <!-- Gradient overlay -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#ffbf00;stop-opacity:0.2" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#gradient)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="6" fill="#ffd700"/>

  <!-- Main content area -->
  <g transform="translate(100, 150)">
    <!-- Logo/Icon -->
    <circle cx="50" cy="50" r="40" fill="#ffd700" opacity="0.9"/>
    <text x="50" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#1a1a1a" font-weight="bold">📅</text>

    <!-- Event Name -->
    <text x="150" y="50" font-family="Arial, sans-serif" font-size="36" fill="#ffffff" font-weight="bold">${displayName}</text>

    <!-- Time Status -->
    <text x="150" y="85" font-family="Arial, sans-serif" font-size="24" fill="#ffd700" font-weight="bold">${timeStatus}</text>

    <!-- Date and Time -->
    <text x="150" y="115" font-family="Arial, sans-serif" font-size="18" fill="#cccccc">${formattedDate}</text>

    <!-- Timezone -->
    <text x="150" y="140" font-family="Arial, sans-serif" font-size="16" fill="#aaaaaa">Timezone: ${timezone}</text>

    <!-- Call to action -->
    <text x="150" y="180" font-family="Arial, sans-serif" font-size="16" fill="#ffd700">View in your local timezone at when-is-it.at</text>
  </g>

  <!-- Bottom branding -->
  <text x="100" y="580" font-family="Arial, sans-serif" font-size="14" fill="#666666">when-is-it.at</text>
  <text x="1000" y="580" font-family="Arial, sans-serif" font-size="14" fill="#666666">© 2025 Codewald</text>
</svg>`;
    }

    /**
     * Generate a data URL for the SVG
     */
    static generateEventImageDataURL(event: EventDetails): string {
        const svg = this.generateEventSVG(event);
        const encodedSvg = encodeURIComponent(svg);
        return `data:image/svg+xml,${encodedSvg}`;
    }

    /**
     * Generate a dynamic SVG for the home page
     */
    static generateHomeSVG(): string {
        return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#1a1a1a"/>

  <!-- Gradient overlay -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#ffbf00;stop-opacity:0.2" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#gradient)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="6" fill="#ffd700"/>

  <!-- Main content area -->
  <g transform="translate(100, 150)">
    <!-- Logo/Icon -->
    <circle cx="50" cy="50" r="40" fill="#ffd700" opacity="0.9"/>
    <text x="50" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#1a1a1a" font-weight="bold">📅</text>

    <!-- Title -->
    <text x="150" y="60" font-family="Arial, sans-serif" font-size="48" fill="#ffffff" font-weight="bold">When is it at?</text>

    <!-- Subtitle -->
    <text x="150" y="100" font-family="Arial, sans-serif" font-size="24" fill="#cccccc">Global Event Time Converter</text>

    <!-- Description -->
    <text x="150" y="140" font-family="Arial, sans-serif" font-size="18" fill="#aaaaaa" max-width="800">
      Convert global events to your local timezone instantly
    </text>

    <!-- Features -->
    <g transform="translate(150, 200)">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="16" fill="#ffd700">✓ Timezone Conversion</text>
      <text x="0" y="30" font-family="Arial, sans-serif" font-size="16" fill="#ffd700">✓ Event Creation &amp; Sharing</text>
      <text x="0" y="60" font-family="Arial, sans-serif" font-size="16" fill="#ffd700">✓ Real-time Countdown</text>
    </g>
  </g>

  <!-- Bottom branding -->
  <text x="100" y="580" font-family="Arial, sans-serif" font-size="14" fill="#666666">when-is-it.at</text>
  <text x="1000" y="580" font-family="Arial, sans-serif" font-size="14" fill="#666666">© 2025 Codewald</text>
</svg>`;
    }

    /**
     * Generate a data URL for the home SVG
     */
    static generateHomeImageDataURL(): string {
        const svg = this.generateHomeSVG();
        const encodedSvg = encodeURIComponent(svg);
        return `data:image/svg+xml,${encodedSvg}`;
    }
}
