# Shared Components

This directory contains reusable shared components for the football app.

## Components

### TeamLogo

Displays team logos with loading states and fallbacks.

```jsx
import { TeamLogo } from './components/shared';

<TeamLogo
  uri="https://example.com/logo.png"
  size="md" // sm | md | lg | xl
  rounded={true}
/>;
```

**Props:**

- `uri` (string): Image URL
- `size` (string): Size variant - sm (32px), md (48px), lg (64px), xl (80px)
- `rounded` (boolean): Apply rounded corners
- `fallback` (ReactNode): Custom fallback component
- `style` (object): Additional styles

**Features:**

- Loading placeholder with spinner
- Fallback shield icon on error
- Optimized image loading
- Size variations

---

### PlayerAvatar

Displays player photos with circular design and initials fallback.

```jsx
import { PlayerAvatar } from './components/shared';

<PlayerAvatar
  uri="https://example.com/player.jpg"
  name="Lionel Messi"
  size="md" // sm | md | lg | xl
  border={true}
/>;
```

**Props:**

- `uri` (string): Image URL
- `name` (string): Player name for initials fallback
- `size` (string): Size variant - sm (32px), md (48px), lg (64px), xl (80px)
- `border` (boolean): Apply primary color border
- `fallback` (ReactNode): Custom fallback component
- `style` (object): Additional styles

**Features:**

- Circular design
- Loading placeholder with spinner
- Initials fallback (e.g., "LM" for Lionel Messi)
- User icon fallback if no name
- Optional primary color border

---

### MatchCard

Displays match information with teams, scores, and status.

```jsx
import { MatchCard } from './components/shared';

<MatchCard
  match={{
    id: 123,
    homeTeam: { name: 'Barcelona', logo: '...' },
    awayTeam: { name: 'Real Madrid', logo: '...' },
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    league: { name: 'La Liga' },
    date: '2024-01-15',
    time: '20:00',
  }}
  variant="detailed" // detailed | compact
  onPress={(match) => console.log(match)}
/>;
```

**Props:**

- `match` (object): Match data object
- `variant` (string): Display variant - detailed or compact
- `onPress` (function): Custom press handler (defaults to navigation)
- `style` (object): Additional styles

**Match Object:**

- `id`: Match ID for navigation
- `homeTeam`: { name, logo/logoUrl }
- `awayTeam`: { name, logo/logoUrl }
- `homeScore`: Home team score
- `awayScore`: Away team score
- `status`: Match status (live, finished, scheduled)
- `league/competition`: { name }
- `date`: Match date
- `time`: Match time

**Features:**

- Team logos with names
- Score display for finished/live matches
- Time display for upcoming matches
- Status badge (En Vivo, Finalizado, Próximo)
- League/competition name
- Press animation
- Auto-navigation to match detail
- Compact variant for lists

---

### StatCard

Displays statistics with labels, values, and trend indicators.

```jsx
import { StatCard } from './components/shared';
import { Target } from 'lucide-react-native';

<StatCard
  label="Goals"
  value="25"
  icon={<Target size={16} color="#00ff87" />}
  trend="up" // up | down | neutral
  variant="highlighted" // default | highlighted
/>;
```

**Props:**

- `label` (string): Stat label/description
- `value` (string|number): Stat value
- `icon` (ReactNode): Optional icon
- `trend` (string): Trend indicator - up, down, neutral
- `variant` (string): Display variant - default or highlighted
- `style` (object): Additional styles

**Features:**

- Large value display
- Descriptive label
- Optional icon support
- Trend indicators with colors:
  - Up: Green with up arrow
  - Down: Red with down arrow
  - Neutral: Gray with minus
- Highlighted variant with border and emphasis
- Responsive sizing

---

## Usage

Import components individually:

```jsx
import TeamLogo from './components/TeamLogo';
import PlayerAvatar from './components/PlayerAvatar';
import MatchCard from './components/MatchCard';
import StatCard from './components/StatCard';
```

Or import from the shared index:

```jsx
import {
  TeamLogo,
  PlayerAvatar,
  MatchCard,
  StatCard,
} from './components/shared';
```

## Design System Integration

All components use the centralized theme from `styles/theme.js`:

- Colors
- Typography
- Spacing
- Border radius
- Shadows

Components follow the design system guidelines and are consistent with the UI component library.
