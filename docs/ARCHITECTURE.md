# System Architecture

## UML Diagrams

### Class Diagram
```mermaid
classDiagram
    class CareerRecommendationService {
        -db: Firestore
        +getHollandCodeRecommendations(hollandCode: string)
        +getMBTIRecommendations(mbtiType: string)
        +getRecommendations(hollandCode: string, mbtiType: string)
        +storeSurveyResponse(surveyData: object, recommendations: object)
    }

    class SurveyForm {
        -formElement: HTMLFormElement
        -careerService: CareerRecommendationService
        +initialize()
        +handleSubmit(event)
        +validateForm()
        +calculatePersonalityTypes()
    }

    class CareerData {
        +salaryRanges: object
        +trainingResources: object
        +getCareerProgression(role: string, experience: number)
        +getRecommendedTraining(role: string, experience: number)
    }

    class ResultsDisplay {
        +displayResults(result: object, recommendations: object)
        +showCareerPath(path: array)
        +showTrainingOptions(training: array)
    }

    SurveyForm --> CareerRecommendationService
    SurveyForm --> CareerData
    SurveyForm --> ResultsDisplay
```

### Component Diagram
```mermaid
graph TB
    subgraph Frontend
        UI[User Interface]
        Form[Survey Form]
        Results[Results Display]
    end

    subgraph Services
        CRS[Career Recommendation Service]
        CD[Career Data Service]
    end

    subgraph Database
        FS[(Firestore)]
        subgraph Collections
            HC[Holland Codes]
            MT[MBTI Types]
            SR[Survey Responses]
        end
    end

    UI --> Form
    Form --> CRS
    Form --> CD
    CRS --> FS
    FS --> HC
    FS --> MT
    FS --> SR
    CRS --> Results
    CD --> Results
```

### Sequence Diagram
```mermaid
sequenceDiagram
    participant U as User
    participant F as Form
    participant CRS as CareerRecommendationService
    participant CD as CareerData
    participant DB as Database

    U->>F: Submit Survey
    F->>F: Validate Input
    F->>F: Calculate Types
    F->>CRS: Get Recommendations
    CRS->>DB: Fetch Holland Code Data
    CRS->>DB: Fetch MBTI Data
    DB-->>CRS: Return Recommendations
    F->>CD: Get Career Path
    F->>CD: Get Training Data
    CD-->>F: Return Dynamic Data
    F->>U: Display Results
```

## Data Flow

### Survey Submission
1. User fills out form
2. Form validates input
3. Calculates personality types
4. Fetches recommendations
5. Displays results

### Data Updates
1. Static Data (Database)
   - Update through setup script
   - Validate changes
   - Deploy to Firestore

2. Dynamic Data (Code)
   - Update constants
   - Test changes
   - Deploy through git

## Security Architecture

### Authentication
- Firebase Authentication
- Role-based access
- Secure API endpoints

### Data Protection
- Encryption at rest
- Secure transmission
- Regular backups

## Monitoring

### Performance
- Page load times
- API response times
- Database queries

### Error Tracking
- Client-side errors
- Server-side errors
- API failures

## Scaling Considerations

### Database
- Indexing strategy
- Query optimization
- Caching layer

### Application
- Code splitting
- Lazy loading
- Resource optimization
