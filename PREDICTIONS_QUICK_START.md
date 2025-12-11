# Predictions Feature - Quick Start Guide

## 🚀 What You Got

A complete predictions interface showing AI-powered match predictions with probabilities, expected goals, and detailed analysis.

## 📁 New Files

```
futbol-front/
├── services/predictions.js              # API service
├── app/(tabs)/predictions.jsx           # Main screen
├── components/PredictionDetail.jsx      # Detail component
└── docs/
    ├── PREDICTIONS_FEATURE.md           # Full documentation
    ├── PREDICTIONS_IMPLEMENTATION_SUMMARY.md
    └── PREDICTIONS_QUICK_START.md       # This file
```

## 🎯 How to Use

### 1. Navigate to Predictions

- Open the app
- Tap the "Predicciones" tab (TrendingUp icon)

### 2. View Predictions

Three tabs available:

- **Próximos**: Upcoming match predictions
- **Alta Confianza**: High confidence predictions (≥70%)
- **Precisión**: Accuracy statistics

### 3. See Details

- Tap any prediction card
- View detailed analysis with charts
- See head-to-head history

## 🎨 Visual Guide

### Confidence Colors

- 🟢 **Green** (≥80%): Very High Confidence
- 🟢 **Light Green** (≥60%): High Confidence
- 🟡 **Yellow** (≥40%): Medium Confidence
- 🔴 **Red** (<40%): Low Confidence

### Prediction Card Shows

1. Team names
2. Confidence badge
3. Win/Draw/Lose percentages
4. Expected goals
5. Most likely outcome

## 🔧 API Endpoints Used

```javascript
// Get prediction for a match
GET /api/predictions/matches/:matchId

// Get upcoming predictions
GET /api/predictions/upcoming?limit=10

// Get high confidence predictions
GET /api/predictions/high-confidence?minConfidence=70&limit=10

// Get accuracy stats
GET /api/predictions/accuracy?period=30

// Get head-to-head analysis
GET /api/predictions/h2h/:homeTeamId/:awayTeamId
```

## 💻 Code Examples

### Import and Use Service

```javascript
import { getUpcomingPredictions } from '../services/predictions';

// Get predictions
const data = await getUpcomingPredictions(10);
const predictions = data.data.predictions;
```

### Use Prediction Detail Component

```javascript
import PredictionDetail from '../components/PredictionDetail';

<PredictionDetail matchId={matchId} homeTeam={homeTeam} awayTeam={awayTeam} />;
```

## 🧪 Testing

1. **Start Backend**:

   ```bash
   cd futbol-back
   npm start
   ```

2. **Start Frontend**:

   ```bash
   cd futbol-front
   npm start
   ```

3. **Test Features**:
   - Open Predictions tab
   - Switch between sub-tabs
   - Tap prediction cards
   - Pull to refresh
   - Check charts render

## 📊 What Each Tab Shows

### Upcoming Tab

- Next 20 upcoming matches
- Predictions for each match
- Tap to see match details

### High Confidence Tab

- Predictions with ≥70% confidence
- Most reliable predictions
- Best for decision making

### Accuracy Tab

- Overall accuracy percentage
- Total predictions made
- Correct predictions count
- Accuracy by confidence level
- Bar chart visualization

## 🎯 Key Features

✅ Real-time predictions
✅ Confidence indicators
✅ Expected goals (xG)
✅ Win/Draw/Lose probabilities
✅ Head-to-head analysis
✅ Historical match data
✅ Team form analysis
✅ Injury/suspension adjustments
✅ Interactive charts
✅ Pull-to-refresh

## 🐛 Troubleshooting

### Predictions Not Loading

- Check backend is running
- Verify API URL in `config/api.js`
- Check console for errors
- Ensure matches exist in database

### Charts Not Showing

- Verify `victory-native` is installed
- Check screen dimensions
- Ensure data format is correct

### Empty State

- Normal if no upcoming matches
- Check database has match data
- Verify date range is correct

## 📚 More Info

- **Full Docs**: See `PREDICTIONS_FEATURE.md`
- **Implementation**: See `PREDICTIONS_IMPLEMENTATION_SUMMARY.md`
- **Changes Log**: See `.kiro/specs/database-population-system/CHANGES.md`

## 🎉 You're Ready!

The predictions feature is fully implemented and ready to use. Just start the app and navigate to the Predictions tab!

---

**Need Help?** Check the full documentation in `PREDICTIONS_FEATURE.md`
