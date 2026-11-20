# Project rules
- Scope homepage animation styles beneath `.home-motion` and use section classes for choreography so shared storefront components retain their behavior elsewhere.
- Honor `prefers-reduced-motion` for all homepage effects and animate transforms/opacity rather than dimensions to prevent layout shifts.
- Keep reusable elastic interaction styles in the global stylesheet using independent scale/translate, with eased opacity and reduced-motion overrides, so animations never replace layout transforms.
