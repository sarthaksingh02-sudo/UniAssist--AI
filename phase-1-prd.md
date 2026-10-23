# UniAssist AI — Phase 1 Product Requirements

**Project:** Intelligent Chatbot for University Assistance  
**Phase:** Major Engineering Project — Phase 1  
**Status:** Proposed scope and design baseline  
**Working assumption:** The college and DigiCampus operator have approved a student-controlled browser integration for this project. Confirm the exact permitted access, fields, and demonstration accounts before connecting real records.

## 1. Product summary

UniAssist AI is a conversational interface that helps a student find university information and navigate their existing DigiCampus session. It combines two deliberately separate paths:

1. **Campus knowledge:** retrieve relevant passages from a locally prepared collection of university policies and answer with visible citations.
2. **DigiCampus assistance:** after the student signs in directly to DigiCampus in their own browser, identify supported portal areas and read a narrowly requested record from the appropriate page, such as a marks page. The assistant explains what it found and where it came from.

The student authenticates to DigiCampus directly. UniAssist AI must not ask for, capture, store, or replay the student's DigiCampus password. Phase 1 does not attempt to replace DigiCampus or perform consequential actions such as editing profiles, registering courses, paying fees, or submitting forms.

## 2. Problem and opportunity

Students often have to know which portal menu contains a specific item, interpret portal labels, and switch between policy documents and personal account screens. A conversational interface could reduce the navigation effort while preserving the official portal as the source of personal records. The engineering challenge is to route each question to the correct source, extract only the requested information, and make the answer traceable and safe when the page is unavailable or ambiguous.

## 3. Goals and success measures

### Phase 1 goals

- Answer a bounded set of campus FAQ questions using local documents and citations.
- Support direct, student-controlled DigiCampus sign-in in the same browser session.
- Discover and document portal navigation and supported data sections within the permitted scope.
- Demonstrate targeted retrieval for a small, approved set of personal queries, initially marks/results and optionally enrolled courses.
- Clearly show which source was used and let the student open the source page.
- Minimize collection, transmission, and retention of student data.
- Provide an honest prototype status when the portal structure changes or a question is unsupported.

### Proposed measures

- At least 90% correct routing on a project test set covering FAQ, personal portal, mixed, and unsupported questions.
- At least 90% source-section accuracy on supported retrieval scenarios.
- No answer containing a personal value unless the portal source was identified and the current page/session passed validation.
- Zero passwords, session tokens, or full unrequested page contents in logs or stored chat history.
- Clear recovery path for expired session, blocked page, changed layout, and ambiguous student request.

These are acceptance targets for the prototype, not claims of production-grade readiness.

## 4. Users and primary scenarios

**Student:** wants an answer without manually hunting through campus pages; is already able to sign into DigiCampus.

**Project administrator / maintainer:** configures allowed portal sections, document sources, and compatible page layouts; reviews failures without seeing unnecessary student records.

### Core user journeys

1. **Campus policy question** — Student asks “When is course withdrawal due?” The router selects the knowledge base, retrieves matching passages, and responds with an answer, document title, section, and effective date when available.
2. **Personal marks question** — Student asks “Show my latest semester marks.” The assistant checks that DigiCampus is open and signed in, navigates only within the approved marks/results area, verifies the page identity and academic period, extracts the relevant visible values, then returns a compact summary with a “View in DigiCampus” action.
3. **DigiCampus not connected** — Assistant explains that the student must open DigiCampus and sign in directly. It provides a clearly labeled link or guided step; it does not request credentials.
4. **Mixed question** — For “What are my marks and what is the pass rule?”, retrieve marks from the portal and the pass rule from the policy collection separately. Label both sources and keep them distinct in the answer.
5. **Unsupported or unclear request** — Ask a clarifying question or state the supported sections rather than exploring unrelated areas or guessing.

## 5. Phase 1 scope

### Included

- Responsive chat UI with source labels, connection state, and a student-controlled “Open DigiCampus” action.
- Campus FAQ ingestion from approved local documents (PDF, HTML, or plain text) with metadata: title, owner, effective date, section, and last reviewed date.
- A routing layer that classifies a request as campus, personal portal, mixed, or unsupported.
- A portal discovery process limited to explicitly allowed screens. Record menu names, page labels, and supported fields; do not submit forms or inspect unrelated records.
- A DigiCampus page adapter for the explicitly approved sections. Start with results/marks and one optional section only if time permits.
- Read-only retrieval, citation/source trace, error states, and a local test fixture for automated UI checks if permitted.
- User-facing privacy notice, session status, disconnect/clear conversation controls, and safe demo mode.

### Excluded from Phase 1

- Any credential collection, password storage, cookie/token extraction, or session replay.
- Silent bulk crawling, scraping all student pages, accessing other students' records, or reading unrelated portal content.
- Grade changes, enrollment, payments, personal profile edits, submissions, or other consequential portal actions.
- Predicting academic performance or making official decisions.
- Production deployment to the full student population, unless separately approved and reviewed.

