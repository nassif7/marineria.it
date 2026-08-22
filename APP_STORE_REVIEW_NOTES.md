# marineria.it — App Review Notes

marineria.it is a maritime crew recruitment app connecting **crew members** (job seekers) with **recruiters** (yacht/vessel owners and agencies). The app has three access levels: a public guest mode, a Crew account, and a Recruiter account. Users can hold both a Crew and a Recruiter account and switch between them from Settings without re-entering credentials for the one already stored.

Sign-in supports two methods: a one-time email code (OTP) or email/password. Crew and Recruiter accounts are created on the marineria.it website (registration is web-only; the in-app sign-in screen deep-links out to the two registration pages), so reviewers will need test credentials for each role to see the logged-in experience — see credentials at the bottom of this note if provided separately in App Store Connect.

---

## 1. No-login / Guest

Anyone can open the app and browse without creating an account or signing in.

- **Browse public job offers** — a public list of open maritime job offers (position, salary range, boarding dates, contract/owner type).
- **View full offer details** — position description, requirements, salary, base/location, posting date.
- **Share an offer** — native share sheet with a link to the offer.
- **Attempt to apply** — tapping "Apply" prompts to sign in or register (crew registration opens the marineria.it site); guests cannot submit an application.
- **Switch app language** — English / Italian, available from Settings even while a guest.
- **Sign in or continue as guest** — from the same screen, with quick links to register as Crew or as Recruiter on the website.

Guests do **not** see push notifications, account settings, or any profile/search features (a "Find your crew" recruiter entry point is shown but marked "coming soon" and disabled).

---

## 2. Crew account ("Pro")

A crew member is a maritime professional with a CV/profile listed on marineria.it, looking for a job.

**Profile / Home**

- Personal profile overview: photo, main position, nationality, age, city, availability status.
- Profile completion meter with a count of missing fields.
- Quick stats: profile views, years of experience, number of approved references.
- Qualification badges: seaman's book on file, valid certificate of competence, courses, languages.
- **Preview how the profile looks to recruiters** (public preview modal).
- Whether the profile is currently published/listed to recruiters.

**Job offers**

- Browse the full list of job offers matched to their profile.
- View offer details (position, requirements, salary, dates, base, description).
- **Apply to an offer**, after reviewing a privacy/consent screen and confirming compliance items, with a shortcut to review their own profile before applying.
- See offers already applied to (marked "already applied").
- See why an offer isn't a match ("not applicable" reasons) when the profile doesn't meet requirements, with a link to edit the profile on the website.
- **Contact the recruiter** for a given offer (email / phone / WhatsApp, when provided).
- Share an offer via the native share sheet.

**Notifications**

- In-app notification center (e.g. new matching offers, recruiter contact).
- Push notifications, toggleable in Settings.
- Tapping a notification deep-links to the relevant offer or notification detail.

**Account**

- Switch to a linked Recruiter account (if the user also has one).
- Change password / manage security (opens marineria.it in-browser).
- View Terms of Service and Privacy Policy.
- Sign out.

---

## 3. Recruiter account ("Owner")

A recruiter is a yacht/vessel owner or agency looking to staff a position, managing one or more active "searches" (job postings) on marineria.it.

**Profile / Home**

- Recruiter identity card: name, company, city, contact info.
- List of their active searches with candidate counts (candidates / contacted / residual).

**Search & candidate management**

- View details of a search (position, contract, requirements).
- View the list of matching crew candidates for a search.
- Open a candidate's CV/profile: qualifications, experience history, skills, languages, education, references, availability, photos.
- **Contact a candidate** — unlocks the candidate's contact details (email/phone/WhatsApp), can request the CV as a PDF, and notifies the crew member; gated behind the search being a paid search (an "upgrade/checkout" prompt is shown for unpaid searches, opening marineria.it in-browser).
- View a candidate's contact info again once already contacted.
- **Remove a candidate** from the search's candidate list.
- Search for additional crew by skill or by location (opens filtered results on marineria.it in-browser).

**Notifications**

- In-app notification center (e.g. new candidates, crew replies).
- Push notifications, toggleable in Settings.
- Tapping a notification deep-links to the relevant candidate profile or notification detail.

**Account**

- Switch to a linked Crew account (if the user also has one).
- Contact support (recruiter-only support entry point, since recruiters are the paying users).
- Change password / manage security, Terms of Service, Privacy Policy (all open marineria.it in-browser).
- Sign out.

---

## Cross-cutting notes for reviewers

- **Payments**: the app itself does not process payments — recruiter "search" subscriptions/upgrades are purchased on the marineria.it website via an in-app browser link, not via In-App Purchase.
- **Registration**: new Crew/Recruiter accounts cannot be created inside the app; sign-in only links out to the website's registration forms.
- **Localization**: English and Italian, switchable at any time from Settings (and pre-login).
- **Push notifications**: used for offer matches, applications, and recruiter/crew contact events; can be disabled per-account in Settings.
