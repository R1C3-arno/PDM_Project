# Individual Presentation Scripts

> **Total Presentation Time: 20 minutes**
> Each speaker has ~1.5 minutes. Keep it concise!

---

## SLIDE 1 & 2: Le Thanh Danh (Leader, Full-stack Developer)

**Duration: 2.5 minutes total**

### Opening (Slide 1) - 1 min

> "Good morning everyone. I'm Danh, team leader and full-stack developer. Today we present OLAVS - our Online Loan Application and Verification System.
>
> Our team of 11 members worked collaboratively across 5 roles. No one worked in isolation - every feature is the result of cross-functional collaboration."

### Architecture (Slide 2) - 1.5 min

> "We use a three-tier architecture: Next.js 14 for frontend, Spring Boot 3 for backend, and MySQL for data persistence.
>
> I worked with Nhan on JWT authentication, collaborated with Khanh and Bao on data models, and conducted code reviews for both teams.
>
> Now Hoai will explain our integration approach."

---

## SLIDE 3: Dao Huu Hoai (Full-stack Developer)

**Duration: 1.5 minutes**

> "I'm Hoai, bridging frontend and backend. I designed our API client architecture for consistent error handling and authentication.
>
> I worked with Quoc Anh and Tri on data fetching patterns, and with Nhan and Khoi on API contracts. I also implemented the authentication flow end-to-end.
>
> Next, Quoc Anh shows the user interfaces."

---

## SLIDE 4: Le Hoang Quoc Anh (Frontend Developer)

**Duration: 2 minutes (including video)**

> "I'm Quoc Anh. I built the user-facing interfaces.
>
> [Play video - 1 min] This shows the user journey: landing page, registration, dashboard, and the loan application wizard.
>
> I collaborated with Tri on shared components, Nhan on data structures, and Khanh's ERD helped me understand form relationships.
>
> Tri will show the staff side."

---

## SLIDE 5: Truong Minh Tri (Frontend Developer)

**Duration: 2 minutes (including video)**

> "I'm Tri. I built staff interfaces for Bankers, Verifiers, Underwriters, and Admins.
>
> [Play video - 1 min] Each role has a customized dashboard. Quoc Anh and I built a shared component library for consistency.
>
> I worked with Khoi on verification workflows and Bao on understanding the application lifecycle.
>
> Nhan will cover the backend."

---

## SLIDE 6: Vu Duc Nhan (Backend Developer)

**Duration: 1.5 minutes**

> "I'm Nhan. I focused on security and API infrastructure.
>
> This use case diagram shows our five actor types with role-based permissions enforced at multiple levels.
>
> Key contributions: JWT with HttpOnly cookies, role-based access control, and API security. I collaborated with Khanh and Bao on entity design, and created API documentation that Tuan formatted.
>
> Khoi will explain business logic."

---

## SLIDE 7: Vo Tri Khoi (Backend Developer)

**Duration: 1.5 minutes**

> "I'm Khoi. I handle business logic and data flow.
>
> This state diagram shows application lifecycle - from SUBMITTED to COMPLETED or REJECTED. Each transition is validated by business rules.
>
> I worked with Bao on loan calculations and EMI formulas, and implemented caching for performance. Hoai integrated my notifications into the frontend.
>
> Khanh presents data modeling."

---

## SLIDE 8: Phan Minh Khanh (ERD Designer)

**Duration: 1.5 minutes**

> "I'm Khanh. Bao and I designed the database schema.
>
> This shows core entities: USERS connects to APPLICANTS, WALLETS, and APPLICATIONS. We balanced normalization with practical performance needs.
>
> I worked with Nhan on JPA entities, added indexes for Khoi's queries, and helped Quoc Anh understand data constraints for form validation.
>
> Bao covers financial entities."

---

## SLIDE 9: Vo Nguyen Dinh Bao (ERD Designer)

**Duration: 1.5 minutes**

> "I'm Bao. I focused on verification workflow and financial modeling.
>
> This diagram shows VERIFICATIONS, RISK_ASSESSMENTS, OFFERS, CONTRACTS, and PAYMENTS. I implemented EMI calculation in MySQL for accuracy.
>
> I collaborated with Khoi on loan formulas and Khai tested my models with business queries.
>
> Khai presents documentation."

---

## SLIDE 10: Vo Quang Khai (Report Writer)

**Duration: 1.5 minutes**

> "I'm Khai. I created end-user documentation.
>
> I wrote guides for applicants and staff. By using the system myself, I found UX issues that Quoc Anh fixed.
>
> I also contributed to testing - when features didn't match documentation, I reported bugs. Bao helped me explain financial calculations in plain language.
>
> Tuan covers technical docs."

---

## SLIDE 11: Tran Chau Thanh Tuan (Report Writer)

**Duration: 1.5 minutes**

> "I'm Tuan. I wrote technical documentation.
>
> I created API reference with Nhan and Khoi using OpenAPI specification. I standardized response formats that Hoai implemented on frontend.
>
> The setup documentation was tested by having new developers follow it. I also worked with Danh on architecture documentation.
>
> Nam covers testing."

---

## SLIDE 12: Hoang Trieu Nam (Report Writer)

**Duration: 1.5 minutes**

> "I'm Nam. I documented testing and deployment.
>
> Our testing pyramid: 200+ unit tests, 50 integration tests, 20 E2E tests - 85% coverage total.
>
> I tracked test coverage, maintained bug tracking, and created deployment playbooks. My work connected all teams - I tested interfaces, verified APIs, and validated migrations.
>
> Back to Danh for closing."

---

## SLIDE 13: Le Thanh Danh (Closing)

**Duration: 1.5 minutes**

> "OLAVS is truly a team effort. Every feature passed through multiple members.
>
> A single loan application touches: Quoc Anh's forms, Hoai's API integration, Nhan's authentication, Khoi's business logic, Khanh and Bao's data model, and our writers' documentation.
>
> We learned that great software comes from collaboration. Thank you - we're happy to answer questions.
>
> OLAVS - Built by a team, for users who deserve a better loan experience."

---

## Quick Reference: Speaking Tips

| Speaker | Key Focus | Time |
|---------|-----------|------|
| Danh | Architecture overview | 2.5 min |
| Hoai | Integration patterns | 1.5 min |
| Quoc Anh | User journey + video | 2 min |
| Tri | Staff roles + video | 2 min |
| Nhan | Security & APIs | 1.5 min |
| Khoi | Business logic | 1.5 min |
| Khanh | Core ERD | 1.5 min |
| Bao | Financial ERD | 1.5 min |
| Khai | User docs | 1.5 min |
| Tuan | Tech docs | 1.5 min |
| Nam | Testing | 1.5 min |
| Danh | Closing | 1.5 min |
| **Total** | | **20 min** |

### Tips

- Practice with a timer
- Point to diagrams while speaking
- Smooth handoffs between speakers
- Videos should be 1 minute max each
