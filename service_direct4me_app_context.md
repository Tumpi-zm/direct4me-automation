# service.direct4.me App Context

This document describes the observed Direct4me Service Portal application from the manual QA exploration performed with the provided QA accounts. It is intended as a project-context file for use in a CLI/AI-assisted project folder.

The description is based on screenshots and observed behavior only. Some downstream flows could not be completed because work order creation was blocked by a backend authorization error.

---

## 1. Application overview

**Application URL:** `https://service.direct4.me`

**Application name shown in browser/app UI:** Direct4me Service Portal

**Primary purpose observed:** Internal/partner service portal for managing locker installation, maintenance, annual preventive visits, and maintainer work execution.

**Main domain objects observed:**

- Work orders
- Sites
- Lockers
- Companies
- Annual preventive visits
- Maintainers / assignees
- Organizations

**Main work order lifecycle from the assignment brief:**

1. Ops creates a work order.
2. Ops plans it.
3. Ops assigns it to an organization and optionally a specific maintainer.
4. Planned stops can be reordered and route behavior should stay in sync.
5. Maintainer carries out the work.
6. Maintainer submits the work for review.
7. Ops reviews the work.
8. Ops closes the work order.
9. Closed work orders should not be editable anymore.

**Important limitation from testing:**

The full lifecycle could not be completed because all tested work order creation paths failed with a backend `403 Forbidden` response: `new row violates row-level security policy for table "work_orders"`.

---

## 2. Users and roles observed

### 2.1 Ops user

**Email:** `ziga.ops@direct4.me`

**Password used during testing:** Provided in assignment email.

**Role implied by UI and assignment:** Ops / operational planner / reviewer.

**Observed access after login:**

- Dashboard
- Work Orders
- Sites
- Lockers
- Annual Visits
- Settings
- Log out

**Observed capabilities in UI:**

- View operational dashboard.
- Open Work Orders page.
- Open work order creation modal.
- Access work order tabs.
- Access Sites list.
- Access Lockers list.
- Access Annual Preventive page.
- Update annual preventive due date.
- Attempt annual preventive work order creation.
- Attempt standard work order creation.
- Export button is visible on Work Orders page.

**Important observed issue:**

Although the ops user can access work order creation UI, backend rejects creating work orders due to row-level security policy.

### 2.2 Maintainer user

**Email:** `ziga.maintainer@direct4.me`

**Password used during testing:** Provided in assignment email.

**Role implied by UI and assignment:** Maintainer / field worker.

**Observed access after login:**

- My Work page only.
- Logout icon in top-right area.

**Observed My Work state:**

- Header: `My Work`
- Subtitle/state text: `All caught up!`
- Tabs/buttons: `Today`, `Tomorrow`, `This Week`
- Section: `COMPLETED (0)`
- Empty-state icon with text: `No tasks right now`
- Empty-state supporting text: `When work orders are assigned to you, they'll appear here.`

**Important limitation:**

No assigned work orders were visible because ops work order creation failed. Maintainer execution, submit-for-review, pause, complete, and close-related flows could not be tested.

---

## 3. Login page

### 3.1 URL

`https://service.direct4.me/login`

### 3.2 Visual layout

The login page has a dark background with Direct4me branding in the center-left area and a teal locker-like illustration on the lower-right.

### 3.3 Login form elements

**Logo/text:** `Direct4me...`

**Subtext:** `Contact your administrator to get access.`

**Fields:**

- `Email address`
- `Password`

**Password field controls:**

- Eye icon for showing/hiding password.
- `Forgot password?` link next to password label area.

**Main button:**

- `Sign in`

### 3.4 Observed login behavior

- Ops user logs in successfully and is redirected to `/dashboard`.
- Maintainer user logs in successfully and is redirected to `/my-work`.

---

## 4. Ops layout and navigation

After ops login, the application displays a left sidebar and main content area.

### 4.1 Sidebar branding

Top-left logo/text:

- `Direct4me...`

There is also a small collapse/back-style chevron near the top of the sidebar.

### 4.2 Sidebar navigation items

Observed sidebar items for ops:

1. `Dashboard`
2. `Work Orders`
3. `Sites`
4. `Lockers`
5. `Annual Visits`
6. `Settings`
7. `Log out`

### 4.3 Active navigation styling

The active page is highlighted in the sidebar with darker/teal styling and a relevant icon.

### 4.4 Settings page

Settings was visible in the sidebar but was not tested because it was not part of the work order lifecycle assignment scope.

---

## 5. Dashboard page

### 5.1 URL

`https://service.direct4.me/dashboard`

### 5.2 Page title and subtitle

**Title:** `Dashboard`

**Subtitle:** `Operational command center`

### 5.3 Primary button

Top-right button:

- `+ New Work Order`

Behavior:

- Redirects/open context to Work Orders page and opens the `Create Work Order` modal.
- Same modal appears when pressing `New Work Order` on the Work Orders page.

### 5.4 Dashboard metric cards

The dashboard displays five top cards:

#### 5.4.1 Needs Planning

**Title:** `Needs Planning`

**Subtitle:** `Missing date or maintainer`

**Observed count:** `0`

**Observed click behavior:** Opens Work Orders page on the `Triage` tab.

#### 5.4.2 Overdue Open

**Title:** `Overdue Open`

**Subtitle:** `Past planned date`

**Observed count:** `0`

**Observed click behavior:** Opens Work Orders page on the `Triage` tab, same as Needs Planning.

