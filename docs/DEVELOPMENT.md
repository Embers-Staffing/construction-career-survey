# Development Guidelines

## Code Style and Organization

### JavaScript Files
1. Always use 'use strict' mode
2. Use the DEBUG utility for logging:
   ```javascript
   DEBUG.info('Message');  // For general information
   DEBUG.debug('Data:', data);  // For debugging details
   DEBUG.error('Error:', error);  // For error handling
   ```
3. Add JSDoc comments for functions:
   ```javascript
   /**
    * Calculate user's age from birth year and month
    * @param {number} birthYear - Year of birth
    * @param {number} birthMonth - Month of birth (1-12)
    * @returns {number|null} Age in years or null if invalid
    */
   function calculateAge(birthYear, birthMonth) {
   ```
4. Use descriptive variable names
5. Keep functions focused and single-purpose
6. Handle errors gracefully with user-friendly messages
7. Validate data before storing in Firestore
8. Provide default values for potentially missing data

## Git and Version Control

### Commit Messages
Use semantic commit messages:
- `fix:` for bug fixes
- `feat:` for new features
- `docs:` for documentation
- `refactor:` for code changes that neither fix bugs nor add features
- `style:` for formatting changes
- `test:` for tests
- `chore:` for maintenance

Example:
```
fix: Update Holland Code validation

1. Normalize Holland Code format
2. Add error handling
3. Improve user feedback
```

### Branch Management
1. Keep commits focused and atomic
2. Always update both `main` and `gh-pages` branches
3. Review changes before merging
4. Keep branches up to date

## Data Storage Strategy

### Database Storage (Firestore)
Store data that is:
- Relatively stable over time
- Core to the application's functionality
- Requires approval or review before changes

Examples:
1. Personality Profiles
   - Holland Code descriptions and base job matches
   - MBTI type descriptions and characteristics
   - Core competencies for each profile

2. Survey Questions
   - Question text and options
   - Scoring rules
   - Category mappings

### Dynamic Code Storage
Store data that is:
- Frequently updated
- Market-dependent
- Region-specific
- Time-sensitive

Examples:
1. Career Information
   - Salary ranges
   - Job market trends
   - Growth projections
   - Career progression paths

2. Training Resources
   - Course listings
   - Certification programs
   - Educational resources
   - Cost information
   - Provider links

3. Technology Trends
   - Emerging tools
   - Industry software
   - New methodologies

## Update Procedures

### Database Updates
1. Create changes in `setup_recommendations.py`
2. Review changes with team
3. Test in development environment
4. Deploy to production
5. Document changes in changelog

### Code Updates
1. Update relevant constants in `script.js`
2. Add new functions if needed
3. Test changes locally
4. Deploy through normal git workflow

## API Integration Guidelines

### External APIs
- Salary data APIs
- Job posting aggregators
- Training platform APIs
- Market trend data sources

### Internal APIs
- Firebase/Firestore interactions
- Authentication services
- Analytics tracking

## Code Organization

### Frontend
- `index.html`: Main application interface
- `script.js`: Application logic and dynamic data
- `styles.css`: Styling and layout

### Backend
- `firebase.js`: Database interactions
- `setup_recommendations.py`: Database population
- `analytics/`: Data analysis tools

### Documentation
- `docs/`: Documentation directory
- `DEVELOPMENT.md`: This file
- `README.md`: Project overview
- `ARCHITECTURE.md`: System architecture

## Best Practices

### Data Updates
1. Salary Ranges
   - Update quarterly
   - Use reliable industry sources
   - Include regional variations

2. Training Resources
   - Review monthly
   - Verify links and costs
   - Update course availability

3. Technology Trends
   - Monitor industry news
   - Update as new tools emerge
   - Remove obsolete technologies

### Code Maintenance
1. Keep dynamic data separate from core logic
2. Document all data sources
3. Version control all changes
4. Maintain test coverage

## Security Considerations

1. Credentials
   - Store in environment variables
   - Never commit to repository
   - Regular rotation of API keys

2. User Data
   - Encrypt sensitive information
   - Follow data protection regulations
   - Regular security audits

## Security and Sensitive Data

### Files to Never Commit
1. Sensitive files:
   - `firebase-credentials.json`
   - `.env` files
   - API keys
   - Private configuration files
   - Personal IDE settings

2. Build artifacts:
   - `node_modules/`
   - `dist/`
   - `build/`
   - `.cache/`

3. OS-specific files:
   - `.DS_Store`
   - `Thumbs.db`
   - `Desktop.ini`

4. Logs and temporary files:
   - `*.log`
   - `*.tmp`
   - `*.temp`
   - `*.swp`

### Handling Sensitive Data
1. Use environment variables for secrets
2. Keep example files (e.g., `firebase-credentials.example.json`)
3. Document required environment variables
4. Use `.gitignore` to prevent accidental commits

## Deployment Process

1. Development
   - Local testing
   - Unit tests
   - Integration tests

2. Staging
   - Full system testing
   - Data validation
   - Performance testing

3. Production
   - Gradual rollout
   - Monitoring
   - Backup procedures
