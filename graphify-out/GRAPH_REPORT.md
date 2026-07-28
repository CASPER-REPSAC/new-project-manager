# Graph Report - C:/Users/Admin/Desktop/new-project-manager  (2026-07-28)

## Corpus Check
- Corpus is ~8,927 words - fits in a single context window. You may not need a graph.

## Summary
- 46 nodes · 84 edges · 5 communities
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Knowledge Collaboration and Integration
- Brand Design Principles
- Project Showcase Experience
- Delivery Architecture and Foundation
- Requirements and Database Core

## God Nodes (most connected - your core abstractions)
1. `Functional Requirements` - 15 edges
2. `AI-assisted Development WBS` - 13 edges
3. `Page Specification` - 11 edges
4. `Imweb Design System` - 9 edges
5. `Knowledge Management and Document Structure` - 6 edges
6. `Real-time Collaboration and Permissions` - 6 edges
7. `Phase 4 Project Manager, Showcase, and PDF Viewer` - 6 edges
8. `Project Discovery, Search, and Filtering` - 5 edges
9. `Import, Export, and Webhooks` - 5 edges
10. `Project Detail Page` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Component-centered Reuse Strategy` --semantically_similar_to--> `Responsive Component System`  [INFERRED] [semantically similar]
  docs/wbs.md → DESIGN.md
- `Page Specification` --conceptually_related_to--> `Imweb Design System`  [INFERRED]
  docs/page_description.md → DESIGN.md
- `Project Manager Modernization` --conceptually_related_to--> `Functional Requirements`  [INFERRED]
  README.md → docs/requirements.md
- `Project Registration and Edit Page` --implements--> `Block Markdown Editor and Page Engine`  [INFERRED]
  docs/page_description.md → docs/requirements.md
- `Page Specification` --references--> `Functional Requirements`  [EXTRACTED]
  docs/page_description.md → docs/requirements.md

## Hyperedges (group relationships)
- **Project Manager Feature Surface** — docs_requirements_project_registration, docs_requirements_project_discovery, docs_requirements_pdf_viewer, docs_requirements_project_qa, docs_requirements_project_space_integration, docs_page_description_project_list_page, docs_page_description_project_detail_page, docs_page_description_project_edit_page, docs_wbs_phase_4_project_showcase [INFERRED 0.95]
- **Notion-like Markdown Platform** — docs_requirements_block_editor, docs_requirements_database_views, docs_requirements_knowledge_management, docs_requirements_collaboration_permissions, docs_page_description_markdown_sidebar, docs_page_description_markdown_editor, docs_page_description_database_view_page, docs_page_description_system_admin_pages, docs_wbs_phase_2_editor_collaboration, docs_wbs_phase_3_database_views, docs_wbs_phase_5_knowledge_integration_qa [INFERRED 0.85]
- **Delivery Architecture Principles** — docs_wbs_vertical_slice_delivery, docs_wbs_definition_of_done, docs_wbs_open_source_core_strategy, docs_wbs_component_reuse_strategy, docs_wbs_ssot_codegen_strategy [EXTRACTED 1.00]

## Communities (5 total, 0 thin omitted)

### Community 0 - "Knowledge Collaboration and Integration"
Cohesion: 0.31
Nodes (11): Markdown Page Editor, Markdown Space Sidebar, Project List Page, Management and System Settings Pages, Block Markdown Editor and Page Engine, Real-time Collaboration and Permissions, Import, Export, and Webhooks, Knowledge Management and Document Structure (+3 more)

### Community 1 - "Brand Design Principles"
Cohesion: 0.20
Nodes (10): Action and Identity Color Separation, Customer Brand as Hero, Flat Visual Hierarchy System, Imweb Blog Voice Source, Imweb Design System, Imweb Homepage, Imweb Pricing Surface, Responsive Component System (+2 more)

### Community 2 - "Project Showcase Experience"
Cohesion: 0.33
Nodes (10): Author Project Collection Page, Global Header and Navigation, Page Specification, Project Detail Page, Project Registration and Edit Page, Project Detail and PDF Viewer, Project Q&A and Comment Interaction, Project Registration and Metadata (+2 more)

### Community 3 - "Delivery Architecture and Foundation"
Cohesion: 0.29
Nodes (8): SSO Authentication, AI-assisted Development WBS, Codex and Claude Role Division, Development Definition of Done, Open-source Core Integration Strategy, Phase 1 Infrastructure and Workspace, Declarative Schema and Code Generation Strategy, Domain-based Vertical Slice Delivery

### Community 4 - "Requirements and Database Core"
Cohesion: 0.29
Nodes (7): Full-page Database View, Notion-like Database and Multiple Views, Functional Requirements, Phase 0 Foundation and Architecture, Phase 3 Database and Multiple Views, New Project Manager, Project Manager Modernization

## Knowledge Gaps
- **5 isolated node(s):** `Imweb Homepage`, `Imweb Pricing Surface`, `Imweb Blog Voice Source`, `New Project Manager`, `Codex and Claude Role Division`
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Functional Requirements` connect `Requirements and Database Core` to `Knowledge Collaboration and Integration`, `Project Showcase Experience`, `Delivery Architecture and Foundation`?**
  _High betweenness centrality (0.398) - this node is a cross-community bridge._
- **Why does `Page Specification` connect `Project Showcase Experience` to `Knowledge Collaboration and Integration`, `Brand Design Principles`, `Requirements and Database Core`?**
  _High betweenness centrality (0.378) - this node is a cross-community bridge._
- **Why does `Imweb Design System` connect `Brand Design Principles` to `Project Showcase Experience`?**
  _High betweenness centrality (0.310) - this node is a cross-community bridge._
- **What connects `Imweb Homepage`, `Imweb Pricing Surface`, `Imweb Blog Voice Source` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