#### 5.4.3 Blocked (Paused)

**Title:** `Blocked (Paused)`

**Subtitle:** `Maintenance paused`

**Observed count:** `0`

**Observed click behavior:** Opens Work Orders page on the `Paused` tab.

#### 5.4.4 Needs Review

**Title:** `Needs Review`

**Subtitle:** `Awaiting approval`

**Observed count:** `0`

**Observed click behavior:** Opens Work Orders page on the `Awaiting Review` tab.

#### 5.4.5 Annual Preventive Due

**Title:** `Annual Preventive Due`

**Subtitle:** `Due within 30 days`

**Observed count:** `0`

**Observed click behavior:** Opens Annual Preventive / Annual Visits page.

### 5.5 Dashboard panels

#### 5.5.1 Attention Queue

**Panel title:** `Attention Queue`

**Observed empty-state text:** `All clear — nothing needs attention.`

#### 5.5.2 Today's Pulse

**Panel title:** `Today's Pulse`

**Observed text:**

- `Nothing planned for today.`
- `No maintainer activity for today.`

---

## 6. Work Orders page

### 6.1 URL examples observed

- `https://service.direct4.me/work-orders`
- `https://service.direct4.me/work-orders?tab=triage`
- `https://service.direct4.me/work-orders?tab=maintenance_paused`
- `https://service.direct4.me/work-orders?tab=maintenance_done`

### 6.2 Page title and subtitle

**Title:** `Work Orders`

**Subtitle:** `Manage maintenance work orders`

### 6.3 Top-right actions

- `Export`
- `+ New Work Order`

### 6.4 Work order tabs

Observed tabs:

1. `All`
2. `Triage`
3. `Plan`
4. `In Progress`
5. `Paused`
6. `Awaiting Review`
7. `Completed`

### 6.5 Filters and view controls

Observed controls on Work Orders page:

- Search field: `Search work orders`
- Priority dropdown: `All Priorities`
- Date dropdown: `All dates`
- Rows dropdown: `10 rows`
- List/Map view toggle:
  - `List`
  - `Map`

Some tabs show slightly different columns and controls.

### 6.6 Work Orders table on All tab

Observed columns on the `All` tab:

- `Work Order`
- `Site`
- `Company`
- `Type`
- `Priority`
- `Status`
- `Planned Date`

Observed empty state:

- `No work orders found`

### 6.7 Work Orders table on Triage tab

Observed columns on the `Triage` tab:

- Selection checkbox column
- `Work Order`
- `Priority`
- `Assignee`
- `Site`
- `Date`
- `Service time`

Observed empty state:

- `No work orders found`

### 6.8 Work Orders table on Paused tab

Observed columns on the `Paused` tab:

- `Work Order`
- `Site`
- `Priority`
- `Assigned`
- `Reason`
- `Paused`

Observed empty state:

- `No work orders found`

### 6.9 Work Orders table on Awaiting Review tab

Observed columns on the `Awaiting Review` tab:

- `Work Order`
- `Site`
- `Company`
- `Type`
- `Priority`
- `Status`
- `Assignee`
- `Date`

Observed empty state:

- `No work orders found`

### 6.10 Export button

An `Export` button exists on the Work Orders page. It was visible but not tested in detail.

### 6.11 List/Map toggle

A `List` and `Map` toggle is visible in relevant Work Orders tabs. `List` was active during testing. Map behavior was not tested because there were no work orders created.

---

## 7. Create Work Order modal

### 7.1 Entry points

The Create Work Order modal opens from:

- Dashboard page `+ New Work Order` button.
- Work Orders page `+ New Work Order` button.

### 7.2 Modal title

**Title:** `Create Work Order`

### 7.3 Close control

Top-right `X` closes the modal.

### 7.4 Step indicator

The modal uses a horizontal numbered stepper.

Observed behavior:

- `Locker Work` flow has 4 steps.
- `Razvoj` flow appears to use the same/similar 4-step flow as `Locker Work`.
- `Internal Task` flow has 3 steps.

### 7.5 Navigation buttons inside modal

Observed buttons:

- `Back`
- `Next`
- `Create Work Order`

`Back` is disabled on the first step.

---

## 8. Create Work Order flow: Work Scope = Locker Work

### 8.1 Step 1 of 4: Location

**Step label:** `Step 1 of 4: Location`

#### Fields and controls

##### Work Scope dropdown

**Label:** `Work Scope`

Default selected value:

- `Locker Work`

Observed dropdown values:

1. `Locker Work`
2. `Internal Task`
3. `Razvoj`

When `Locker Work` is selected, helper text appears:

- `Client and locker-related field work.`

##### Company dropdown

Placeholder:

- `Select company`

Observed company option:

- `Express One SI d.o.o.`

##### Site search field

Placeholder:

- `Search by name, address, or city...`

##### Site filter dropdown

Observed selected/placeholder value:

- `Site`

##### Initial site-load empty state

Before selecting company:

- `Select a company to load sites`

##### Site list after company selection

After selecting `Express One SI d.o.o.`, sites load as cards/list items.

Observed first sites:

1. `(ne dostavljaj) Izobraževanje / onboarding Komenda`
   - Address: `Pod hrasti 7, Žeje pri Komendi, Slovenia`
   - Company: `Express One SI d.o.o.`
   - Locker count: `1 lockers`
