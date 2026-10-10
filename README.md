# EmergencyConnect — 24-hour hackathon prototype
**Stack:** HTML, CSS, JavaScript. No build tools or packages needed.

## Working features
- Rule-based Smart Guide: transparent keyword matching suggests one of the safety categories (not actual AI and not a diagnosis).
- Preparedness checklist with a live completion bar (progress is not saved after the page closes).
- Judge-friendly scenario simulator for fire, road accident, medical and personal-safety examples; simulation never contacts anyone.
- Responsive desktop/mobile website.
- Six emergency categories with general next-step guidance.
- `tel:112` links open the phone dialler where supported.
- Optional geolocation permission; coordinates stay in the browser and can be shared/copied.
- Incident report form creates a local draft that can be copied/shared manually.
- Mobile navigation and basic form validation.

## Safety and limitations
- This website does **not** dispatch an ambulance, police, fire service, or campus security.
- Incident reports are not sent to any backend or responder.
- No login, automatic SMS, shared database, or verified live hospital/shelter directory.
- Location requires browser permission and usually HTTPS or localhost.
- General safety information only. Follow emergency professionals and local authorities.
- In immediate danger in India, call **112**; do not wait for this website.

## Run
1. Extract `EmergencyConnect.zip`.
2. Open the folder in VS Code.
3. Open `index.html` in a browser, or use VS Code Live Server.
4. Test geolocation on localhost and allow permission only if comfortable.
5. Do not make an unnecessary call to test the emergency link.

## Five-person team
1. Member 1: UI/UX and mobile layout.
2. Member 2: review emergency guidance for clarity and caution.
3. Member 3: geolocation and share/copy fallback.
4. Member 4: incident report form and validation.
5. Member 5: integration, browser testing, pitch and slides.

## 24-hour plan
- 0–2h: problem statement, user flow, safety limitations.
- 2–6h: responsive interface.
- 6–11h: emergency categories and guidance.
- 11–15h: location permission and report draft.
- 15–18h: test desktop/mobile, forms and error states.
- 18–21h: slides and demo rehearsal.
- 21–24h: final fixes, backup screenshots, freeze code.

## Judge-focused pitch
- **Innovation:** show the rule-based Smart Guide and explain exactly how keyword matching works. Be transparent that it is not an AI model.
- **Working demo:** run the scenario simulator, open a guide, test the checklist, and create a local incident report.
- **Social impact:** explain the goal: reduce confusion by putting a 112 shortcut, general next steps, location sharing and report drafting in one simple interface.
- **Design:** demonstrate the responsive layout on both a laptop and a phone-sized browser.
- **Responsible design:** clearly explain that the website does not dispatch responders, reports are not sent to a server, and users control location sharing.

## 3-minute demo
1. 0:00–0:25 — Explain the problem: emergency information should be quick and clear.
2. 0:25–1:00 — Select Fire/Smoke or Road Accident and show next steps.
3. 1:00–1:35 — Demonstrate optional location permission; if unavailable, show landmark fallback.
4. 1:35–2:15 — Create a sample incident report and demonstrate copy/share without sending it.
5. 2:15–2:40 — Show the 112 shortcut and explain it opens the dialler.
6. 2:40–3:00 — State limitations and future work: verified directory, secure backend, consent and authorized dispatch integrations.

## Future work
Verified local emergency contacts, secure backend, role-based access, privacy policy, multilingual expert-reviewed guidance, abuse prevention, and formal authorization/testing for any real dispatch integration.