## 6. Functional requirements

**FR-01 — Source routing:** classify each request before retrieval. Keep campus-document retrieval and personal portal retrieval as distinct code paths.

**FR-02 — Campus retrieval:** retrieve a small number of relevant chunks; answer only from retrieved passages; cite title and section. Include effective date where present. If retrieval confidence is low or passages conflict, abstain or explain the conflict.

**FR-03 — Direct portal authentication:** provide a user-initiated route to the official DigiCampus login. Detect authenticated state using an approved, non-secret signal from the page. Never infer authentication from a saved assistant identity alone.

**FR-04 — Targeted section navigation:** map approved intent to an allowlisted section, verify the resulting page, and stop if the destination does not match the expected section.

**FR-05 — Structured extraction:** extract only fields needed for the request. Preserve labels, period/term, units, and status. Do not silently infer missing values or combine different grading scales.

**FR-06 — Explainable response:** show source type, section/period, retrieval time, and an action to open the source page when safe and supported.

**FR-07 — Session safety:** detect sign-out, timeout, multiple account states, access denial, CAPTCHA/MFA prompts, and permission changes. Pause and ask the student to resolve them directly in DigiCampus.

**FR-08 — User controls:** allow clear chat, disconnect, and remove a locally cached response. Provide concise notice describing what is read and whether content leaves the device.

**FR-09 — Safe failures:** return no personal answer when the page is stale, incomplete, not recognized, or inconsistent. Do not fall back to invented values or a general search across the portal.

**FR-10 — Auditability:** operational diagnostics record event type, adapter version, route, and success/failure code only. They must not record credentials, tokens, full page HTML, or personal values.

## 7. System design

### Recommended Phase 1 deployment

A browser extension or browser-side companion panel is the closest fit for the stated experience: DigiCampus remains in the student's browser, and the assistant appears alongside it. Use a browser-side design only if that is within the college's approval. A server-side proxy that logs into the portal is out of scope.

### Components

1. **Assistant panel (UI):** chat, connection status, answer/source cards, clarification prompts, privacy controls.
2. **Intent router:** separates `CAMPUS_KB`, `PORTAL_PERSONAL`, `MIXED`, and `UNSUPPORTED`; requires explicit supported intent for portal access.
3. **Knowledge service:** local document store, chunking, retrieval, metadata filters, citation generation. The project can simulate vector search or use a local embedding index; retrieval should always return source passages.
4. **Portal connector:** sends the student to official login and communicates only with the active, approved DigiCampus tab. It never reads password fields, browser storage, cookies, or authentication headers.
5. **Portal adapter registry:** versioned selectors and page validators for approved pages (for example, `results-v1`). Adapter uses semantic labels and stable page landmarks where available; selectors are not guessed across unknown page versions.
6. **Policy guard:** allowlist of destinations and fields, read-only action policy, ambiguity checks, data minimization, and refusal/clarification behavior.
7. **Answer composer:** formats extracted values with the term, labels, source, and timestamp; does not ask an LLM to invent missing portal data.
8. **Local session/state manager:** ephemeral connection state and optional conversation state. Clear on disconnect, browser close, or configured timeout.
9. **Diagnostics:** privacy-preserving counters and error codes. No page dumps or student values.

### Request flow

```text
Student question
      |
      v
Intent router ---- campus question ----> Local policy retrieval -> cited answer
      |
      +---- personal question -> consent/context check -> approved portal tab
                                                    -> allowlist + page validation
                                                    -> minimal field extraction
                                                    -> source-linked answer
      |
      +---- mixed question ---> run each path independently, label both sources
      |
      +---- unclear/unsupported -> clarify or abstain
```

### Trust boundaries and data handling

- DigiCampus is authoritative for personal marks; the chatbot is a reader and explainer.
- Policy files are authoritative only when their owner/date are recorded; stale documents are flagged.
- Prefer on-device routing and extraction. If a hosted language model is used, send only the minimum redacted text required and obtain institutional approval for that processing. Never send credentials, tokens, full HTML, unrelated page content, or another student's information.
- Do not persist personal values by default. If the demo needs conversation continuity, keep it in memory for the session and expose a clear clear-chat action.
- Keep development fixtures fictional. Do not use real marks in screenshots, logs, test fixtures, or reports.

## 8. Portal discovery and compatibility plan

1. Confirm written scope: approved origin(s), pages, fields, user groups, demo method, and any rate or automation constraints.
2. Manually inspect the student-visible navigation using an approved account. Catalogue only relevant menu labels and destinations.
3. Build a section inventory: purpose, expected page heading, required fields, data sensitivity, and read-only verification.
4. Implement one adapter at a time. Each adapter must validate page heading, student context where permitted, and term before returning data.
5. Add fixture-based tests for normal pages and failure variants. If a page does not match its known adapter, disable extraction and request manual navigation or maintenance.
6. Reconfirm compatibility after portal updates. Do not automatically crawl newly discovered links or expand the allowlist.