2. `Ajdovščina AMZS`
   - Address: `Goriška cesta 75, Ajdovščina, Slovenia`
   - Company: `Express One SI d.o.o.`
   - Locker count: `1 lockers` in creation modal, but Sites page later shows 2 lockers for the site. This could indicate different filtering/status context.
3. `Apolon`
   - Address: `Kramarjeva ulica 1, Maribor, Slovenia`

Observed pagination text:

- `Showing 1–50 of 263 sites`

Observed pagination buttons:

- `Previous`
- `Next`

Step 1 bottom buttons:

- `Back`
- `Next`

### 8.2 Step 2 of 4: Lockers

**Step label:** `Step 2 of 4: Lockers`

Helper text:

- `Optionally select specific lockers for this work order, or leave empty for site-level work.`

Observed locker item:

- `BOX-18875`
- `Status: Enabled`

There is a checkbox for selecting the locker.

When selected, the UI shows:

- `1 locker selected`

Buttons:

- `Back`
- `Next`

### 8.3 Step 3 of 4: Details

**Step label:** `Step 3 of 4: Details`

#### Type dropdown

**Label:** `Type`

Default/initial observed value:

- `Preventive Maintenance`

Observed options:

1. `Preventive Maintenance`
2. `Incident / Repair`
3. `Installation`
4. `Decommission`
5. `Other`

#### Priority dropdown

**Label:** `Priority`

Default observed value:

- `Medium`

Observed options:

1. `Low`
2. `Medium`
3. `High`

#### Planned Date field

**Label:** `Planned Date`

Placeholder:

- `Pick a date`

Calendar picker observed:

- Shows month/year header, e.g. `May 2026`.
- Has previous/next month arrow buttons.
- Shows weekday header `Su Mo Tu We Th Fr Sa`.
- Allows selecting a date.

Observed selected planned date in one test:

- `May 31st, 2026`

#### Description field

**Label:** `Description (optional)`

Placeholder:

- `Internal notes for the maintainer...`

Observed test value:

- `QA Testing`

#### Reference Photos section

**Label:** `Reference Photos`

Helper text:

- `Photos to help the maintainer (e.g. microlocation, existing damage).`

Button:

- `Add Photo`

Observed behavior:

- A photo can be attached and previewed as a thumbnail.
- Thumbnail has an `X` delete/remove icon.

Buttons:

- `Back`
- `Next`

### 8.4 Step 4 of 4: Assignment

**Step label:** `Step 4 of 4: Assignment`

#### Assigned Organization dropdown

**Label:** `Assigned Organization *`

Placeholder:

- `Select organization`

Observed option:

- `QA (partner)`

This field is required.

#### Assigned User dropdown

**Label:** `Assigned User (optional)`

Initial placeholder before organization selected:

- `Select organization first`

Behavior:

- Field is disabled until Assigned Organization is selected.

Placeholder after organization selected:

- `Select user (optional)`

Observed dropdown values:

1. `Any maintainer`
2. `Žiga Maintainer`
3. `Žiga Ops`

Helper text:

- `If no user is selected, any maintainer from the organization can execute this work order.`

#### Additional Assignees section

Appears after specific assigned user selected.

**Label:** `Additional Assignees (optional)`

Observed checkbox option:

- `Žiga Ops`

Helper text:

- `Additional assignees can see and work on this work order equally.`

#### Summary box

The summary box displays selected values.

Observed example summary:

- `Scope: Locker`
- `Site: (ne dostavljaj) Izobraževanje / onboarding Komenda`
- `Lockers: 1 selected`
- `Type: Installation`
- `Priority: High`
- `Planned: May 31st, 2026`

#### Final button

- `Create Work Order`

### 8.5 Observed create failure for Locker Work

On clicking `Create Work Order`, the UI shows a toast:

- `Failed to create work order`

Browser DevTools showed:

- Request method: `POST`
- Status code: `403 Forbidden`
- Response code: `42501`
- Message: `new row violates row-level security policy for table "work_orders"`

This blocks creation.

---

## 9. Create Work Order flow: Work Scope = Internal Task

### 9.1 Flow difference

`Internal Task` uses 3 steps instead of 4 steps.

Likely reason: there is no site/locker selection step. The user manually defines an internal destination/task instead.

### 9.2 Step 1 of 3: Location

**Step label:** `Step 1 of 3: Location`

#### Work Scope dropdown

Selected value:

- `Internal Task`

Helper text:

- `One-off internal destinations like service visits or store runs.`

#### Task field

**Label:** `Task *`

Observed value entered:

- `Test vehicle`

This field is required.

#### Address field

**Label:** `Address *`

Observed value entered:

- `Test Address 19, 3330 Test City`

Helper text:

- `Pick a suggestion to autofill coordinates for routing. You can still enter a custom address manually.`

Buttons:

- `Back`
- `Next`

### 9.3 Step 2 of 3: Details

This is similar to Locker Work Step 3 details.

**Step label:** `Step 2 of 3: Details`

#### Type dropdown

Observed options:

1. `Vehicle Service`
2. `Procurement / Store Run`
3. `Pickup / Dropoff`
4. `Other Internal Task`

Observed selected examples:

- `Vehicle Service`
- `Procurement / Store Run`
- `Pickup / Dropoff`

#### Priority dropdown

Observed options:

1. `Low`
2. `Medium`
3. `High`

#### Planned Date

Same date picker behavior as Locker Work.

#### Description field

**Label:** `Description (optional)`

Placeholder:

- `Internal notes for the maintainer...`

Observed test value:

- `QA Test`

