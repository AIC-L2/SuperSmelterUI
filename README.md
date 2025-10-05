# ReportLoader

This is an Angular application for managing production reports and recipes.

## Recipe Grid Minimizable Feature

The Recipe Grid component now includes a minimizable functionality that allows users to collapse and expand the grid view for better space management.

### Features

- **Toggle Button**: A button in the header allows users to minimize/expand the recipe grid
- **Smooth Animations**: CSS transitions provide smooth minimize/expand animations
- **Active Recipe Info**: When expanded, the header displays active recipe information including name, product, and speed
- **Responsive Design**: The grid adapts to different screen sizes
- **Visual Feedback**: Clear icons (chevron-up/down) indicate the current state
- **Default Minimized**: The grid starts in a minimized state by default

### Usage

1. **Expand Grid**: Click the chevron-down icon in the recipe grid header to expand
2. **Minimize Grid**: Click the chevron-up icon to collapse the grid back to minimized state
3. **Active Recipe Info**: When expanded, view active recipe details in the header

### Technical Implementation

- **Component**: `src/app/components/_Operator/recipe/recipe.component.ts`
- **Template**: `src/app/components/_Operator/recipe/recipe.component.html`
- **Styles**: `src/app/components/_Operator/recipe/recipe.component.scss`

### Key Properties

- `isRecipeGridMinimized`: Boolean property that tracks the grid state (defaults to true)
- `toggleRecipeGrid()`: Method that toggles between minimized and expanded states

### Styling

The component uses modern CSS with:
- Gradient backgrounds for the header
- Smooth transitions and animations
- Responsive design principles
- PrimeNG integration for consistent UI components
- Active recipe information displayed in the header when expanded

## Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Navigate to the recipe page to test the minimizable grid functionality

## Dependencies

- Angular 17+
- PrimeNG components
- RxJS for reactive programming
