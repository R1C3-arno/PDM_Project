# Component Usage Guide

Quick reference for using the refactored components in the PDM Project frontend.

## Table of Contents
- [Form Components](#form-components)
- [Dashboard Components](#dashboard-components)
- [Shared UI Components](#shared-ui-components)
- [Hooks](#hooks)
- [Validation](#validation)

---

## Form Components

### ApplicationStepper

Visual progress indicator for multi-step forms.

```typescript
import { ApplicationStepper } from '@/components/forms';
import { DollarSign, FileText, Check } from 'lucide-react';

const steps = [
  { number: 1, title: "Details", icon: DollarSign },
  { number: 2, title: "Personal Info", icon: FileText },
  { number: 3, title: "Review", icon: Check },
];

<ApplicationStepper steps={steps} currentStep={currentStep} />
```

### LoanDetailsStep

First step for collecting loan product and amount details.

```typescript
import { LoanDetailsStep } from '@/components/forms';

<LoanDetailsStep
  formData={formData}
  products={products}
  selectedProduct={selectedProduct}
  onFieldChange={(name, value) => updateField(name, value)}
/>
```

### PersonalInfoStep

Second step for collecting employment and income information.

```typescript
import { PersonalInfoStep } from '@/components/forms';

<PersonalInfoStep
  formData={formData}
  onFieldChange={(name, value) => updateField(name, value)}
/>
```

### ReviewStep

Final review step before submission.

```typescript
import { ReviewStep } from '@/components/forms';

<ReviewStep
  formData={formData}
  selectedProduct={selectedProduct}
/>
```

### EMICalculator

Payment estimation sidebar component.

```typescript
import { EMICalculator } from '@/components/forms';

<EMICalculator calculation={emiCalculation} />
```

---

## Dashboard Components

### DashboardHeader

Welcome header with primary CTA.

```typescript
import { DashboardHeader } from '@/components/dashboard';

<DashboardHeader
  userName="John Doe"
  onNewApplication={() => router.push('/applications/new')}
/>
```

### StatsCards

Statistics overview grid.

```typescript
import { StatsCards } from '@/components/dashboard';

const stats = {
  totalApplications: 12,
  activeLoans: 3,
  pendingApplications: 2,
  totalDisbursed: 150000,
};

<StatsCards stats={stats} />
```

### RecentApplications

List of recent applications with empty state.

```typescript
import { RecentApplications } from '@/components/dashboard';

<RecentApplications
  applications={applications}
  maxDisplayed={5}
/>
```

---

## Shared UI Components

### Card

Versatile card container for content.

```typescript
import { Card } from '@/components/ui';

// Basic card
<Card padding="md">
  Content here
</Card>

// Card with title and actions
<Card
  title="Card Title"
  subtitle="Optional description"
  actions={<Button>Action</Button>}
  padding="lg"
>
  Content here
</Card>

// Hoverable card with click handler
<Card
  hoverable
  onClick={() => navigate('/details')}
>
  Clickable content
</Card>
```

**Props:**
- `title?: string` - Header title
- `subtitle?: string` - Header subtitle
- `actions?: ReactNode` - Header action buttons
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Padding size
- `hoverable?: boolean` - Add hover effects
- `onClick?: () => void` - Click handler

### Button

Standardized button with multiple variants.

```typescript
import { Button } from '@/components/ui';
import { Plus, ArrowRight } from 'lucide-react';

// Primary button with icon
<Button
  variant="primary"
  size="lg"
  icon={<Plus size={20} />}
  onClick={handleClick}
>
  Create New
</Button>

// Loading state
<Button
  variant="primary"
  loading={isSubmitting}
  disabled={!isValid}
>
  Submit
</Button>

// With right icon
<Button
  variant="secondary"
  iconRight={<ArrowRight size={16} />}
>
  Next
</Button>

// Full width
<Button variant="primary" fullWidth>
  Continue
</Button>
```

**Variants:** `primary | secondary | outline | danger | ghost`
**Sizes:** `sm | md | lg`

### Input

Form input with label, validation, and icons.

```typescript
import { Input } from '@/components/ui';
import { Mail, Lock } from 'lucide-react';

// Basic input with label
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  required
  fullWidth
/>

// With icon and error
<Input
  label="Password"
  type="password"
  icon={<Lock size={20} />}
  error={errors.password}
  required
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username"
  fullWidth
/>
```

**Props:**
- `label?: string` - Field label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `icon?: ReactNode` - Left icon
- `iconRight?: ReactNode` - Right icon
- `required?: boolean` - Show asterisk
- `fullWidth?: boolean` - Full width

### Badge

Status and label badges.

```typescript
import { Badge } from '@/components/ui';
import { Check } from 'lucide-react';

// Basic badge
<Badge variant="success">Active</Badge>

// With icon
<Badge
  variant="primary"
  size="lg"
  icon={<Check size={16} />}
>
  Verified
</Badge>

// All variants
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

**Variants:** `default | primary | success | warning | error | info`
**Sizes:** `sm | md | lg`

---

## Hooks

### useApplicationForm

Manages application form state and logic.

```typescript
import { useApplicationForm } from '@/hooks/useApplicationForm';

const {
  currentStep,          // Current step number (1-3)
  formData,            // Form field values
  emiCalculation,      // EMI breakdown
  selectedProduct,     // Currently selected product
  updateField,         // Update single field
  validateStep,        // Validate current step
  nextStep,           // Go to next step
  previousStep,       // Go to previous step
} = useApplicationForm(products);

// Update a field
updateField('requestedAmount', '50000');

// Check if step is valid
const isValid = validateStep(1);

// Navigate
if (isValid) {
  nextStep();
}
```

**Form Data Interface:**
```typescript
interface ApplicationFormData {
  productId: string;
  requestedAmount: string;
  requestedTermMonths: string;
  purpose: string;
  employmentType: string;
  monthlyIncome: string;
  existingDebt: string;
}
```

**EMI Calculation Interface:**
```typescript
interface EMICalculation {
  emi: number;           // Monthly payment
  totalPayment: number;  // Total to be paid
  totalInterest: number; // Total interest
}
```

---

## Validation

### Application Validation Functions

```typescript
import {
  validateLoanAmount,
  validateLoanTerm,
  validateMonthlyIncome,
  validatePurpose,
  validateFormStep,
} from '@/lib/validation/applicationValidation';

// Validate individual fields
const amountError = validateLoanAmount('50000', selectedProduct);
const termError = validateLoanTerm('36', selectedProduct);
const incomeError = validateMonthlyIncome('5000');
const purposeError = validatePurpose('Home renovation');

// Validate entire step
const { isValid, errors } = validateFormStep(1, formData, selectedProduct);

if (!isValid) {
  console.log(errors); // { requestedAmount: 'Error message', ... }
}
```

---

## Common Patterns

### Creating a New Form Step

1. Create component in `/components/forms/YourStep.tsx`:

```typescript
import React from 'react';
import { OlavsCard } from '@/components/OlavsCard';
import { ApplicationFormData } from '@/hooks/useApplicationForm';

interface YourStepProps {
  formData: ApplicationFormData;
  onFieldChange: (name: keyof ApplicationFormData, value: string) => void;
}

export const YourStep: React.FC<YourStepProps> = ({
  formData,
  onFieldChange,
}) => {
  return (
    <OlavsCard elevation="level1">
      <h2>Your Step Title</h2>
      {/* Your form fields */}
    </OlavsCard>
  );
};
```

2. Add to the stepper configuration
3. Add validation logic to `/lib/validation/applicationValidation.ts`

### Creating a Dashboard Widget

1. Create component in `/components/dashboard/YourWidget.tsx`:

```typescript
import React from 'react';
import { OlavsCard } from '@/components/OlavsCard';

interface YourWidgetProps {
  data: YourDataType;
}

export const YourWidget: React.FC<YourWidgetProps> = ({ data }) => {
  return (
    <OlavsCard
      title="Widget Title"
      elevation="level1"
    >
      {/* Your widget content */}
    </OlavsCard>
  );
};
```

2. Export from `/components/dashboard/index.ts`
3. Use in dashboard page

---

## Import Shortcuts

Use barrel exports for cleaner imports:

```typescript
// Instead of:
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Use:
import { Card, Button, Input } from '@/components/ui';

// Similarly for forms and dashboard:
import { LoanDetailsStep, PersonalInfoStep } from '@/components/forms';
import { StatsCards, RecentApplications } from '@/components/dashboard';
```

---

## TypeScript Tips

1. **Always export interfaces** used in props
2. **Use explicit return types** for complex functions
3. **Avoid `any`** - use proper types or `unknown`
4. **Leverage type inference** for simple cases

```typescript
// Good
interface MyProps {
  title: string;
  count: number;
}

export const MyComponent: React.FC<MyProps> = ({ title, count }) => {
  return <div>{title}: {count}</div>;
};

// Also Good (type inference)
export const MyComponent = ({ title, count }: MyProps) => {
  return <div>{title}: {count}</div>;
};
```

---

## Styling Guidelines

1. Use the OLAVS design system tokens
2. Keep inline styles for component-specific styling
3. Use Tailwind for utility classes in shared UI components

```typescript
// OLAVS Design System
import { olavsDesign } from '@/lib/olavs-design-system';

<div style={{
  padding: olavsDesign.spacing[16],
  color: olavsDesign.colors.neutral[900],
  fontSize: olavsDesign.typography.scale.bodyM.size,
}}>
  Content
</div>

// Tailwind (for shared UI components)
<div className="flex items-center gap-2 p-4 rounded-lg">
  Content
</div>
```

---

## Questions?

Refer to:
- **REFACTORING_SUMMARY.md** - Complete refactoring details
- **Component files** - All components have JSDoc comments
- **Type definitions** - Check exported interfaces for usage
