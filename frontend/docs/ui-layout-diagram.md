# RepoScope UI Layout Diagram

## Overall Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Top Navigation Bar                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  RepoScope Logo    Repository Selector ▼    User Avatar | Settings  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
├─────────────────┬───────────────────────────────────────────────────────────┤
│                 │                                                             │
│                 │                    Main Content Area                        │
│    Sidebar      │                                                             │
│                 │  ┌─────────────────────────────────────────────────────┐   │
│  ┌─────────┐   │  │                                                     │   │
│  │Overview │   │  │              Dashboard / Active Page                 │   │
│  │         │   │  │                                                     │   │
│  ├─────────┤   │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │   │
│  │Analysis │   │  │  │   Stats     │  │   Stats     │  │   Stats     │ │   │
│  │         │   │  │  │   Card 1    │  │   Card 2    │  │   Card 3    │ │   │
│  ├─────────┤   │  │  └─────────────┘  └─────────────┘  └─────────────┘ │   │
│  │Planning │   │  │                                                     │   │
│  │         │   │  │  ┌───────────────────────────────────────────────┐ │   │
│  ├─────────┤   │  │  │                                               │ │   │
│  │Threats  │   │  │  │            Activity Feed / Charts             │ │   │
│  │         │   │  │  │                                               │ │   │
│  ├─────────┤   │  │  └───────────────────────────────────────────────┘ │   │
│  │Timeline │   │  │                                                     │   │
│  │         │   │  │  ┌───────────────────────────────────────────────┐ │   │
│  ├─────────┤   │  │  │                                               │ │   │
│  │Settings │   │  │  │              Quick Actions                    │ │   │
│  │         │   │  │  │                                               │ │   │
│  └─────────┘   │  │  └───────────────────────────────────────────────┘ │   │
│                 │  └─────────────────────────────────────────────────────┘   │
│                 │                                                             │
└─────────────────┴───────────────────────────────────────────────────────────┘
```

## Detailed Component Breakdown

### 1. Top Navigation Bar
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔷 RepoScope    │  📁 owner/repository ▼  │              👤 User | ⚙️      │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Left**: Brand/Logo
- **Center**: Repository selector dropdown
- **Right**: User profile and settings

### 2. Sidebar Navigation
```
┌─────────────┐
│ 📊 Overview │ ← Active state (highlighted)
├─────────────┤
│ 🔍 Analysis │
├─────────────┤
│ 📋 Planning │
├─────────────┤
│ 🛡️ Threats  │
├─────────────┤
│ 📅 Timeline │
├─────────────┤
│ ⚙️ Settings │
└─────────────┘
```

### 3. Dashboard Content Areas

#### Stats Cards Row
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Total Files   │  │    Commits      │  │  Contributors   │  │     Stars       │
│                 │  │                 │  │                 │  │                 │
│     1,234       │  │     5,678       │  │       42        │  │      890        │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### Activity Feed Section
```
┌─────────────────────────────────────────────────────────────────────┐
│  Recent Activity                                          View All → │
├─────────────────────────────────────────────────────────────────────┤
│  🔵 feat: Add authentication flow              2 hours ago          │
│  🟢 fix: Resolve memory leak in parser         5 hours ago          │
│  🟡 docs: Update API documentation             1 day ago            │
│  🔵 refactor: Optimize database queries        2 days ago           │
└─────────────────────────────────────────────────────────────────────┘
```

#### Quick Actions Grid
```
┌─────────────────────┐  ┌─────────────────────┐
│   🚀 Create Plan    │  │   📊 View Metrics   │
│                     │  │                     │
│  Start a new project│  │  Analyze repository │
│  plan               │  │  statistics         │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│   🛡️ Security Scan  │  │   📅 Timeline View  │
│                     │  │                     │
│  Check for threats  │  │  Project milestones │
│  and vulnerabilities│  │  and deadlines      │
└─────────────────────┘  └─────────────────────┘
```

## Responsive Behavior

### Desktop (>1024px)
- Full sidebar visible
- Multi-column grid for stats and actions
- Side-by-side layout

### Tablet (768px - 1024px)
- Collapsible sidebar
- 2-column grid for stats
- Stacked quick actions

### Mobile (<768px)
- Hamburger menu for sidebar
- Single column layout
- Stacked components

## Color Scheme (Neon Theme)
```
Background:     #0a0a0a (Near black)
Sidebar:        #111111 (Slightly lighter)
Cards:          #1a1a1a (Dark gray)
Borders:        #333333 (Subtle borders)
Primary:        #00ff88 (Neon green)
Secondary:      #00ccff (Neon blue)
Accent:         #ff00ff (Neon pink)
Text:           #ffffff (White)
Text Muted:     #888888 (Gray)
```

## Navigation Flow
```
                    ┌─────────────┐
                    │  Dashboard  │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
   │Analysis │      │ Planning   │     │ Threats   │
   └─────────┘      └───────────┘     └───────────┘
                           │
                    ┌──────▼──────┐
                    │  Timeline   │
                    │ (Gantt View)│
                    └─────────────┘
```

## Key Design Principles
1. **Single Repository Focus**: Everything revolves around analyzing one repo at a time
2. **Clean Hierarchy**: Clear navigation with minimal nesting
3. **Action-Oriented**: Quick access to main features
4. **Data Visualization**: Charts and metrics prominently displayed
5. **Dark Theme**: Neon accents on dark background for modern look
