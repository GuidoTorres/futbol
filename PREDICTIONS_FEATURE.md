# Predictions Feature Documentation

## Overview

The Predictions feature provides users with AI-powered match predictions, including win probabilities, expected goals, confidence levels, and detailed analysis based on historical data and team form.

## Features Implemented

### 1. Predictions Tab

- **Location**: `app/(tabs)/predictions.jsx`
- **Features**:
  - Three sub-tabs: Upcoming, High Confidence, and Accuracy
  - Display of match predictions with probabilities
  - Visual confidence indicators
  - Expected goals display
  - Pull-to-refresh functionality

### 2. Prediction Service

- **Location**: `services/predictions.js`
- **API Endpoints**:
  - `getMatchPrediction(matchId)` - Get prediction for a specific match
  - `getUpcomingPredictions(limit, date)` - Get predictions for upcoming matches
  - `getHighConfidencePredictions(minConfidence, limit)` - Get high confidence predictions
  - `getHeadToHeadAnalysis(homeTeamId, awayTeamId)` - Get H2H analysis
  - `getPredictionAccuracy(period)` - Get accuracy statistics
  - `getTeamForm(teamId, matches)` - Get team form analysis
  - `getPredictionDashboard()` - Get dashboard summary
  - `recalculatePrediction(matchId)` - Force recalculation

### 3. Prediction Detail Component

- **Location**: `components/PredictionDetail.jsx`
- **Features**:
  - Confidence level display with color coding
  - Interactive pie chart showing win/draw/lose probabilities
  - Expected goals (xG) visualization
  - Key factors affecting the prediction
  - Head-to-head historical analysis
  - Recent match history between teams
  - Model version and generation timestamp

## UI Components

### Predictions Screen Tabs

#### 1. Upcoming Tab

- Shows predictions for upcoming matches
- Displays:
  - Team names
  - Confidence badge (color-coded)
  - Win/Draw/Lose probabilities
  - Expected goals
  - Most likely outcome

#### 2. High Confidence Tab

- Filters predictions with confidence ≥ 70%
- Same card layout as Upcoming tab
- Helps users identify most reliable predictions

#### 3. Accuracy Tab

- Shows prediction accuracy statistics for last 30 days
- Displays:
  - Overall accuracy percentage
  - Total predictions count
  - Correct predictions count
  - Accuracy breakdown by confidence level (High/Medium/Low)
  - Bar chart visualization

### Prediction Cards

Each prediction card includes:

- **Header**: Team names and confidence badge
- **Probabilities**: Three columns showing home/draw/away percentages
- **Expected Goals**: Predicted score
- **Outcome**: Most likely result highlighted

### Color Coding

Confidence levels are color-coded:

- **Very High (≥80%)**: Bright green (#00ff87)
- **High (≥60%)**: Green (#4CAF50)
- **Medium (≥40%)**: Yellow (#FFC107)
- **Low (<40%)**: Red (#FF5722)

## Data Flow

```
User Opens Predictions Tab
    ↓
Load Data (Parallel Requests)
    ├── getUpcomingPredictions()
    ├── getHighConfidencePredictions()
    └── getPredictionAccuracy()
    ↓
Display in Selected Tab
    ↓
User Taps Prediction Card
    ↓
Navigate to Match Detail
    ↓
Show Detailed Prediction Analysis
```

## Backend Integration

The frontend integrates with the following backend endpoints:

- `GET /api/predictions/matches/:matchId` - Single match prediction
- `GET /api/predictions/upcoming` - Upcoming matches predictions
- `GET /api/predictions/high-confidence` - High confidence predictions
- `GET /api/predictions/h2h/:homeTeamId/:awayTeamId` - Head-to-head analysis
- `GET /api/predictions/accuracy` - Accuracy statistics
- `GET /api/predictions/teams/:teamId/form` - Team form analysis
- `GET /api/predictions/dashboard` - Dashboard summary
- `PUT /api/predictions/matches/:matchId/recalculate` - Recalculate prediction

## Prediction Algorithm

The backend uses a sophisticated algorithm that considers:

1. **Team Historical Performance**

   - Win/draw/loss rates
   - Goals scored and conceded
   - Home vs away performance

2. **Current Form**

   - Recent match results
   - Momentum analysis
   - Form strength scoring

3. **Head-to-Head Record**

   - Historical matchups
   - Average goals in H2H matches
   - Recent form in direct encounters

4. **External Factors**

   - Player injuries and suspensions
   - Team availability impact
   - Other contextual factors

5. **Confidence Calculation**
   - Sample size (number of matches analyzed)
   - Form consistency
   - Strength difference between teams
   - Availability of H2H data

## Usage Examples

### Viewing Upcoming Predictions

```javascript
import { getUpcomingPredictions } from '../services/predictions';

const predictions = await getUpcomingPredictions(10);
// Returns predictions for next 10 upcoming matches
```

### Getting High Confidence Predictions

```javascript
import { getHighConfidencePredictions } from '../services/predictions';

const predictions = await getHighConfidencePredictions(75, 5);
// Returns top 5 predictions with confidence ≥ 75%
```

### Viewing Prediction Details

```javascript
import PredictionDetail from '../components/PredictionDetail';

<PredictionDetail matchId={matchId} homeTeam={homeTeam} awayTeam={awayTeam} />;
```

## Styling

The predictions feature follows the app's dark theme:

- Background: #121212
- Cards: #1d1d1d
- Borders: #333
- Primary accent: #00ff87
- Text: #fff (primary), #999 (secondary), #666 (tertiary)

## Performance Considerations

1. **Caching**: Predictions are cached on the backend to reduce computation
2. **Parallel Loading**: Multiple API calls are made in parallel
3. **Pull-to-Refresh**: Users can manually refresh data
4. **Lazy Loading**: Charts are rendered only when visible

## Future Enhancements

Potential improvements for future versions:

1. **Live Updates**: Real-time prediction updates during matches
2. **User Predictions**: Allow users to make their own predictions
3. **Prediction History**: Track user's prediction accuracy
4. **Betting Odds Integration**: Compare predictions with betting odds
5. **Advanced Filters**: Filter by league, team, date range
6. **Notifications**: Alert users about high-confidence predictions
7. **Prediction Explanations**: More detailed AI reasoning
8. **Comparison View**: Compare multiple match predictions side-by-side

## Testing

To test the predictions feature:

1. Navigate to the Predictions tab in the app
2. Verify all three sub-tabs load correctly
3. Check that prediction cards display all information
4. Tap a prediction card to view match details
5. Verify charts render correctly
6. Test pull-to-refresh functionality
7. Check accuracy statistics display

## Troubleshooting

### Predictions Not Loading

- Check backend API is running
- Verify network connectivity
- Check console for API errors
- Ensure matches exist in database

### Charts Not Rendering

- Verify victory-native is installed
- Check chart data format
- Ensure screen dimensions are calculated correctly

### Accuracy Stats Missing

- Requires finished matches with predictions
- Check date range (default 30 days)
- Verify prediction data exists in database

## Dependencies

- `victory-native`: For charts and visualizations
- `expo-router`: For navigation
- `lucide-react-native`: For icons
- Backend prediction service with ML algorithms