#### Reference Photos

Same `Add Photo` area as Locker Work.

Buttons:

- `Back`
- `Next`

### 9.4 Step 3 of 3: Assignment

This is similar to Locker Work Step 4 assignment.

**Step label:** `Step 3 of 3: Assignment`

Fields:

- `Assigned Organization *`
- `Assigned User (optional)`
- `Additional Assignees (optional)`

Observed organization:

- `QA (partner)`

Observed assigned user:

- `Žiga Maintainer`

Observed additional assignee option:

- `Žiga Ops`

Observed summary example:

- `Scope: Internal`
- `Destination: Test vehicle, Test Address 19, 3330 Test City`
- `Type: Procurement / Store Run`
- `Priority: High`
- `Planned: May 31st, 2026`

### 9.5 Address coordinate warning

When manually entering an address that is not selected from a suggestion, a warning/toast appears during create attempt:

- `Address saved without coordinates. Route optimization will be unavailable until coordinates are added.`

Observed interpretation:

- The app allows or attempts to allow manual addresses without coordinates.
- This may degrade routing/route optimization.

### 9.6 Observed create failure for Internal Task

On clicking `Create Work Order`, the UI shows failure and DevTools shows the same backend error:

- `403 Forbidden`
- `new row violates row-level security policy for table "work_orders"`

---

## 10. Create Work Order flow: Work Scope = Razvoj

### 10.1 Observed availability

`Razvoj` appears in the `Work Scope` dropdown together with:

- `Locker Work`
- `Internal Task`

### 10.2 Observed behavior

The user noted that `Razvoj` appears to use the same flow as `Locker Work`.

### 10.3 Potential concern

`Razvoj` is Slovenian for development. It may be a development/internal option and may not be intended for a production-facing ops workflow. This was not tested in depth.

---

## 11. Annual Preventive / Annual Visits page

### 11.1 URL

`https://service.direct4.me/annual-preventive`

Sidebar label:

- `Annual Visits`

Page title:

- `Annual Preventive`

Subtitle:

- `Track yearly site visits, due dates, and annual work orders across selected companies.`

Observed counts:

- `259 sites · 300 lockers`

### 11.2 Search and filters

#### Search field

Placeholder:

- `Search company, site, code, or address...`

#### Company dropdown

Default:

- `All companies`

Observed options:

1. `All companies`
2. `Express One SI d.o.o.`

#### Row-count dropdown

Default:

- `10 rows`

Observed options:

1. `10 rows`
2. `50 rows`
3. `100 rows`

### 11.3 Status tabs/counters

Observed tabs/counters:

1. `All`
2. `Needs setup 257`
3. `Overdue 0` initially, later `Overdue 1` after due date update
4. `Due soon 0`
5. `Scheduled 0`
6. `Up to date 2` initially, later `Up to date 1` after due date update

### 11.4 Annual Preventive table columns

Observed columns:

- Expand/caret column
- `Company`
- `Site`
- `Lockers`
- `Next Due`
- `Status`
- `Work Order`
- `Actions`

### 11.5 Observed rows

Example rows visible:

#### Row: Ajdovščina AMZS

- Company: `Express One SI d.o.o.`
- Country/subtext: `Slovenia`
- Site: `Ajdovščina AMZS`
- Address: `Goriška cesta 75, Ajdovščina`
- Lockers: `1`
- Initial Next Due: `Mar 31, 2027`
- Initial Status: `Up to date`
- Work Order: `—`
- Actions:
  - `Update due date`
  - `Create WO`

After updating due date:

- Next Due: `Mar 2, 2025`
- Status: `Overdue`
- Toast: `Due date updated`
- Counters updated: Overdue increased to 1, Up to date decreased to 1.

#### Row: (ne dostavljaj) Izobraževanje / onboarding Komenda

- Company: `Express One SI d.o.o.`
- Country/subtext: `Slovenia`
- Site: `(ne dostavljaj) Izobraževanje / onboarding Komenda`
- Address: `Pod hrasti 7, Žeje pri Komendi`
- Lockers: `1`
- Next Due: `Apr 30, 2027`
- Status: `Up to date`
- Work Order: `—`
- Actions:
  - `Update due date`
  - `Create WO`

#### Rows with Needs setup status

Examples:

- `Apolon`
- `Armaforce`
- `Avtek`
- `Avtopralnica Hartman Leon`
- `Avtoservis Mele`
- `Bar Ančka`
- `Bar Cona`

For these rows:

- Next Due: `Set first due date`
- Status: `Needs setup`
- Actions:
  - `Set due date`
  - `Create WO` appears disabled/light blue until due date is set.

### 11.6 Update due date modal

Opened by clicking `Update due date`.

**Modal title:** `Update due date`

Helper text:

- `Update the annual deadline for this site. The cycle applies to all active lockers at the site.`

Site card example:

- Company: `Express One SI d.o.o.`
- Site: `Ajdovščina AMZS`
- Active lockers: `1 active locker`
- Badge: `Up to date`

Field:

- `Due date`

Observed date value:

- `Sun, Mar 2, 2025`

Buttons:

- `Cancel`
- `Save`

Observed success behavior:

- Toast: `Due date updated`
- Row status recalculated from `Up to date` to `Overdue` when the due date was set in the past.

### 11.7 Create Annual Preventive Work Order modal

Opened by clicking `Create WO` on an Annual Preventive row.

**Modal title:** `Create Annual Preventive Work Order`

Subtitle/helper text:

