# Style Tokens

## Primary Colors
| Name | Hex | Usage |
|---|---:|---|
| **Brand Red** | #E53935 | Primary accent; CTAs; highlights |
| **Brand Green** | #2E7D32 | Secondary accent; positive states; success indicators |
| **Brand Black** | #0B0B0B | Primary text; headings; UI chrome |
| **Pure White** | #FFFFFF | Backgrounds; reversed logo |

## Supporting Colors
| Name | Hex | Usage |
|---|---:|---|
| **Dark Gray** | #1F2933 | Secondary text; borders |
| **Light Gray** | #F5F7FA | Surfaces; cards; subtle backgrounds |
| **Muted Red** | #F8D7D6 | Alerts background; subtle emphasis |
| **Muted Green** | #E8F5E9 | Success backgrounds; badges |

## Accessibility Notes
- Use **Brand Red** only when contrast with background meets WCAG AA for text.  
- For small text on colored backgrounds, prefer **Brand Black** on light backgrounds or **Pure White** on dark backgrounds.  
- When using green + red together, ensure color-blind friendly indicators (icons, labels) accompany color.

---

# Typography

## Primary Typeface
**Inter** (preferred) or **Poppins** as fallback  
- **Headings** Inter Bold 700  
- **Subheadings** Inter SemiBold 600  
- **Body** Inter Regular 400  
- **UI / Mono** Inter Medium or JetBrains Mono for code snippets

## Scale
- **H1** 48px / 56px line-height  
- **H2** 36px / 44px line-height  
- **H3** 24px / 32px line-height  
- **Body** 16px / 24px line-height  
- **Small** 14px / 20px line-height

## CSS Tokens (example)
:root {
  --brand-red: #E53935;
  --brand-green: #2E7D32;
  --brand-black: #0B0B0B;
  --white: #FFFFFF;
  --muted-gray: #F5F7FA;
  --text-default: #1F2933;
  --radius-sm: 6px;
  --radius-md: 12px;
}