## 9. Edge cases and required behavior

| Case | Required behavior |
|---|---|
| DigiCampus tab is closed or not open | Explain how to open it; do not fabricate a connected state. |
| Student is signed out | Ask them to sign in directly in the official tab; never show a credential form inside the assistant. |
| Session expired mid-request | Stop, discard partial extraction, ask for sign-in, then require a fresh user request. |
| MFA, CAPTCHA, or security challenge appears | Pause. Let the student complete it directly; do not bypass or solve it. |
| Wrong account or multiple portal tabs | Ask the student to choose the correct tab/account; do not guess. |
| Portal page is loading or network is offline | Show a retry state; avoid reading stale DOM as current results. |
| Unknown page layout or portal redesign | Fail closed, identify unsupported layout, capture only a non-personal error code, request maintenance. |
| Results page has no marks yet | Say no result is published for the selected period; distinguish this from retrieval failure. |
| Multiple terms/attempts | Ask which period or display each period with explicit labels; never collapse attempts into one number. |
| Marks use different scales or missing maximum | Preserve raw value and label; do not normalize/convert unless an approved rule exists. |
| Student asks for another person's marks | Decline; operate only on the currently authenticated student's authorized view. |
| User asks mixed personal and policy question | Answer each part from its own source and label both; if one path fails, answer only the supported part. |
| Policy docs conflict or are stale | Show the conflicting document dates and direct student to the responsible office. |
| Prompt injection in a document/page | Treat page text as data, never as instructions to alter scope, reveal secrets, or navigate elsewhere. |
| User asks chatbot to change a mark/pay/register | State that Phase 1 is read-only and provide the official portal route. |
| Disconnect or clear chat | Remove ephemeral data and stop reading the portal until a new user-initiated request. |
| Browser permission revoked | Disable connector, explain permission state, and do not attempt to regain access silently. |
| Browser assistant unavailable on mobile | Offer campus knowledge mode and direct portal navigation; do not imply portal reading works. |

## 10. Non-functional requirements

- **Privacy:** data minimization, clear purpose, no credential handling, ephemeral personal response handling by default.
- **Security:** least privilege, strict origin and section allowlist, content-script isolation, no dynamic code from portal pages, secure dependency review, documented threat model.
- **Reliability:** unknown or changed layouts fail closed; page freshness and term are validated.
- **Usability:** source and data type are visible; loading, disconnected, expired-session, and unsupported states are understandable.
- **Accessibility:** keyboard support, visible focus, screen-reader labels, readable contrast, responsive layout.
- **Maintainability:** adapters and document sources are versioned separately; each change has a change note and fixture.
- **Performance:** local intent and extraction should feel immediate; campus retrieval should return promptly on a typical student laptop.

## 11. Acceptance criteria

1. A policy question returns an answer with a matching source passage, title, and section, or abstains when evidence is insufficient.
2. A marks query routes only to the approved marks section and returns the visible values with the correct term label.
3. Signing in is performed on the official DigiCampus page; the assistant never renders or records password input.
4. Expired session, CAPTCHA/MFA, unknown layout, missing result, and ambiguous period each produce the specified safe state.
5. An unrelated/unsupported portal request does not trigger broad navigation or extraction.
6. Personal values do not appear in diagnostics, saved fixtures, or the static mockup.
7. The student can disconnect and clear the current conversation.
8. Demonstration materials label all non-live data and clearly state the exact integration status.

## 12. Phase plan and deliverables

**Phase 1A — Discovery and requirements:** approval boundaries, page inventory, data classification, threat model, test scenarios. Deliver: signed-off scope and architecture diagram.

**Phase 1B — Campus assistant:** ingest approved policy documents, retrieval with citations, answer/abstention behavior. Deliver: FAQ demo and retrieval evaluation set.

**Phase 1C — Portal proof of concept:** direct sign-in handoff, one approved read-only adapter for marks, source linking, safe session and layout failures. Deliver: controlled demo using only authorized account/data.

**Phase 1D — Evaluation and report:** routing accuracy, extraction correctness, failure-case results, privacy/security review, limitations, next-phase recommendation.

## 13. Open decisions before implementation

- Which DigiCampus instance/version and browser(s) are in the approved scope?
- Is a browser extension or in-page companion explicitly permitted? Which pages and fields are allowed?
- Can any user data be sent to a hosted model, or must all personal processing remain local?
- Which first portal section is approved: marks only, or marks plus courses/fees?
- How will the project use a test account or anonymized records for evaluation?
- Is chat history memory-only, or does the project require a persistence feature?

Until these are answered, build the campus knowledge path and UI against fictional fixtures, and keep the live connector behind a disabled adapter boundary.