- `Create a site-level preventive work order and preload all active lockers for this site.`

Top site card example:

- Company: `Express One SI d.o.o.`
- Site: `Ajdovščina AMZS`
- `1 active locker on this site`
- Badge: `Annual preventive`

#### Fields

##### Planned date

Observed value:

- `Sun, Mar 2, 2025`

##### Organization dropdown

Initial value:

- `No organization`

Observed selected value:

- `QA`

##### Maintainer dropdown

Initial value:

- `Any available`

Observed selected value:

- `Žiga Maintainer`

Helper text after selecting maintainer:

- `Assigned maintainer will be Žiga Maintainer`

##### Description field

Observed value:

- `QA Test`

##### Locker preload section

Section title:

- `Locker preload`

Helper text:

- `1 active locker will be linked to the work order.`

Observed locker value:

- `272400005286`

Status shown:

- `active`

#### Buttons

- `Cancel`
- `Create Work Order`

### 11.8 Observed create failure for Annual Preventive Work Order

After clicking `Create Work Order`, UI shows toast:

- `Failed to create annual preventive work order`

DevTools response:

- `403 Forbidden`
- `new row violates row-level security policy for table "work_orders"`

---

## 12. Sites page

### 12.1 URL

`https://service.direct4.me/sites`

### 12.2 Page title and subtitle

**Title:** `Sites`

**Subtitle:** `Manage locker installation sites`

### 12.3 Filters

#### Company dropdown

Placeholder/default:

- `Select company`

Observed option:

- `Express One SI d.o.o.`

#### Search field

Placeholder:

- `Search sites...`

### 12.4 Empty state before selecting company

Text:

- `Select a company to load sites`
- `Sites are loaded per company. Use the company selector above to view that company’s site list.`

### 12.5 Tabs after company selection

After selecting `Express One SI d.o.o.`, tabs appear:

1. `All (263)`
2. `With Lockers (260)`
3. `Without Lockers (3)`

### 12.6 Sites table columns

Observed columns:

- `Site ID`
- `Site Name`
- `Address`
- `City`
- `Company`
- `Lockers`
- `Status`

### 12.7 Example site rows

#### `(ne dostavljaj) Izobraževanje / onboarding Komenda`

- Site ID: `12163`
- Site Name: `(ne dostavljaj) Izobraževanje / onboarding Komenda`
- Address: `Pod hrasti 7`
- City: `Žeje pri Komendi`
- Company: `Express One SI d.o.o.`
- Lockers: `1`
- Status: `Disabled`

#### `Ajdovščina AMZS`

- Site ID: `18043`
- Site Name: `Ajdovščina AMZS`
- Address: `Goriška cesta 75`
- City: `Ajdovščina`
- Company: `Express One SI d.o.o.`
- Lockers: `2`
- Status: `Enabled`

#### `Apolon`

- Site ID: `18103`
- Site Name: `Apolon`
- Address: `Kramarjeva ulica 1`
- City: `Maribor`
- Company: `Express One SI d.o.o.`
- Lockers: `2`
- Status: `Enabled`

Other visible examples:

- `Armaforce`
- `Avtek`
- `Avtopralnica Hartman Leon`
- `Avtoservis Mele`
- `Bar Ančka`
- `Bar Cona`
- `Bar Namestnik`
- `Bar Peca`
- `Bar Pub Geza`

### 12.8 Actions on Sites page

No create/edit/delete action was visible in the screenshots. Observed interactions were:

- Select company.
- Search sites manually.
- Switch between tabs: All / With Lockers / Without Lockers.

---

## 13. Lockers page

### 13.1 URL

`https://service.direct4.me/lockers`

### 13.2 Page title and subtitle

**Title:** `Lockers`

**Subtitle:** `Manage locker assets by serial number`

### 13.3 Filters

#### Company dropdown

Placeholder/default:

- `Select company`

Observed option:

- `Express One SI d.o.o.`

#### Search field

Placeholder:

- `Search by serial, terminal, or site...`

#### Status dropdown

Default observed selected value:

- `Enabled`

Observed options:

1. `All Status`
2. `Enabled`
3. `Disabled`
4. `Decommissioned`

### 13.4 Empty state before selecting company

Text:

- `Select a company to load lockers`
- `Lockers are loaded per company. Use the company selector above to view that company’s locker list.`

### 13.5 Lockers table columns

Observed columns:

- `Serial Number`
- `Terminal ID`
- `Site`
- `Compartments`
- `Status`
- `Installed`

### 13.6 Example locker rows

Visible example rows after selecting `Express One SI d.o.o.` with `Enabled` status:

#### Row 1

- Serial Number: `082300004249`
- Terminal ID: `5401`
- Site: `Gostilna in Picerija Jurman`
- Compartments: `22`
- Status: `Enabled`
- Installed: `2022-10-27`

#### Row 2

- Serial Number: `142200003779`
- Terminal ID: `5240`
- Site: `Parkirišče Tivoli II`
- Compartments: `22`
- Status: `Enabled`
- Installed: `2023-08-24`

#### Row 3

- Serial Number: `162400005274`
- Terminal ID: `5274`
- Site: `Park Mladih 3`
- Compartments: `22`
- Status: `Enabled`
- Installed: `2024-04-23`

Other visible examples:

