## Phase 11 - Resources Directory

Create a resources page with official reporting links by country.

### Tasks
- [ ] Build `/resources` page
- [ ] Add core country/region filtering (US, Canada, UK, EU, Australia, Global)
- [ ] Add scam-type filtering for common reporting paths
- [ ] Use official or authoritative reporting links only
- [ ] Structure resource data for future AI/RAG matching

### Resource Data Structure
```typescript
interface Resource {
  name: string;
  url: string;
  country: string;
  type: "reporting" | "information" | "support";
  scamTypes: string[];
}
```
