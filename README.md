# When Is It At? 🌍

**When Is It At?** is a global event time converter that helps you discover when events happen in your local timezone. Create and share events with precise timezone information, making international events accessible to everyone.

## ✨ Features

- **🌍 Global Timezone Conversion**: Convert any event time to your local timezone instantly
- **📅 Event Creation**: Create your own events with custom names, dates, and timezones
- **🔗 Shareable Links**: Generate shareable URLs for any event
- **⏰ Real-time Countdown**: Live countdown timers showing time until/since events
- **📊 Detailed Time Breakdown**: View time differences in years, months, weeks, days, hours, minutes, and seconds
- **🎨 Dynamic Open Graph Images**: Auto-generated social media preview images for shared events
- **♿ Accessible Design**: Built with accessibility and user experience in mind
- **📱 Responsive**: Works perfectly on desktop and mobile devices

## 🚀 How It Works

1. **Convert Times**: See when global events occur in your local time
2. **Create & Share**: Make your own events and share them with others
3. **Global to Local**: Any event with a single global time becomes local for everyone

## 🛠️ Tech Stack

- **Frontend**: Vue 3 with TypeScript
- **Styling**: Pico CSS for clean, semantic styling
- **Time Handling**: Luxon for robust timezone and date operations
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Vitest for unit testing
- **Linting**: ESLint with Vue and TypeScript support

## 📦 Project Setup

### Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- npm

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

This starts the development server with hot-reload at `http://localhost:5173`

### Production Build

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

### Testing

```sh
npm run test:unit
```

### Linting

```sh
npm run lint
```

### Code Formatting

```sh
npm run format
```

## 🏗️ Project Structure

```
src/
├── components/          # Vue components
│   ├── AddComponent.vue     # Event creation form
│   ├── EventComponent.vue   # Event display and countdown
│   ├── HomeComponent.vue    # Landing page
│   └── ConsentManager.vue   # GDPR compliance
├── services/            # Business logic services
│   ├── TimeFormatService.ts    # Time formatting utilities
│   ├── RoutingService.ts       # Client-side routing
│   ├── SeoService.ts          # SEO and meta tag management
│   ├── UrlCoderService.ts     # URL encoding/decoding
│   └── DynamicImageGenerator.ts # Open Graph image generation
├── util/                # Utility functions
└── types.ts            # TypeScript type definitions
```

## 🌐 Live Demo

Visit [when-is-it.at](https://when-is-it.at) to see the application in action.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Created by [Codewald](https://github.com/codewald) - feel free to reach out!