- Serial `192500006707`, terminal `6707`, site `Exo fast food Casa Mia`, installed `2026-03-03`
- Serial `192500006727`, terminal `6727`, site `Spar Partner Videm pri Ptuju`, installed `2025-05-21`
- Serial `192500006795`, terminal `6795`, site `Supermarket Spar Miklavž`, installed `2025-05-21`
- Serial `192500006797`, terminal `6797`, site `Občina Hajdina`, installed `2025-10-08`
- Serial `202500006708`, terminal `6708`, site `Exo garažna hiša Fornače`, installed `2026-03-25`
- Serial `202500006709`, terminal `6709`, site `Tuš Supermarket Radvanje`, installed `2025-05-21`
- Serial `202500006711`, terminal `6711`, site `Hipermarket SPAR Ruše`, installed `2025-05-21`
- Serial `202500006712`, terminal `6712`, site `Bar Peca`, installed `2025-05-27`
- Serial `202500006713`, terminal `6713`, site `KZ Apače`, installed `2025-05-27`
- Serial `202500006724`, terminal `6724`, site `Stop Shop Maribor`, installed `2025-05-21`

### 13.7 Actions on Lockers page

No create/edit/delete action was visible in the screenshots. Observed interactions were:

- Select company.
- Search lockers manually.
- Filter by status.

---

## 14. Maintainer My Work page

### 14.1 URL

`https://service.direct4.me/my-work`

### 14.2 Layout

Maintainer view is simpler than ops view.

Observed elements:

- Direct4me logo in top-left.
- Logout icon in top-right.
- Main centered content area.

### 14.3 Page title and status text

**Title:** `My Work`

**Status/subtitle:** `All caught up!`

### 14.4 Time filters

Observed buttons/tabs:

1. `Today`
2. `Tomorrow`
3. `This Week`

`Today` was active by default.

### 14.5 Completed section

Observed section:

- `COMPLETED (0)`

There is a chevron/collapse control near the completed section.

### 14.6 Empty state

Observed empty state:

- Icon: checkmark-like circular illustration.
- Main text: `No tasks right now`
- Supporting text: `When work orders are assigned to you, they'll appear here.`

### 14.7 Untested maintainer actions

Could not test because no work orders were created:

- Opening assigned work order.
- Starting work.
- Marking work in progress.
- Adding execution notes/photos.
- Pausing work.
- Completing work.
- Submitting for review.
- Seeing scheduled work for Today/Tomorrow/This Week.
- Seeing site grouping or route order.

---

## 15. Observed errors and backend behavior

### 15.1 Work order creation error

Occurs for:

- Standard `Locker Work` creation.
- `Internal Task` creation.
- Annual Preventive `Create WO` flow.

Observed UI toast examples:

- `Failed to create work order`
- `Failed to create annual preventive work order`

Observed DevTools error:

```text
403 Forbidden
new row violates row-level security policy for table "work_orders"
```

Observed response details:

```json
{
  "code": "42501",
  "details": null,
  "hint": null,
  "message": "new row violates row-level security policy for table \"work_orders\""
}
```

### 15.2 Address without coordinates warning

Observed in Internal Task flow when manually entering an address instead of selecting a suggestion.

Observed warning/toast text:

```text
Address saved without coordinates. Route optimization will be unavailable until coordinates are added.
```

This indicates route optimization depends on geocoded coordinates.

---

## 16. Important workflow observations

### 16.1 Dashboard redirect behavior

Dashboard cards redirect as follows:

- `Needs Planning` → Work Orders / `Triage`
- `Overdue Open` → Work Orders / `Triage`
- `Blocked (Paused)` → Work Orders / `Paused`
- `Needs Review` → Work Orders / `Awaiting Review`
- `Annual Preventive Due` → Annual Preventive / Annual Visits

Potential ambiguity:

- Needs Planning and Overdue Open both route to the same Triage tab. This may be intentional, but separate card-specific filters might be expected.

### 16.2 Work Scope affects modal step count

- `Locker Work` uses 4 steps because it includes locker selection.
- `Razvoj` appears to use a similar 4-step flow.
- `Internal Task` uses 3 steps because it skips locker selection and uses a custom task/address instead.

### 16.3 Assigned User dependency

The Assigned User dropdown is disabled until Assigned Organization is selected.

Initial disabled text:

- `Select organization first`

After organization selection, available users load.

### 16.4 Any maintainer behavior

The UI states:

- `If no user is selected, any maintainer from the organization can execute this work order.`

This implies unassigned-to-user but organization-assigned work orders should be visible/executable by any maintainer in that organization. This could not be verified.

### 16.5 Additional Assignees behavior

The UI states:

- `Additional assignees can see and work on this work order equally.`

This implies multiple users can access and perform the same work order. This could not be verified.

### 16.6 Annual Preventive due date recalculation

Updating a due date can change status and counters immediately.

Example:

- Ajdovščina AMZS changed from `Up to date` to `Overdue` after setting due date to `Mar 2, 2025`.
- The top counters changed accordingly.

---

## 17. QA assignment expectations mapped to observed app state

### 17.1 Expected: Ops can create, plan, assign, review, and close work orders

Observed:

- Ops can open creation UI.
- Ops can fill create form.
- Ops cannot successfully create work orders due to backend 403.
- Plan/review/close could not be tested.

### 17.2 Expected: Maintainer can see assigned work and carry it out

Observed:

- Maintainer can log in.
- Maintainer My Work page loads.
- No work appears because work order creation failed.
- Carry-out flow could not be tested.

### 17.3 Expected: Planned work orders show up under right day/person

Observed:

- Could not test due to creation blocker.

