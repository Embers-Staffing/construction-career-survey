# Construction Career Survey

A modern, interactive career recommendation tool for the construction industry. This survey uses MBTI personality types to suggest suitable construction-related careers, complete with detailed information about salary ranges, responsibilities, required skills, and career progression paths.

## Features

- MBTI-based career recommendations
- Detailed career information:
  - Salary ranges (entry-level and experienced)
  - Key responsibilities
  - Required skills
  - Education and training requirements
  - Professional certifications
  - Career progression paths
- Modern, responsive design
- Save recommendations as PDF
- Print-friendly output
- Mobile-friendly interface

## Live Demo

Visit the live site at: [https://embers-staffing.github.io/construction-career-survey/](https://embers-staffing.github.io/construction-career-survey/)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Embers-Staffing/construction-career-survey.git
   cd construction-career-survey
   ```

2. Serve the files locally using any static file server. For example:
   ```bash
   # Using Python's built-in server
   python3 -m http.server 8000
   
   # Or using Node's http-server
   npx http-server
   
   # Or using PHP's built-in server
   php -S localhost:8000
   ```

3. Open your browser and visit:
   ```
   http://localhost:8000
   ```

## Technology Stack

- HTML5
- CSS3 (with modern flexbox and grid layouts)
- JavaScript (ES6+)
- [Bootstrap 5.3](https://getbootstrap.com/) for responsive design
- [Font Awesome 5.15](https://fontawesome.com/) for icons
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF generation

## Development

The site is built as a static single-page application with no backend dependencies. All career matching and recommendations are handled client-side using JavaScript.

### Project Structure
```
construction-career-survey/
├── index.html          # Main application page
├── script.js           # Core application logic
├── styles.css          # Custom styles
├── images/            # Image assets
└── README.md
```

### Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `gh-pages` branch.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please follow our commit message conventions:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for changes that do not affect the code's meaning
- `refactor:` for code changes that neither fix bugs nor add features
- `test:` for adding or modifying tests
- `chore:` for routine tasks and maintenance

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- MBTI® is a trademark of The Myers & Briggs Foundation
- Built with 💖 by [Embers Staffing Solutions](https://embersstaffing.com/)
- Design and development by [Bigfoot](https://bigfootcrane.com/)
