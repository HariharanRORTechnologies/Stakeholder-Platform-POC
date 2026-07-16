# Theme Implementation Guide

## Getting Started with the New Enterprise Green Theme

This guide provides best practices and examples for using the updated Material-UI theme in your components.

---

## Quick Reference

### Import Theme Colors
```typescript
// The theme is automatically applied to all Material-UI components
// via the ThemeProvider in main.tsx. No additional imports needed!

// For custom components, use the theme hook:
import { useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.palette.primary.main }}>
      This will be #16A34A (primary green)
    </div>
  );
}
```

---

## Material-UI Components

### Buttons

#### Primary (Contained)
```tsx
<Button 
  variant="contained" 
  color="primary"
>
  Click Me
</Button>
// Background: #16A34A
// Hover: #15803D with shadow
// Text: #FFFFFF
```

#### Secondary (Outlined)
```tsx
<Button 
  variant="outlined" 
  color="primary"
>
  Secondary
</Button>
// Background: none
// Border: #E5E7EB
// Hover: light green background
```

#### Text Only
```tsx
<Button 
  variant="text" 
  color="primary"
>
  Text Button
</Button>
// Color: #16A34A
// Hover: light green background
```

#### Sizes
```tsx
<Button size="small">Small</Button>    {/* 0.75rem */}
<Button size="medium">Medium</Button>  {/* 0.875rem - default */}
<Button size="large">Large</Button>    {/* 1rem */}
```

#### Loading State
```tsx
<Button 
  disabled 
  startIcon={<CircularProgress size={20} />}
>
  Loading...
</Button>
```

#### Icon Buttons
```tsx
<IconButton color="primary">
  <SearchIcon />
</IconButton>
```

---

### Cards

#### Basic Card
```tsx
<Card>
  <CardContent>
    <Typography variant="h5">Card Title</Typography>
    <Typography variant="body2" color="textSecondary">
      Card description
    </Typography>
  </CardContent>
</Card>
// Auto styling: 12px radius, light border, soft shadow
```

#### Card with Actions
```tsx
<Card>
  <CardContent>
    <Typography>Content</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Learn More</Button>
    <Button size="small">Share</Button>
  </CardActions>
</Card>
```

#### Hoverable Card
```tsx
<Card
  sx={{
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[8],
      borderColor: theme.palette.primary.light,
    }
  }}
>
  {/* content */}
</Card>
```

---

### Text Fields

#### Text Input
```tsx
<TextField
  label="Email"
  type="email"
  placeholder="you@example.com"
  variant="outlined"
  fullWidth
/>
// Auto styling: light border, green focus ring
```

#### With Validation
```tsx
<TextField
  label="Email"
  error={hasError}
  helperText={hasError ? "Invalid email" : ""}
  variant="outlined"
/>
// Red border and text on error
// Green border and icon on success (with success prop)
```

#### Multiline
```tsx
<TextField
  label="Message"
  multiline
  rows={4}
  variant="outlined"
  fullWidth
/>
```

#### Disabled State
```tsx
<TextField
  label="Disabled"
  disabled
  value="Cannot edit"
  variant="outlined"
/>
// Gray background, disabled cursor
```

---

### Chips

#### Basic Chip
```tsx
<Chip 
  label="Tag" 
  variant="filled"
  color="primary"
/>
// Background: light green
// Text: dark green
```

#### With Avatar
```tsx
<Chip
  avatar={<Avatar>MJ</Avatar>}
  label="Maria Johnson"
  color="primary"
/>
```

#### Deletable Chip
```tsx
<Chip
  label="Remove me"
  onDelete={() => handleDelete()}
  color="primary"
/>
// Shows X button on hover
```

#### Outlined Chip
```tsx
<Chip
  label="Outlined"
  variant="outlined"
  color="primary"
/>
// Light border, no background
```

---

### Tables

#### Basic Table
```tsx
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell align="right">Score</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          <TableCell>{row.name}</TableCell>
          <TableCell align="right">{row.score}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
// Auto styling: striped rows, sticky header, hover effects
```

#### With Sorting
```tsx
<TableHead>
  <TableRow>
    <TableSortLabel
      active={orderBy === 'name'}
      direction={orderBy === 'name' ? order : 'asc'}
      onClick={() => handleSort('name')}
    >
      Name
    </TableSortLabel>
  </TableRow>
</TableHead>
```

#### With Selection
```tsx
<TableRow
  hover
  selected={isSelected}
  onClick={() => handleSelect(row.id)}
>
  {/* cells */}
</TableRow>
// Hover: light green background
// Selected: slightly darker green
```