### 17.4 Expected: Work orders from same site stay grouped together

Observed:

- Could not test due to creation blocker and lack of planned work data.

### 17.5 Expected: Once closed, work order cannot really be changed anymore

Observed:

- Could not test due to creation blocker.

### 17.6 Expected: Route/order/planning info stays in sync with work order

Observed:

- Could not test end-to-end.
- Internal Task address warning indicates route optimization depends on coordinates.

---

## 18. Suggested data model concepts inferred from UI

This section is inferred from UI only and should not be treated as confirmed implementation detail.

### 18.1 WorkOrder

Likely fields:

- ID / number
- Scope: Locker / Internal / possibly Razvoj
- Site
- Company
- Lockers
- Type
- Priority
- Planned date
- Status
- Assigned organization
- Assigned user
- Additional assignees
- Description
- Reference photos
- Route/order metadata
- Review/closure status

### 18.2 Site

Likely fields:

- Site ID
- Site name
- Address
- City
- Company
- Locker count
- Status
- Coordinates
- Annual preventive due date

### 18.3 Locker

Likely fields:

- Serial number
- Terminal ID
- Site
- Number of compartments
- Status
- Installed date

### 18.4 AnnualPreventive

Likely fields:

- Company
- Site
- Active locker count
- Next due date
- Status
- Linked work order
- Work order creation metadata

### 18.5 Organization

Observed organization labels:

- `QA (partner)` in standard WO assignment flow
- `QA` in Annual Preventive create flow

### 18.6 User

Observed users:

- `Žiga Maintainer`
- `Žiga Ops`

---

## 19. Buttons observed across app

### Login

- `Sign in`

### Sidebar

- `Dashboard`
- `Work Orders`
- `Sites`
- `Lockers`
- `Annual Visits`
- `Settings`
- `Log out`

### Dashboard

- `+ New Work Order`

### Work Orders

- `Export`
- `+ New Work Order`
- `List`
- `Map`

### Create Work Order modal

- `Back`
- `Next`
- `Create Work Order`
- `Add Photo`
- `Previous`
- Site-list `Next`
- Close `X`

### Annual Preventive

- `Update due date`
- `Set due date`
- `Create WO`
- `Cancel`
- `Save`
- `Create Work Order`

### Maintainer My Work

- `Today`
- `Tomorrow`
- `This Week`
- Completed-section expand/collapse chevron
- Logout icon

---

## 20. Dropdowns observed across app

### Login

No dropdowns.

### Dashboard

No dropdowns observed.

### Work Orders page

- `All Priorities`
- `All dates`
- `10 rows`
- Possible tab-like filters: All/Triage/Plan/In Progress/Paused/Awaiting Review/Completed

### Create Work Order modal

- `Work Scope`
  - `Locker Work`
  - `Internal Task`
  - `Razvoj`
- `Select company`
  - `Express One SI d.o.o.`
- Site filter dropdown
  - `Site`
- `Type` for Locker Work
  - `Preventive Maintenance`
  - `Incident / Repair`
  - `Installation`
  - `Decommission`
  - `Other`
- `Type` for Internal Task
  - `Vehicle Service`
  - `Procurement / Store Run`
  - `Pickup / Dropoff`
  - `Other Internal Task`
- `Priority`
  - `Low`
  - `Medium`
  - `High`
- `Assigned Organization`
  - `QA (partner)`
- `Assigned User`
  - `Any maintainer`
  - `Žiga Maintainer`
  - `Žiga Ops`

### Sites page

- `Select company`
  - `Express One SI d.o.o.`

### Lockers page

- `Select company`
  - `Express One SI d.o.o.`
- Status dropdown
  - `All Status`
  - `Enabled`
  - `Disabled`
  - `Decommissioned`

### Annual Preventive page

- Company dropdown
  - `All companies`
  - `Express One SI d.o.o.`
- Row count dropdown
  - `10 rows`
  - `50 rows`
  - `100 rows`
- Organization dropdown in annual WO modal
  - `No organization`
  - `QA`
- Maintainer dropdown in annual WO modal
  - `Any available`
  - `Žiga Maintainer`

---

## 21. Search fields observed

### Work Orders

Placeholder:

- `Search work orders`

### Create Work Order Step 1

Placeholder:

- `Search by name, address, or city...`

### Sites

Placeholder:

- `Search sites...`

### Lockers

Placeholder:

- `Search by serial, terminal, or site...`

### Annual Preventive

Placeholder:

- `Search company, site, code, or address...`

---

## 22. Status labels observed

### Work Orders

Tabs/status categories:

- `Triage`
- `Plan`
- `In Progress`
- `Paused`
- `Awaiting Review`
- `Completed`

No actual work order rows were present during testing.

### Sites

Observed site statuses:

- `Enabled`
- `Disabled`

### Lockers

Observed locker status:

- `Enabled`

Dropdown includes:

- `Disabled`
- `Decommissioned`

### Annual Preventive

Observed annual preventive statuses:

- `Needs setup`
- `Overdue`
- `Due soon`
- `Scheduled`
- `Up to date`

### Annual Preventive WO modal

Badge:

- `Annual preventive`

Locker preload status:

- `active`

---

## 23. Known blockers and risks

### 23.1 Blocker: Work order creation rejected by backend

All tested work order creation paths fail with RLS authorization error.

Affected flows:

- Locker Work create work order.
- Internal Task create work order.
- Annual Preventive create work order.

Impact:

