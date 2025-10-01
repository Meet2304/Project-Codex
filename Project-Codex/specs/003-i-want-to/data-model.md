# Data Model — 003-i-want-to

## Entities

### Person
- id (uuid, pk)
- name (text)
- tagline (text)
- bio (text)
- avatar_url (text, optional)

### Principle
- id (uuid, pk)
- title (text)
- summary (text)
- order_index (int)
- published (bool, default true)

### Project
- id (uuid, pk)
- title (text)
- slug (text, unique)
- summary (text)
- hero_media_url (text, optional)
- description (text)
- created_at (timestamp)
- updated_at (timestamp)
- published (bool, default true)

### Tag
- id (uuid, pk)
- name (text, unique)

### ProjectTag (junction)
- project_id (uuid, fk→Project.id)
- tag_id (uuid, fk→Tag.id)
- pk (project_id, tag_id)

### NavItem
- id (uuid, pk)
- label (text)
- path (text)
- order_index (int)
- visible (bool)

### ThemeConfig
- id (uuid, pk)
- default_mode (enum: 'dark' | 'light', default 'dark')
- gradient_from (#000000)
- gradient_to (#8B0000 or cherry-red)
- gradient_origin ('top-center')
- noise_opacity (float 0..1)

### SiteSettings
- id (uuid, pk)
- site_title (text)
- primary_cta_label (text, default 'Learn About Me')
- language (text, default 'en')
- updated_at (timestamp)

## Relationships
- Project M:N Tag via ProjectTag
- NavItem defines ordering of top-level navigation (desktop) and mapping to bottom tabs (mobile)

## Validation Rules
- Project.slug: lowercase kebab-case; unique
- Principle.order_index: dense ordering (0..N)
- NavItem.path: leading '/'; unique per item
- ThemeConfig values constrained to accessible contrast combinations