---

### Dialogs

#### Confirm Dialog
```tsx
<Dialog open={open} onClose={onClose}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>
    Are you sure you want to proceed?
  </DialogContent>
  <DialogActions>
    <Button onClick={onClose}>Cancel</Button>
    <Button 
      onClick={handleConfirm} 
      variant="contained" 
      color="primary"
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>
```

#### Form Dialog
```tsx
<Dialog open={open} onClose={onClose}>
  <DialogTitle>Create New</DialogTitle>
  <DialogContent>
    <TextField
      label="Name"
      fullWidth
      margin="normal"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={onClose}>Cancel</Button>
    <Button variant="contained" color="primary">
      Create
    </Button>
  </DialogActions>
</Dialog>
```

---

### Alerts

#### Success Alert
```tsx
<Alert 
  severity="success"
  onClose={() => {}}
>
  Operation completed successfully!
</Alert>
// Background: light green tint
// Icon/Text: #22C55E
```

#### Error Alert
```tsx
<Alert severity="error">
  An error occurred. Please try again.
</Alert>
// Background: light red tint
// Icon/Text: #EF4444
```

#### Warning Alert
```tsx
<Alert severity="warning">
  Please review before continuing.
</Alert>
// Background: light amber tint
// Icon/Text: #F59E0B
```

#### Info Alert
```tsx
<Alert severity="info">
  New updates are available.
</Alert>
// Background: light blue tint
// Icon/Text: #0EA5E9
```

---

### Typography

#### Headings
```tsx
<Typography variant="h1">Extra Large</Typography>      {/* 2.5rem */}
<Typography variant="h2">Large</Typography>            {/* 2rem */}
<Typography variant="h3">Medium Large</Typography>     {/* 1.5rem */}
<Typography variant="h4">Medium</Typography>           {/* 1.25rem */}
<Typography variant="h5">Small</Typography>            {/* 1rem */}
<Typography variant="h6">Extra Small</Typography>      {/* 0.875rem */}
```

#### Body Text
```tsx
<Typography variant="body1">
  Standard body text (1rem)
</Typography>
<Typography variant="body2" color="textSecondary">
  Secondary text (0.875rem, gray)
</Typography>
```

#### Special Text
```tsx
<Typography variant="overline">
  LABEL TEXT
</Typography>
<Typography variant="caption">
  Fine print
</Typography>
<Typography variant="button">
  Button-styled text
</Typography>
```

#### Gradient Text
```tsx
<Typography 
  className="gradient-text"
  variant="h3"
>
  Premium Quality
</Typography>
// Applies green gradient
```

---

### Utility Classes (CSS)

#### Animations
```tsx
<div className="fade-in">Fade in smoothly</div>
<div className="slide-in-up">Slide up with fade</div>
<div className="bounce">Bouncing animation</div>
<div className="spin">Rotating loader</div>
<div className="shimmer">Loading skeleton</div>
```

#### Flexbox Utilities
```tsx
<div className="flex-center">
  Centered content
</div>

<div className="flex-between">
  <span>Left</span>
  <span>Right</span>
</div>

<div className="flex-column gap-md">
  <div>Row 1</div>
  <div>Row 2</div>
</div>
```

#### Text Utilities
```tsx
<div className="text-truncate">
  Very long text that will be cut off with ellipsis...
</div>

<div className="text-ellipsis-2">
  Text that wraps to 2 lines maximum
</div>
```

#### Shadows
```tsx
<div className="shadow-sm">Light shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
<div className="shadow-green">Green tinted shadow</div>
```

#### Padding Utilities
```tsx
<div className="p-sm">0.5rem padding</div>
<div className="p-md">1rem padding</div>
<div className="p-lg">1.5rem padding</div>
```

---

## Custom Component Styling

### Using sx Prop
```tsx
<Box
  sx={{
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create(['box-shadow'], {
      duration: theme.transitions.duration.standard,
    }),
    '&:hover': {
      boxShadow: theme.shadows[4],
    }
  }}
>
  Styled Box
</Box>
```

### Using makeStyles (Deprecated but valid)
```tsx
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

function MyComponent() {
  const classes = useStyles();
  
  return (
    <div className={classes.container}>
      <button className={classes.button}>Click</button>
    </div>
  );
}
```

### Using useTheme Hook
```tsx
import { useTheme } from '@mui/material';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2),
    }}>
      Dynamic theme colors
    </div>
  );
}
```

---

## Responsive Design