- Cannot complete end-to-end lifecycle.
- Cannot test planning, route ordering, maintainer execution, review, closure, or immutability after closure.

### 23.2 Risk: Dashboard redirects may be too generic

`Needs Planning` and `Overdue Open` both route to `Triage`, without observed card-specific filtering.

Potential issue:

- Users may expect different filtered queues.

### 23.3 Risk: Manual addresses without coordinates may break routing

Internal Task allows manual address entry, but route optimization needs coordinates.

Potential issue:

- Route planning/order optimization may be unavailable or inconsistent for work orders without geocoded coordinates.

### 23.4 Risk: Ops user appears in assignee options

`Žiga Ops` appeared as a user option under Assigned User/Additional Assignees.

Potential issue:

- If ops users should not execute work orders, the assignee dropdown may need stricter role filtering.

### 23.5 Risk: Razvoj visible as Work Scope

`Razvoj` appears as a work scope option.

Potential issue:

- Could be a development/internal option not intended for normal ops users.

---

## 24. Suggested QA test cases after blocker is fixed

These should be performed after the RLS/creation issue is fixed.

### 24.1 Work order creation

1. Create Locker Work WO with site-level selection and no locker selected.
2. Create Locker Work WO with one locker selected.
3. Create Locker Work WO with multiple lockers, if available.
4. Create Internal Task with valid suggested address.
5. Create Internal Task with manually entered address.
6. Create Annual Preventive WO from Annual Visits.
7. Validate created WO appears in correct Work Orders tab.
8. Validate created WO details match creation summary.

### 24.2 Assignment and maintainer visibility

1. Assign WO to specific maintainer.
2. Log in as that maintainer.
3. Confirm WO appears under correct day.
4. Assign WO to organization only / Any maintainer.
5. Confirm visibility rules for organization-level assignment.
6. Add additional assignee.
7. Confirm both primary and additional assignees can see/work the WO.

### 24.3 Planning and routing

1. Create multiple WOs for the same day and maintainer.
2. Create multiple WOs from the same site.
3. Reorder planned stops.
4. Verify same-site work orders remain grouped.
5. Verify route/order syncs back to WO detail.
6. Verify map/list consistency.
7. Verify behavior for work orders without coordinates.

### 24.4 Maintainer execution

1. Open assigned WO as maintainer.
2. Start work.
3. Add notes/photos/results.
4. Pause work and provide reason.
5. Resume work.
6. Complete work.
7. Submit for review.

### 24.5 Ops review and closure

1. Confirm submitted WO appears in `Awaiting Review`.
2. Review maintainer-submitted details.
3. Approve/close WO.
4. Confirm WO appears in `Completed`.
5. Confirm maintainer sees it in completed section.
6. Attempt editing closed WO as ops.
7. Attempt editing closed WO as maintainer.
8. Confirm closed WO is immutable or only allows explicitly permitted actions.

### 24.6 Permissions and security

1. Confirm maintainer cannot access ops routes by URL.
2. Confirm maintainer cannot create WOs unless intended.
3. Confirm ops cannot execute maintainer-only actions unless intended.
4. Confirm organizations/users lists are role-filtered.
5. Confirm row-level security permits valid ops creation but blocks unauthorized creation.

---

## 25. Glossary of observed names and labels

### Companies

- `Express One SI d.o.o.`

### Organizations

- `QA (partner)`
- `QA`

### Users

- `Žiga Ops`
- `Žiga Maintainer`
- `Any maintainer`
- `Any available`

### Sites

- `(ne dostavljaj) Izobraževanje / onboarding Komenda`
- `Ajdovščina AMZS`
- `Apolon`
- `Armaforce`
- `Avtek`
- `Avtopralnica Hartman Leon`
- `Avtoservis Mele`
- `Bar Ančka`
- `Bar Cona`
- `Bar Namestnik`
- `Bar Peca`
- `Bar Pub Geza`
- `Gostilna in Picerija Jurman`
- `Parkirišče Tivoli II`
- `Park Mladih 3`
- `Exo fast food Casa Mia`
- `Spar Partner Videm pri Ptuju`
- `Supermarket Spar Miklavž`
- `Občina Hajdina`
- `Exo garažna hiša Fornače`
- `Tuš Supermarket Radvanje`
- `Hipermarket SPAR Ruše`
- `KZ Apače`
- `Stop Shop Maribor`

### Locker identifiers

- `BOX-18875`
- `272400005286`
- `082300004249`
- `142200003779`
- `162400005274`
- `192500006707`
- `192500006727`
- `192500006795`
- `192500006797`
- `202500006708`
- `202500006709`
- `202500006711`
- `202500006712`
- `202500006713`
- `202500006724`

---

## 26. Summary for AI agents

When using this document as context for an AI-assisted project, assume the following:

1. The app is a service/maintenance portal for locker work orders.
2. There are at least two roles: ops and maintainer.
3. Ops has a full sidebar/admin-like operational interface.
4. Maintainer has a simplified My Work interface.
5. Work orders are central to the app and can be created from multiple entry points.
6. Standard WO creation supports multiple scopes: Locker Work, Internal Task, and Razvoj.
7. Annual Preventive has its own specialized WO creation modal.
8. The current biggest observed defect is backend authorization blocking work order creation.
9. Because creation is blocked, all lifecycle steps after creation remain unverified.
10. Any future implementation/testing should prioritize fixing work-order insert permissions, then validating the lifecycle from planning through closure.
