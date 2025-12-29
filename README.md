# HiQurate Ops - Introduction Presentation

A modern, cybersecurity-focused presentation deck built with HTML and Tailwind CSS.

## Overview

This repository contains 11 slides introducing HiQurate Ops, a cybersecurity consulting firm focused on practical, accessible security solutions for growing businesses.

## Features

- **Modern Design**: Dark cyberpunk theme with cyan, purple, and green accent colors
- **Responsive Layout**: Built with Tailwind CSS for clean, maintainable styling
- **Interactive Elements**: Hover effects, animated components, and smooth transitions
- **Professional Typography**: Custom fonts (Montserrat, Inter, JetBrains Mono)
- **Rich Icons**: Font Awesome icons throughout the presentation
- **Navigation**: Slide-to-slide navigation with circular loop navigation

## Slides

1. **Slide 1**: Title & Introduction
2. **Slide 2**: The Problem Statement
3. **Slide 3**: Market Opportunity
4. **Slide 4**: HiQurate's Approach
5. **Slide 5**: Service Offerings
6. **Slide 6**: Go-to-Market Strategy
7. **Slide 7**: Competitive Advantages
8. **Slide 8**: Revenue Streams
9. **Slide 9**: Financial Projections
10. **Slide 10**: Team & Execution
11. **Slide 11**: Closing & Call-to-Action

## Project Structure

```
.
├── index.html           # Landing page (links to all slides)
├── slide1.html - slide11.html   # Individual presentation slides
├── assets/
│   ├── images/         # Logo and images
│   ├── fonts/          # Custom font files
│   ├── fontawesome/    # Icon library
│   └── js/             # JavaScript utilities
├── README.md           # This file
└── .github/workflows/  # GitHub Pages deployment config
```

## Getting Started

### Viewing Locally

1. Clone the repository:
```bash
git clone https://github.com/hiqurate/Introduction.git
cd Introduction
```

2. Open in your browser:
   - Open `index.html` in your web browser
   - Or use a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

### Deployment

This repository is set up with GitHub Pages automatic deployment:

- **URL**: https://hiqurate.github.io/Introduction
- **Deploy Trigger**: Push to `main` branch
- **Status**: Automatically built and deployed via GitHub Actions

## Technologies Used

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome 6.4.0**: Icon library
- **Google Fonts**: Typography
- **GitHub Actions**: CI/CD and deployment

## Customization

### Updating Slide Content

Each slide is a self-contained HTML file. To modify:
1. Open the slide file (e.g., `slide3.html`)
2. Update the content within the main content section
3. Commit and push changes
4. GitHub Pages will automatically redeploy

### Color Theme

Colors are defined in the Tailwind config within each HTML file:
```javascript
colors: {
    cyber: {
        dark: '#0B1120',
        blue: '#0F172A',
        light: '#1E293B',
        accent: '#06B6D4',
        glow: '#22D3EE',
        surface: '#182235',
        dim: '#334155',
        purple: '#8B5CF6',
        green: '#10B981',
        orange: '#F59E0B'
    }
}
```

## Contact

**Email**: hello@hiqurateops.com  
**Website**: www.hiqurateops.com

## License

© 2024 HiQurate Ops. All rights reserved.

---

Built with ❤️ for cybersecurity excellence.