### Grid System
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card>Content</Card>
  </Grid>
</Grid>
// xs: mobile (< 600px)
// sm: tablet (600px - 960px)
// md: desktop (960px - 1280px)
// lg: large (1280px+)
```

### Media Queries
```tsx
<Box
  sx={{
    fontSize: '2rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  }}
>
  Responsive text
</Box>
```

### Stack Component
```tsx
<Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
  <Button>Button 3</Button>
</Stack>
```

---

## Dark Mode

### Automatic Detection
Dark mode is automatically detected via `prefers-color-scheme: dark`. No code changes needed!

### Conditional Styling
```tsx
<Box
  sx={{
    backgroundColor: theme.palette.background.paper,
    // Automatically uses light/dark values based on mode
    color: theme.palette.text.primary,
  }}
>
  Content
</Box>
```

### Testing Dark Mode
In your browser DevTools:
1. Open Rendering settings (F12 → three dots → More tools → Rendering)
2. Scroll to "Emulate CSS media feature prefers-color-scheme"
3. Select "dark" or "light"

---

## Accessibility Best Practices

### Color Contrast
```tsx
// Good: Uses theme colors with proper contrast
<Typography color="primary">Link text</Typography>

// Avoid: Low contrast colors
<Typography sx={{ color: '#BBB' }}>Low contrast</Typography>
```

### ARIA Labels
```tsx
<IconButton
  aria-label="delete"
  onClick={handleDelete}
>
  <DeleteIcon />
</IconButton>
```

### Keyboard Navigation
```tsx
<Button
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleClick();
  }}
>
  Accessible button
</Button>
```

### Semantic HTML
```tsx
// Good: Use semantic components
<Button>Click me</Button>

// Avoid: Using div as button
<div onClick={handleClick}>Click me</div>
```

---

## Performance Tips

### Memoization
```tsx
import { memo } from 'react';

const MyCard = memo(function MyCard({ title, content }) {
  return (
    <Card>
      <CardContent>
        <Typography>{title}</Typography>
        {content}
      </CardContent>
    </Card>
  );
});

export default MyCard;
```

### Lazy Loading
```tsx
import { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Avoid Inline Objects
```tsx
// Good: Define outside render
const buttonSx = { marginTop: 2, marginBottom: 2 };

function MyComponent() {
  return <Button sx={buttonSx}>Click</Button>;
}

// Avoid: Create new object on each render
function MyComponent() {
  return <Button sx={{ mt: 2, mb: 2 }}>Click</Button>;
}
```

---

## Common Patterns

### Loading State
```tsx
const [loading, setLoading] = useState(false);

return (
  <Button
    onClick={async () => {
      setLoading(true);
      try {
        await handleAction();
      } finally {
        setLoading(false);
      }
    }}
    disabled={loading}
    endIcon={loading ? <CircularProgress size={20} /> : null}
  >
    {loading ? 'Loading...' : 'Click Me'}
  </Button>
);
```

### Form with Validation
```tsx
const [errors, setErrors] = useState({});

return (
  <Box component="form" sx={{ mt: 1 }}>
    <TextField
      error={Boolean(errors.email)}
      helperText={errors.email}
      label="Email"
      type="email"
      fullWidth
      margin="normal"
    />
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
      Submit
    </Button>
  </Box>
);
```

### Empty State
```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: 2,
  }}
>
  <EmptyIcon sx={{ fontSize: 48, color: 'action.disabled' }} />
  <Typography variant="h6" color="textSecondary">
    No data available
  </Typography>
  <Button variant="contained">Create New</Button>
</Box>
```

---

## Troubleshooting

### Colors Not Applying
1. Ensure ThemeProvider wraps your app (it does in main.tsx)
2. Use theme palette values, not hardcoded colors
3. Check for conflicting CSS in index.css
4. Clear browser cache and rebuild

### Dark Mode Not Working
1. Check system preferences for dark mode
2. Use DevTools to emulate dark mode
3. Verify colors are defined for dark mode palette
4. Check for hardcoded colors overriding theme

### Performance Issues
1. Profile with React DevTools
2. Memoize expensive components
3. Use lazy loading for heavy components
4. Avoid recreating objects in render
5. Check for unnecessary re-renders

---

## Resources

- Material-UI Docs: https://mui.com/material-ui/
- Design System: See COLOR_PALETTE_REFERENCE.md
- Theme Config: See src/main.tsx
- Global Styles: See src/index.css

---

**Version**: 1.0.0  
**Last Updated**: July 15, 2026  
**Status**: Ready for Development
