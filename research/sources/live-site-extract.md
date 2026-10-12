# Meerana live website (www.meerana.ae): content extract for the evidence register

**Extracted:** 2026-10-02 (all fetches made the same day)
**Site build examined:** `main.5717dfa4.js` / `main.eaa908a1.css`. `index.html` reports `Last-Modified: Tue, 22 Sep 2026 12:13:35 GMT`.
**Status of this file:** This is a raw evidence extract. Text in "quotes" is verbatim from the live site, including the original typos, which are marked [sic]. My own inferences are labelled **(inference)** or **(uncertain)**.

---

## 0. Provenance, method and limitations

### 0.1 Sources used

| # | Source | Where saved | Notes |
|---|---|---|---|
| S1 | Production JS bundle, `https://www.meerana.ae/static/js/main.5717dfa4.js` | `research/live-site/main.5717dfa4.js` | 1,961,794 bytes, all ASCII. **Bundle offsets in this report are character offsets, which here equal byte offsets.** The application code starts at about offset 1,478,000. |
| S2 | HTML shell, `https://www.meerana.ae/` | `research/live-site/index.html` | 909 bytes. Every unknown path returns this same file with HTTP 200 (SPA fallback). |
| S3 | **Public source map**, `https://www.meerana.ae/static/js/main.5717dfa4.js.map` (HTTP 200, 6,828,663 bytes, `Last-Modified 22 Sep 2026 12:28:37 GMT`) | App sources extracted to `research/live-site/sourcemap-app-src/` | The copy on the server is **truncated**: the JSON is invalid and the file ends partway through `components/wasel/index.js`. Of 472 listed sources, 462 have complete content and 1 (Wasel) is partial. `components/asset-tracking/index.js`, `App.js` and `index.js` are missing, so those parts were read from S1. |
| S4 | Live CMS/API JSON from `https://api.meerana.ae/allDataInfo/*.php` (GET only) | `research/live-site/api-snapshot-2026-10-02/` | **Most of the home-page copy comes from this API at runtime and is not in the bundle.** |
| S5 | HEAD checks of every referenced `/assets/` file | `research/live-site/asset-head-check-2026-10-02.json` | See §16. |
| S6 | Attributed string list (offset, component, route, string) | `research/live-site/bundle-strings.tsv` | 1,680 rows. Library noise is removed and strings are deduplicated per component in bundle order. This is the full output of task 1. |
| S7 | YouTube oEmbed for the embedded video `VRD8hzICcYQ` | (not saved) | Title "Dubai Dreamers: From Dubai to the World with Meerana Technologies". Author "Dubai Chambers" (`@DubaiChambersTV`). |
| S8 | Local copies of 10 partner logos and several images in `research/recovered/figma-make-v17/public-meerana-assets/` | already on disk | Byte sizes match the live files exactly (for example dell.png 13,806, DubaiELEC.png 39,850, ministryOfInterior.png 118,852). I used these copies only to identify what the images show. |

### 0.2 Method
1. Python tokeniser over S1. It found 16,515 string literals with offsets. From offset 1,478,000 onward, a heuristic filter (dropping Tailwind classes, SVG paths and identifiers) left 5,513 human-readable strings, or 2,301 unique. These were then attributed to components using the offsets of the minified function definitions (§1).
2. Parsed the truncated source map (S3) incrementally. It recovered the original JSX for 33 of the 36 application files: 32 complete plus Wasel partial. Asset Tracking, App.js and index.js are missing.
3. **Cross-check:** every human-readable application string in S1 was looked up in the S3 sources. The only strings that did not match were the tail of Wasel, the whole Asset Tracking page and the route table, all of which are missing from the truncated map. **Conclusion: the source map matches the deployed bundle.** Where the map contains code the minifier removed (dead code), §18 says so.
4. Called every GET endpoint found in the code (§15) with a browser User-Agent and saved the responses (S4).
5. HEAD-checked all 108 asset paths found in S1 and S4 (S5). A missing file does not return 404. It returns the 909-byte `text/html` SPA shell, so that response is treated as "missing".

### 0.3 Limitations
- **Content can change without a deploy.** About, mission, solutions, team, hero slides, news, partner logos and contact intro all come from `api.meerana.ae` at runtime. What is recorded here is the API state on 2026-10-02.
- **I did not render the site in a browser.** Whether something is "shown" was worked out by reading the JSX. Responsive behaviour was inferred from the Tailwind classes; for example, the globe is `hidden lg:block`.
- **Not retrieved:**
  - The Instagram gallery. It is fetched through `http://api.scrapestack.com`; see §13.
  - Chatbot answers from its server. `http://20.46.197.154:7000` timed out after 12 s on all paths.
  - The content of the YouTube video and of the external news links. The links were not opened.
- **Company profile PDF not reviewed.** `https://www.meerana.ae/assets/Meerana%20Profile.pdf` exists (200, `application/pdf`, **32,027,818 bytes**, `Last-Modified 13 Aug 2026`). I only checked it with HEAD, as instructed. It is the most likely source of any company statistics, and none appear anywhere else on the site.
- **Most partner logos are identified by filename only.** 10 logos were checked visually from the local copies (S8).
- No forms were submitted. POST endpoints were documented from the code only.
- The bare domain `https://meerana.ae/` returned **200** (909 bytes) for me today with both a browser User-Agent and curl's default one. I did not see the 406 Mod_Security response.

---

## 1. Site map and routes (from the route table at bundle @1,960,183)

| Route | Component (minified fn @ offset) | Source file | Linked from (live UI) | Data source |
|---|---|---|---|---|
| `/` | Herosection `YC` @1,506,338, which also renders Landingpage `XC` | herosection/index.js plus landingpage/index.js | Logo; all in-page anchors | API: homepageInfo, aboutusInfo, chooseusInfo, ourteamInfo, solutionInfo, testimonalsInfo, partners_clientsInfo, experienceInfo, locationInfo, contactusinfoInfo, latestnewsInfo |
| `/landing` | Landingpage `XC` @1,483,675 | landingpage/index.js | **Not linked** | Same as the home page, without the hero slider |
| `/construction?id=N` (solution category detail) | `$C` @1,522,088 | solution/construction/index.js | Navbar "Solutions" submenu; home solution cards "Read More" | `solutionInfo.php?id=N` (ids 1, 2, 3, 6 exist; 4, 5 and 7–10 return `{"status":"failure"}`) |
| `/partners` | `eN` @1,526,811 | partners/index.js | Navbar "Partners & Clients"; home "See more" | partners_clientsInfo, partnerinfoInfo |
| `/career` | `tN` @1,549,760 | career/index.js | Footer "Careers" only | none (static) |
| `/privacy` | `nN` @1,554,119 | privacy/index.js | Footer "Privacy" | static |
| `/site-terms` | `rN` @1,565,728 | site-terms/index.js | Footer "Site Terms" | static |
| `/legal-of-service` | `iN` @1,567,883 | legal-of-service/index.js | Footer "Legal Of Service" | static |
| `/latest-news` | `aN` @1,569,671 | latest-news/index.js | Navbar; footer; home "Read More" | latestnewsInfo |
| `/courses` | `lN` @1,575,445 | courses/index.js | Navbar "Courses" | courseProviderInfo |
| `/course-provider/:id` | `EN` @1,591,524 | course-details/index.js | /courses "Learn More" | `courseProviderInfo.php?id=` |
| `/course-registration/:id` | `kN` @1,593,858 | course-registation/index.js [sic] | Provider page "Learn More" | `courseInfo.php?id=` |
| `/accelerator` | `oN` @1,571,639 | accelerator/index.js | **Not linked** | static |
| `/gallery` | `QI` @1,825,442 | gallery/index.js | Navbar "Gallery" | scrapestack/Instagram (fails, §13) |
| `/mandobee` | `pU` @1,835,214 (config @1,832,268) | mandobee/index.js | **Not linked** (see note) | static |
| `/yisbir` | `SU` @1,852,216 (config @1,847,762) | yisbir/index.js | **Not linked** | static |
| `/tasree3` | `RU` @1,882,630 (config @1,878,196) | tasree3/index.js | **Not linked** | static |
| `/nazoo` | `qU` @1,903,747 (config @1,899,636) | nazoo/index.js | **Not linked** | static |
| `/wasel` | `JU` @1,925,835 (config @1,921,739) | wasel/index.js | **Not linked** | static |
| `/asset-tracking` | `oB` @1,943,955 (config `aB` @1,940,724) | asset-tracking/index.js (bundle only) | **Not linked** | static |
| `/openai-chatbot` (index, `chatarea`, `dashboard`) | `PN` @1,600,271; `YI` @1,824,261; `XI` @1,822,865 | openai-chatbot/*.js | **Not linked**; the nav link is commented out in the source | `http://20.46.197.154:7000/start_chat` and `/chat` |

**Why the six product pages are orphaned.** The only code that links to them is `getProductRoute(title)` in both the navbar and the home Solutions cards. It matches the substrings "mandoobee"/"mandobee", "yisbir", "tasree3", "nazoo"/"nazo", "wasel" and "asset tracking" against **solution titles returned by the API**. Today those titles are only "Consultation", "Bespoke Products", "Our Unique Products" and "Managed Services". None match, so every Solutions link goes to `/construction?id=N`. A navbar item reading `New Mandobee` exists only as a **commented-out** block in the source. **As of 2026-10-02, the product pages can only be reached by typing the URL.** The contact form's product dropdown does list the products by name.

Global layout (bundle @1,960,183), the same on every route: `KC` navbar → `MN` chatbot widget → `QC` scroll-to-top → `<Routes>` → `ZC` footer.

---

## 2. Global elements

### 2.1 `<head>` (index.html)
- `<title>Meerana</title>`
- `<meta name="description" content="Web site created using create-react-app"/>`. This is the unchanged CRA default.
- `<meta name="theme-color" content="#000000"/>` and `<meta http-equiv="Permissions-Policy" content="interest-cohort=()">`.
- Favicon `./assets/android-chrome-192x192.png` exists (5,182 B). `/favicon.ico` exists (1,150 B).
- `apple-touch-icon` → `/logo192.png` is **missing**; it returns the SPA HTML.
- Font: Google Fonts Open Sans. The CSS also loads Material Symbols / Material Icons.
- There are no OG/Twitter tags and no canonical link. `/robots.txt`, `/sitemap.xml` and `/manifest.json` are **missing** (they return the SPA HTML). `/asset-manifest.json` exists.

### 2.2 Navbar (`KC`, bundle @1,508,463)
- Logo: `/assets/MEERANA Logo final transparent white-08.png` (alt=""). The menu opens from a "menu" icon.
- Side-menu items in order:
  1. "About Meerana" (scrolls to `#about`)
  2. "Solutions" with an expand_more submenu filled from `solutionInfo.php`: "Consultation", "Bespoke Products", "Our Unique Products", "Managed Services"
  3. " Our Team" (with the leading space)
  4. "Partners & Clients" → /partners
  5. "Courses" → /courses
  6. "Latest News" → /latest-news
  7. "Gallery" → /gallery
  8. "Contact Us" (scrolls to `#contact`)
- Commented out in the source only, not live: "Beta OpenAI Chatbot", "New Mandobee", "CAREERS", "Testimonals" [sic].

### 2.3 Footer (`ZC`, bundle @1,514,042)
- **"About"**: "Meerana's mission is to build the most trusted community and deliver the highest quality products & services. Meerana is targeting highest customer satisfaction & user experience through innovative approaches, use of modern technologies and highly competent resources." (@1,517,530)
- **"Company"**: "About Us" · "Our Team" · "Clients & Partners" · "Solutions" · "Careers" (/career) · "Latest News"
- **"Policies"**: "Privacy" · "Site Terms" · "Legal Of Service"
- **"Newsletter"**:
  - Placeholder "Enter your email address", button "Subscribe Now", success text "Thank you for subscribing!"
  - Submits by POST to `subscribersInfo.php`.
- Social icons (aria-labels "Instagram", "LinkedIn", "Twitter (X)"):
  - `https://www.instagram.com/meeranatechnologies`
  - `https://www.linkedin.com/company/meerana`
  - `https://x.com/MeeranaTech1`
- Copyright: **"© All rights reserved - 2024 Meerana Technologies LLC"** (@1,521,764)

### 2.4 Chat widget (`MN` @1,590,469; config @1,577,700). Present on every page.
- Floating button at the bottom right, using react-chatbot-kit.
- Bot name: **"Meerana Bot"**.
- Opening message: "Hello! Welcome to Meerana. Please feel free to ask me any questions related to Meerana products and services. I'm here to assist you!"
- Server: POST JSON to `REACT_APP_CHATBOT_URL || "http://20.46.197.154:7000/chatbot"`. The environment variable is not set in the build, so the HTTP raw-IP URL is used.
- **Why users only ever see the fallback answers:** this request is mixed content from an HTTPS page, and the server timed out today. In that case the code returns a hard-coded **keyword-matched fallback answer** (bundle @1,579,298–1,588,725). These fallback answers are therefore the live chatbot content, and they include product descriptions that **contradict the product pages** (§6, §17). All of them are quoted in §5.7 and §6.

---

## 3. Company identity

### 3.1 Name variants (verbatim)

| Variant | Where |
|---|---|
| "Meerana" | Throughout; `<title>`; navbar "About Meerana"; hero/About API text |
| "Meerana Technologies" | Privacy policy ("refers to Meerana Technologies, #1704, Blue Bay Tower, Business Bay, Dubai, UAE." @1,556,603; contact block @1,565,556); chatbot fallbacks; YouTube iframe title |
| **"Meerana Technologies LLC"** | Footer copyright @1,521,764 |
| "MEERANA" | News headline "MEERANA's strategic expansion into Kenya and Rwanda" (API); logo filename; download filename "MEERANA-CP-DE-V1.0 2026.pdf" (@1,484,230) |
| "Meerana Technologies LLP" | Place name in the India Google-Maps embed URL in `locationInfo.php`. **Not rendered.** |
| "Meerana Information Technology" / "ميرانا لتقنية المعلومات" | Text inside award image `new01.webp` (MOHRE "Winning Establishments"); checked visually from the local copy |
| "Meerana Community" | Attribution of the vision quote |
| "An Emarati Group of Companies" [sic] | About subtitle (API `aboutusInfo.subtitle`) |
| "Meerana App" | Privacy policy: "Application: Refers to Meerana App, the software program provided by the Company." |
| "Meerana Accelerator" | H1 on `/accelerator` (unlinked) |
| "Meerana Bot" | Chat widget |
| "Meerana Profile.pdf" (file) / "MEERANA-CP-DE-V1.0 2026.pdf" (download name) | Profile download |

### 3.2 Taglines and positioning lines
- Hero slide 1, title: **"Connecting the World Through Smart Technologies."**
- Hero slide 1, text: "We help businesses to streamline their digital journey while focusing on a powerful combination of IoT(Internet of Things) and Blockchain related smart technologies.." [sic, double full stop]
- About title: **"Meerana is your Digital Transformation Partner"**
- Experience banner: "Experience the difference with Meerana!" (API `experienceInfo`), followed by the "Download Profile" button.
- Partners page title: "Empowering Innovation Through Collaborative Partnerships in Emerging Technologies"
- Accelerator: "We've helped countless startups navigate their journey to success through our tailored consulting services, expert guidance, and support"

### 3.3 About text
API `aboutusInfo.php`, rendered on home `#about`. The heading is "About Us", rotated −90° on desktop. Image `/assets/herobg2.webp` sits over `/assets/bg-vector.png`.
> "Meerana is an innovative technology company focused on developing leading edge smart solutions. We believe that these intelligent technologies will help revolutionize how businesses are planned and operated in the future, opening up a wealth of possibilities for both our customers and partners"

### 3.4 Mission, vision, values and goal
- **"Our Vision"** (static, bundle @1,491,611): "“Build the most trusted community to deliver the highest quality technological services” - Meerana Community"
- **"Why Choose Us"** (API `chooseusInfo.description`, HTML rendered):
  - "Meerana's mission is to build the most trusted community and deliver the highest quality technology services."
  - Heading **"Most Trusted Community"**: "Services will not only be provided by Meerana but also by our highly valued partners. This is the reason Meerana is a "Community" and not a company."
  - Heading **"Our Goal"**: "It is our goal to provide an environment of relations that is the most beneficial for everyone, regardless of whether they are employees, partners, or customers...."
  - This section embeds YouTube `https://www.youtube.com/embed/VRD8hzICcYQ` with iframe title "Dubai Dreamers: From Dubai to the World with Meerana Technologies". The oEmbed author is **Dubai Chambers**. The API field `"video": "Meerana_Technologies.mp4"` is **not used**; the file exists, 9,183,003 B.
- **Footer mission** (variant): see §2.3 ("…highest quality products & services. Meerana is targeting highest customer satisfaction & user experience…").
- **Values:** no section titled values exists.

### 3.5 "Emirati group of companies" claims
- The only occurrence is **"An Emarati Group of Companies"** [sic, "Emarati"] (About subtitle, API).
- The word "Emirati" (correct spelling) appears nowhere.
- Nothing names the group or its other companies.

### 3.6 Founding year
- **Not stated anywhere** in the bundle or API. I searched for "founded", "since", "established" and the years 2018–2021.
- The earliest dated item is the news story "October 12, 2022".

### 3.7 Leadership and team
Home `#team`, from API `ourteamInfo.php`.
- Heading "Our Team". Description: "Meerana's passionate Team brings together expertise and experience from across the technologies."

| Name (verbatim) | Title (verbatim) | Photo | LinkedIn |
|---|---|---|---|
| "Eng. Matar Al Mehairi" | "Founder & CEO" | team-01.webp | `https://www.linkedin.com/in/mataralmehairi?...` |
| "Mohammed Youssry" | "Digital Solution Partner" | youssry.webp | `https://www.linkedin.com/in/mohamed-elsaady-8a8311151?...` (the URL slug reads "mohamed-elsaady", which differs from the displayed name) |

Related news item (July 2023): "CEO contribution as deputy chairman of UAE innovation association".

### 3.8 Locations and offices

| Location | Exact wording / data | Source | Rendered? |
|---|---|---|---|
| Dubai | Globe label "Dubai" (lat 25.187556, lng 55.270491) | location/index.js, bundle @1,478,713 | Yes, globe in the Contact section, **large screens only** (`hidden lg:block`) |
| London | Globe label "London" (51.527149, −0.088755) | same | Yes (lg+) |
| Egypt | Globe label "Egypt" (30.250562, 29.204102) | same | Yes (lg+) |
| Chennai | Globe label "Chennai" (13.107527, 80.295538) | same | Yes (lg+) |
| Dubai address | "#1704, Blue Bay Tower, Business Bay, Dubai, UAE" | Privacy policy, twice | Yes (/privacy) |
| Dubai | Chatbot: "Meerana Technologies is located in Dubai, United Arab Emirates. Feel free to contact us at info@meerana.ae for office inquiries or meetings." | chatbot fallback @1,588,002 | Yes (chat) |
| Dubai | `locationInfo` id 1, country "Dubai": Google Maps embed place "Blue Bay Tower - Business Bay - Dubai - United Arab Emirates" (URL-decoded from the embed URL) | API | **No** (fetched, never rendered) |
| India | `locationInfo` id 2, country "India": embed place name "Meerana Technologies LLP" (URL-decoded) at 13.1076, 80.2929 (Chennai) | API | **No** |
| UK | `locationInfo` id 4, country "UK": embed place "128 City Rd, London EC1V 2NX, UK" (URL-decoded) | API | **No** |
| Kenya, Rwanda | News: "MEERANA's strategic expansion into Kenya and Rwanda" (Novemeber 15, 2023 [sic]) | API latestnews | Yes (news) |
| KSA / Saudi Arabia | **Not mentioned.** "Saudi Arabia" appears only in country dropdowns. | n/a | n/a |

`locationInfo` ids run 1, 2, 4; id 3 is missing **(uncertain: possibly a deleted Egypt entry)**.

### 3.9 Contact details
- **Email:** `info@meerana.ae`. It appears as plain text on the privacy page ("Email: info@meerana.ae") and in chatbot answers. **There is no `mailto:` link anywhere.**
- **Phone:** **none** on the site. The privacy policy source contains a commented-out placeholder `{/* Phone: [Phone] */}`. There are no `tel:` links.
- **Address:** "#1704, Blue Bay Tower, Business Bay, Dubai, UAE" (privacy policy only).
- **Contact section intro** (API `contactusinfoInfo`): "Reach out effortlessly! Our dedicated team is ready to assist. Contact us for inquiries, support, or \ncollaboration. Your satisfaction matters!" The `\n` is a line break in the data.

### 3.10 Social and media links
- Instagram (footer): `https://www.instagram.com/meeranatechnologies`
- Instagram (gallery scraper target): `https://www.instagram.com/meerana.technologies/`. **This is a different handle**; see §17.
- LinkedIn: `https://www.linkedin.com/company/meerana`
- X/Twitter: `https://x.com/MeeranaTech1`
- YouTube embed: `VRD8hzICcYQ` (Dubai Chambers channel)
- No Facebook, TikTok or YouTube channel link.

---

## 4. Company figures and statistics

### 4.1 Requested company statistics: **NOT PRESENT on the live site**
I searched the bundle and all API responses for:
- "locations", "professionals", "alliances", "clients", "projects", "years"
- "5+", "60+", "40+", "50+"

**There are no company-level statistics anywhere.** That means no headcount, number of locations, alliances, clients, projects or years in business. If such numbers exist, they are probably in the unreviewed profile PDF (§0.3).

### 4.2 Numeric or quantified claims that ARE rendered

| Claim (verbatim) | Where |
|---|---|
| "10x Faster Processing" | Nazoo hero badge |
| "100% Secure & Compliant" | Nazoo hero badge |
| "70%", "Faster Time to Model", "Reduce process modeling time by up to 70%" | Tasree3 "Drive Better Outcomes" |
| "100%", "End-to-End Visibility", "Get full transparency across all workflows" | Tasree3 outcomes |
| "Reduced asset retrieval and lookup times by 90%" | Asset Tracking benefits list |
| "Auto-Close configured for 60 seconds. Uses BLE Local Key fallback mode automatically if Wi-Fi goes offline." | Wasel phone mock-up |
| Mock dashboard figures | Yisbir: "24,331", "8,432", "68,642", "98.6%", "Person 99.2%", "Vehicle 95.8%", "124", "37", "62%", "842 Workers on-site", "19". Nazoo: "12,842", "2,139", "321", "10,382". Asset Tracking: "12,548", "11,453", "32", "87%". Tasree3: "Auto Match: 99.8%", "24% delay". **All are illustrative UI mock-ups, not company claims.** |

### 4.3 Statistics in the bundle but **NOT rendered**
These are `stats` arrays in the product configs. No code ever reads `.stats`, but the text ships in the public bundle. **Do not treat them as live claims or as evidence.**

| Product | Config `stats` (verbatim) | Offset |
|---|---|---|
| Mandoobee | "512+" "Active Organizations"; "50K+" "Happy Users"; "99.9%" "Uptime & Reliability"; "24/7" "Dedicated Support" | @1,835,040 |
| Yisbir | "99.2%" "AI Detection Accuracy"; "10M+" "Hours of Videos Processed"; "500+" "Cameras Supported"; "24/7" "Real-Time Processing" | @1,852,027 |
| Tasree3 | "70%" "Modeling Speedup"; "100%" "Process Visibility"; "Zero" "Manual Mapping Errors"; "Continuous" "Optimization Cycle" | @1,882,447 |
| Nazoo | "10x" "Faster Processing"; "100%" "Secure & Compliant"; "Zero" "Manual Follow-ups"; "End-to-End" "Process Visibility" | @1,903,567 |
| Wasel | "99.9%" "System Uptime"; "BLE" "Offline Fallback"; "256-bit" "AES Encryption"; "<1s" "Response Delay" | @1,925,671 |
| Asset Tracking | "12,548" "Total Assets Tracked"; "99.8%" "Accuracy Rate"; "-18%" "Loss Reduction"; "87%" "Asset Utilization" | @1,943,784 |
| Mandoobee `trustedBy` | "TechSolutions", "InnoWave", "DigitalCorp", "NextGen", "AlphaSoft", "CloudSync". **These are placeholder company names and are not rendered.** | @1,832,903 |

### 4.4 Counts derived from the live data (my counting, not site wording)
- 32 partner/client logos on /partners; the first 4 also appear on the home page.
- 2 team members.
- 13 news items.
- 4 globe locations.
- 4 solution categories containing 24 sub-solutions in the API (5 + 11 + 6 + 2), of which 23 are visible because Smart Office is hidden.
- 5 course providers and 4 courses.

---

## 5. Services and business pillars

### 5.1 Solutions as shown on the home page and in the navbar
Home section heading **"Solutions"** (`#solution`). There are 4 cards (API `solutionInfo.php`); each has an image, a title, a bullet list cut to the first 410 characters of HTML, and a **"Read More"** button that goes to `/construction?id=N`.

| id | Card title | Image | Bullets as rendered on the card |
|---|---|---|---|
| 1 | "Consultation" | solu-img-01.webp | "Data Management", "Data Center", "Customer Experience & Happiness", "Digital Transformation", "Enterprises Architecture" [sic] |
| 2 | "Bespoke Products" | solu-img-02.webp | "Erp Solution", "Data Services", "Software Development", "Cloud Services", "Robotic Process Automation", "E Commerce", "Metaverse, Blockchain & AI". The 410-character cut hides "Cyber Security", "IOT Application & Solution" and "Digital Connect". |
| 3 | "Our Unique Products" | solu-img-03.webp | "Smart Office Application" is **removed in code**, which probably leaves an empty first bullet **(inference)**. Then: "Hi Legal Management Apllication" [sic], "Real Estate & E-Commerce Application", "EV Charger", "Green Hub", "Warehouse Management" |
| 6 | "Managed Services" | construct-03.webp | "Reselling Hardware & Software", "Staff Augmentation" |

All four categories in the API share the **same** `subTitle`, which is shown on each detail page:
> "We offer a vast range of high quality products that help us stand out in the market and make us the most trusted community."

Each detail page (`/construction?id=N`) shows:
- the breadcrumb "Home / Solutions / {title}", the H1 and the subTitle;
- then, for each sub-solution: its title, its description, a **"Key Features"** list (only when there is more than one feature) and its image.

The code hides any sub-solution titled "Smart Office Application" or "Smart Office Solution".

### 5.2 Consultation (`solutionInfo.php?id=1`)

| Sub-solution | Description (verbatim) | Key Features (verbatim) | Image |
|---|---|---|---|
| "Data Management" | "Consultation services for data management offer expert guidance and strategies to optimize an organization's data handling practices." | "Expert guidance for tailored data strategies"; "Robust data governance establishment"; "Optimization of data architecture"; "Enablement of advanced data analytics"; "Smooth data migration services" | construct-02.webp |
| "Data Center " | "Consultation services for data centers offer expertise in designing, optimizing, and managing data center infrastructure" | "Design and layout optimization"; "Infrastructure efficiency enhancement"; "Energy-efficient practices"; "Hardware and software integration"; "Security and compliance measures"; "Disaster recovery strategies"; "Virtualization and cloud integration"; "Cost-saving recommendations"; "Business-aligned infrastructure" | construct-03.webp |
| "Customer Experience and Happiness" | "Consultation services for customer experience and hapiness [sic] focus on enhancing interactions and satisfaction. Key areas of expertise include" | "Customer Journey Mapping"; "Feedback Analysis"; "Personalization Strategies"; "Multi-channel Consistency"; "Employee Training"; "Effective Issue Resolution"; "Data-driven insights"; "Continuous improvement"; "Enhanced satisfaction and loyalty" | construct-04.webp |
| "Digital Transformation" | "Digital transformation is the strategic adoption of technology to revolutionize business processes and enhance customer experiences in an increasingly digital world." | "Technology Assessment"; "Strategic Planning"; "Change Management"; "Implementation Support" | construct-05.webp |
| "Enterprise IT Architecture" | "Consultation services for enterprise IT architecture offer expertise in designing, optimizing, and managing IT infrastructure. Key areas of focus include" | "Efficient architecture design"; "Seamless technology integration"; "Scalable and flexible systems"; "Robust security and compliance"; "Cloud adoption and management strategy"; "Legacy system modernization"; "Disaster recovery and business continuity planning"; "Cost optimization"; "Future-ready IT framework" | construct-06.webp |

### 5.3 Bespoke Products (`solutionInfo.php?id=2`)

| Sub-solution | Description (verbatim) | Key Features (verbatim) | Image |
|---|---|---|---|
| "ERP Solution" | "An ERP (system integrating core business processes, data, and operations into a unified platform for enhanced efficiency, productivity, and decision-making." [sic, unbalanced parenthesis] | "HR System"; "Finance System"; "Procurement System"; "Supplier Management"; "Client Management" | bespoke-01.webp |
| "Data Services" | "Data services encompass a range of solutions for collecting, managing, analyzing, and interpreting data to drive insights, informed decision-making, and business growth." | "Data Visualization"; "Ai & Machine Learning"; "Reports & Dashboards"; "Big Data Management" | bespoke-02.webp |
| "Software Development" | "Software development is the art of transforming ideas into functional and innovative computer programs." | "Cross Platform Application Development"; "Website Development"; "Desktop Applications" | bespoke-03.webp |
| "Cloud Services" | "It provide on-demand access to scalable and virtualized computing resources, enabling efficient storage, processing, and delivery of data and applications over the internet." | "Cloud Deployment"; "Cloud Optimization" | bespoke-04.webp |
| "Robotic Process Automation" | "RPA automates repetitive tasks and processes using software robots, enhancing productivity and accuracy while reducing manual effort and errors." | "Process Automation"; "Process re-engineering"; "Process Architecture Designs" | bespoke-05.webp |
| "E-Commerce" | "E-commerce platform facilitating online buying and selling of products or services, providing a convenient and accessible marketplace for businesses and consumers." | "Order Management"; "Cart Management"; "Admin Reports & Dashboards"; "Payment System"; "Product Management" | bespoke-06.webp (2,265,034 B) |
| "Metaverse, Blockchain and AI" | "Blockchain is a distributed, immutable, and transparent digital ledger technology that enables secure and verifiable transactions across multiple parties without the need for intermediaries." | "Digital Wallets"; "NFT"; "Crypto Currencies" | bespoke-07.webp |
| "Cyber Security" | "Cybersecurity measures safeguarding digital systems, networks, and data from unauthorized access, threats, and breaches to protect against cyber threats." | "Penetration Testing"; "Cross Platform Application Testing"; "Desktop Application Testing"; "Website Testing" | bespoke-08.webp |
| "IOT Application & Solutions" | "Bespoke products and services in IoT hardware and software refer to tailored solutions designed to meet specific needs in the Internet of Things (IoT) ecosystem. These offerings encompass customized IoT devices, sensors, and software applications that are developed to address unique challenges and opportunities in various industries. The emphasis is on flexibility, scalability, and integration, ensuring seamless connectivity, data collection, analysis, and control. By providing personalized IoT solutions, businesses can optimize their operations, enhance decision-making, and gain a competitive edge in the rapidly evolving IoT landscape." | `[""]`, so no Key Features block renders | bespoke-09.webp |
| "Digital Connect" | "The Unification of modes of communication allow a shared experience across customer’s preferred channels of\r\ncommunication\r\n" | "Mobile & Web"; "KIOSK"; "Virtual Branch"; "Voice & Speech"; "Contact Center"; "Relationship Managers" | bespoke-10.webp |
| **"VOC Solution Using Gen AI"** | "Capabilities you need in any VoC Solution in this GenAI era" | "Live Integration"; "Feedback Monitoring"; "Sentiment Analysis"; "Actionable suggestions"; "Intelligent Governance"; "AI-Powered Workflow"; "Chatbot/Generative AI"; "E-Ticketing system" | bespoke-11.webp |

VOC appears only on this detail page; it is **not** in the card or category bullet list.

### 5.4 Our Unique Products (`solutionInfo.php?id=3`)

| Sub-solution | Description (verbatim) | Key Features (verbatim) | Image | Shown? |
|---|---|---|---|---|
| "Smart Office Application" | "A smart office application enabling seamless collaboration, smart scheduling, and efficient task management for enhanced productivity and workplace efficiency." | "GPS Clock In \| Out"; "Admin Dashboard & Reports"; "Asset Management"; "Project Management"; "Document Management"; "Task Management"; "Meeting Management" | unique-01.webp | **Hidden by code** (filtered out of both the card and the detail page) |
| "Hi Legal Management Application" | "A legal management application streamlining legal workflows, document management, and case tracking for efficient law practice management." | "Litigation Case Management"; "Document & Contracts Management"; "Task Management"; "Meeting Management" | unique-02.webp | Yes |
| "Real Estate & E Commerce Application" | "A real estate application empowering users to seamlessly search, buy, sell, and manage properties with comprehensive listings, interactive maps, and personalized features." | "Land Selling/Buying"; "Property Selling/Buying"; "Admin Portal with Reports & Dashboards"; "Client Portal with end-to-end Land acquisition" | unique-03.webp | Yes |
| "EV Charger" | "An EV charger providing fast, convenient, and eco-friendly charging solutions for electric vehicles, promoting sustainable transportation." | "Type 1 chargers"; "Type 2 chargers"; "CHAdeMO chargers"; "GB/T Chargers" | unique-04.webp | Yes |
| "Green Hub" | "A green hub serving as a sustainable ecosystem fostering environmental awareness, innovation, and collaboration towards a greener future." | "EV Charging Station"; "Donation Boxes"; "Locker Systems"; "Converter chargers"; "Plants & Food Corner" | unique-05.webp | Yes |
| "Warehouse Management" | "Warehouse management system optimizing inventory control, logistics, and operations for streamlined storage, efficient order fulfillment, and improved supply chain management." | "Automated Sortation system"; "Overlapping Process"; "Master Data"; "Inbound and Outbound"; "Inventory Management"; "Logistic Management"; "Finance Management"; "Order Management" | unique-06.webp | Yes |

### 5.5 Managed Services (`solutionInfo.php?id=6`)

| Sub-solution | Description (verbatim) | Key Features (verbatim) | Image |
|---|---|---|---|
| "Reselling Hardware & Software" | "Procurement, installation and annual maintenance of Hardwares.\r\nAnalysis, licensing, implementation and annual maintenance of Softwares" | "Computer, all in one pc, business laptops, school laptops etc.."; "Agilepoint - No Code Low Code"; "Kofax - Robotic Automation Platform"; "Commvault - Data Security & Back up Platforms"; "Confluent - Data Streaming Platform"; "Software AG - Seamless integration of data, applications, processes, devices and clouds"; "SAP Ariba, S/4 Hana, Business  By design, Business One, C4C, Success Factors" | managed-01.webp |
| "Staff Augmentation" | "Supercharge Your IT Team with Expert Staff Augmentation!" | "Access a pool of highly-skilled tech professionals."; "Get the right talent at the right time, no long-term commitments."; "Rapidly scale your team to tackle big projects with ease."; "Stay focused on innovation while we handle staffing logistics."; "Flexible, cost-effective, and tailored to your unique needs." | managed-02.webp |

### 5.6 Meerana Accelerator (`/accelerator`, unlinked; bundle @1,571,639)
- Breadcrumb "Home / Solutions / Accelerator"; H1 **"Meerana Accelerator"**.
- Intro: "We've helped countless startups navigate their journey to success through our tailored consulting services, expert guidance, and support"
- **"Green Hub"**: "A green hub serving as a sustainable ecosystem fostering environmental awareness, innovation, and collaboration towards a greener future."
  - "Features": "EV Charging Station", "Donation Boxes", "Locker Systems", "Converter chargers", "Plants & Food Corner"
  - Image `/assets/greenhub.webp`
- **"Remotioo Smart Gate"**: "The First end to end encripted [sic] Wi-Fi and bluetooth  enabled smart remote controller that let you control and monitor your gates and garage doors using your smartphone"
  - Image `/assets/remotioo.webp`

### 5.7 Chatbot fallback descriptions of services (live; bundle @1,581,853–1,587,209)
Each answer ends with "For more info or inquiries, please contact us at info@meerana.ae or fill out the Contact Us form below!", which is omitted from the quotes below.

| Trigger keyword(s) | Answer (verbatim) |
|---|---|
| data management | "Consultation services for data management offer expert guidance and strategies to optimize an organization's data handling practices." |
| data center | "Consultation services for data centers offer expertise in designing, optimizing, and managing data center infrastructure." |
| customer experience / happiness | "Consultation services for customer experience and happiness focus on enhancing interactions and satisfaction." |
| digital transformation | "Digital transformation is the strategic adoption of technology to revolutionize business processes and enhance customer experiences in an increasingly digital world." |
| enterprise it / architecture | "Consultation services for enterprise IT architecture offer expertise in designing, optimizing, and managing IT infrastructure." |
| erp | "An ERP system integrating core business processes, data, and operations into a unified platform for enhanced efficiency, productivity, and decision-making." |
| software development / software | "Software development is the art of transforming ideas into functional and innovative computer programs across web, mobile, and desktop." |
| cloud | "Cloud services provide on-demand access to scalable and virtualized computing resources, enabling efficient storage, processing, and delivery of data over the internet." |
| rpa / robotic process | "Robotic Process Automation (RPA) automates repetitive tasks and processes using software robots, enhancing productivity and accuracy." |
| ecommerce / e-commerce | "E-commerce platforms facilitating online buying and selling of products or services, providing a convenient and accessible marketplace." |
| blockchain / metaverse / ai | "Blockchain, Metaverse, and AI solutions enable secure, verifiable digital transactions and intelligent automated applications." |
| cyber / security | "Cybersecurity measures safeguarding digital systems, networks, and data from unauthorized access, threats, and breaches." |
| iot | "Bespoke products and services in IoT hardware and software refer to tailored solutions designed to meet specific needs in the Internet of Things ecosystem." |
| voc / gen ai | "Voice of Customer (VOC) Solution using Generative AI provides live integration, sentiment analysis, feedback monitoring, and actionable suggestions." |
| smart office | "A smart office application enabling seamless collaboration, smart scheduling, GPS clock in/out, and efficient task management." |
| legal | "A legal management application streamlining legal workflows, document management, litigation case tracking, and contract management." |
| real estate | "A real estate application empowering users to seamlessly search, buy, sell, and manage properties with comprehensive listings and personalized features." |
| ev charger / green hub | "Eco-friendly charging solutions for electric vehicles and sustainable green hubs fostering environmental innovation." |
| warehouse | "Warehouse management system optimizing inventory control, logistics, and inbound/outbound operations for streamlined storage." |
| staff augmentation | "Supercharge your IT team with expert staff augmentation, accessing top tech professionals tailored to your unique project needs." |
| contact / email / phone / reach | "You can reach our dedicated team directly at info@meerana.ae or fill out our Contact Us form below. We will get back to you promptly!" |
| career / job / hiring / vacancy | "We are always looking for passionate talent to join our team! Please check our Careers section on the website or reach us at info@meerana.ae." |
| product / service / offer | **"Meerana Technologies offers a suite of enterprise solutions including Mandoobee (PRO Automation), Tasree3 (Digital Transformation), NAZO (Document Management), Wasel (Logistics), Yisbir (AI HR), Zing HR, ERP, IoT Asset Tracking, and Cloud Services. For more info on any product, feel free to contact us at info@meerana.ae or submit our Contact Us form below!"** (@1,588,211). See §17. |
| hello / hi / hey / greetings | "Hello! How can I assist you with Meerana products or services today?" |
| (default) | "Thank you for reaching out! For detailed inquiries about our products and services, please contact us at info@meerana.ae or fill out our Contact Us form below." |

**Keyword-order bug (inference from code):** the checks run in order and use substring matching. "hr" matches inside words such as "through", and "ai" matches inside "email", "detail" and similar. Many questions will therefore get the Zing HR answer or the Blockchain/Metaverse/AI answer by mistake.

### 5.8 Requested pillar names compared with the live site

| Requested pillar | Live-site wording |
|---|---|
| Consulting / consultation | "Consultation" (category id 1); "consulting services" (Accelerator) |
| Outsourcing / staff augmentation | "Staff Augmentation" (Managed Services). The word **"outsourcing" is not used.** |
| Hardware & software reselling | "Reselling Hardware & Software" (Managed Services) |
| Bespoke solutions / products | "Bespoke Products" (category id 2) |
| Managed services | "Managed Services" (category id 6). Its only contents are reselling and staff augmentation. |
| Unique products | "Our Unique Products" (category id 3) |
| FinTech | **Not found.** The closest items are "Metaverse, Blockchain and AI" (Digital Wallets, NFT, Crypto Currencies) and "Digital Connect" (Virtual Branch, KIOSK…). |
| Visitor management | **Not found as a product.** Only the phrase "visitor passes" appears, in a Wasel use case. |
| HR tech / ZingHR | "Zing HR" (contact dropdown; chatbot: "We provide Zing HR integration for comprehensive human capital management, payroll automation, leave tracking, and employee self-service."). Also Mandoobee "People & HR". |
| Voice of Customer | "VOC Solution Using Gen AI" (Bespoke Products detail page); chatbot VOC answer. "Voice Assistance" in the contact dropdown is **(uncertain)** whether it is the same thing. |
| Sustainability / green | "Green Hub" (Unique Products and Accelerator); "EV Charger". The word "sustainable" appears only in those descriptions. |

---

## 6. Products

### 6.0 Name and spelling matrix (every occurrence)

| Product | Route | Page H1 / config name | Contact dropdown | Chatbot keyword list | Chatbot product description | Chatbot "suite" label | Media file names | Other spellings |
|---|---|---|---|---|---|---|---|---|
| Mandoobee | `/mandobee` | "Mandoobee" | "Mandoobee" | mandobee, mandoobee, mandobe, mandoobe | Mandoobee | "Mandoobee (PRO Automation)" | mandoobee_video.mp4 | "Mandobee": route, `getProductRoute` keyword, and a commented nav item "New Mandobee". **"Mandoobi" is not found.** |
| Yisbir | `/yisbir` | "Yisbir" | "Yisbir" | yisbir, yisbeer, yasbir, yisbr | **talent acquisition** (contradicts the page) | "Yisbir (AI HR)" | yisbir.mp4, yisbir_cover_banner.png | none |
| Tasree3 | `/tasree3` | "Tasree3" | "Tasree3" | tasree3, tasree, tasre3 | process mining | "Tasree3 (Digital Transformation)" | **tasree.mp4**, tasree3_cover_banner.png | "T3" (badge on the orbit graphic). **There is no link to tasree3.ae anywhere.** |
| Nazoo | `/nazoo` | "Nazoo" | **"NAZO"** | nazoo, nazo, naazoo, correspondence | Nazoo | **"NAZO (Document Management)"** | **nazo.mp4**, nazoo_cover_banner.png | none |
| Wasel | `/wasel` | "Wasel" (descriptions use **"WASEL"**) | "Wasel" | wasel, wasal, wassel | WASEL gate/access | **"Wasel (Logistics)"** | wasel.mp4, wasel_cover_banner.png | none |
| Asset Tracking | `/asset-tracking` | "Asset Tracking", but the same page also says **"Smart Tracking"** | "Asset Tracking" | asset, tracking | Asset Tracking | "IoT Asset Tracking" | asset_tracking_cover_banner.png; no video | "ST" (orbit graphic) |
| Zing HR | none | none | "Zing HR" | zing, hr | Zing HR integration | "Zing HR" | none | "ZingHR" (one word) not used |
| Voice Assistance | none | none | "Voice Assistance" | none | none | none | none | **(uncertain)** whether this means VOC |

No product page links to an app store, and no product has an external website link; neither "apps.apple" nor "play.google" appears anywhere. All product pages share one template:
- breadcrumb "Home / Solutions / {name}", an H1 with the name, a tagline and a category pill;
- hero badges, an H1 with a highlighted phrase, a description and a cover image;
- the buttons "Explore …" and "Watch Video" (Asset Tracking has no video);
- a coded mock-up, then the sections described below.

The demo-request handlers and email alerts in the source map were **removed by the minifier**, so they are not live (§18).

### 6.1 Mandoobee (`/mandobee`; config @1,832,268, fn `pU` @1,835,214)

**Header and hero**
- Tagline: **"AI-Powered Workplace Platform"**. Pill: **"Smart Office Solution"**.
- Badges: "AI-Powered", "Secure", "Scalable", "Enterprise Ready".
- Hero H1: "The Future of Work is" + "Intelligent."
- Hero description: **"Mandoobee brings HR, projects, documents, communication and AI together in one unified platform to help your organization move faster, smarter and better."**
- Buttons: "Explore Mandoobee" (→ #features), "Watch Video" (opens `/assets/mandoobee_video.mp4`, 32,445,796 B).
- Mock-up image: `/assets/smart-office-app.png`, alt "Mandoobee Dashboard Mockup". This is the same Smart Office app screenshot. Text visible in the image:
  - "Welcome Mohmmaed", "My Business Card", "En | Ar", "Working Hours - 09h : 30m Today", "18 Nov 2024", "CEO Dashboard", "Total WorkForce";
  - service tiles "Smart Attendance", "Smart Services", "Meeting Calendar", "My Project", "My Task", "Smart Document", "MOM", "Knowledge Hub", "Shared Folder", "Links & Videos".

**Comparison section**
- "The Reality" / "Too Many Tools. Not Enough Productivity."
  - Pain points: "Switching between multiple apps"; "Delays in approvals and communication"; "No real-time visibility or insights"; "Repetitive manual tasks".
  - Footnote: "Unintegrated systems lower team morale and overall output."
- "Mandoobee is Different" / "AI Built In. Intelligence Everywhere."
  - "Mandoobee is not just another software. It's an intelligent workplace that thinks, assists, and automates—so your teams can focus on what truly matters."
  - Button "See It In Action" (→ home #contact).

**Features: "Powerful Capabilities for Modern Teams" / "Everything you need, all in one place."**
- "People & HR": "Manage employees, attendance, leaves, requests and more with complete automation."
- "Work & Projects": "Plan, assign and track tasks. Manage projects and deliver results, every time."
- "Documents & Knowledge": "Smart document workflows, shared folders, OCR, PDF tools and more."
- "Communication": "Chat, groups, announcements and directories to keep your team connected."
- "AI Intelligence": "AI assistant, document Q&A, contract review, smart notes and powerful AI tools."

**Benefits: "Key Benefits" / "Why choose Mandoobee for your business?"**
- "Unified office operations in one platform"
- "Reduced manual work and paper-based processes"
- "Faster approvals, communication, and task execution"
- "AI-powered document handling and office assistance"
- "Improved HQ, payroll, workflow, and support visibility" ["HQ" is probably a typo for "HR", **(uncertain)**]
- "Flexible deployment: on-premise, cloud, or hybrid"
- "Bilingual support: Arabic and English"
- "White-labeling, customization, and third-party integrations"

**Graphic:** orbit labels "AI", "HRMS", "IoT", "Projects"; centre letter "M".

**Elsewhere on the site**
- Chatbot: "Mandoobee brings HR, projects, documents, communication and AI together in one unified platform to help your organization move faster, smarter and better. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!" Suite label: "Mandoobee (PRO Automation)".
- Not rendered: `trustedBy` placeholders and `stats` (§4.3).
- **(inference)** Mandoobee is the renamed "Smart Office Application". It uses the same screenshot and the "Smart Office Solution" pill, and the code hides "Smart Office Application" from the solutions list.

### 6.2 Yisbir (`/yisbir`; config @1,847,762, fn `SU` @1,852,216)

**Header and hero**
- Tagline: **"AI-Powered Video Analytics & Indexing"**. Pill: **"Video Analytics Solution"**.
- Badges: "AI-Powered", "Scalable", "Secure", "Accurate", "Real-Time".
- Hero H1: "Turn Every Video into" + "Intelligent Data."
- Description: **"Yisbir uses advanced AI to analyze, index, and understand videos—so you can find anything, faster, unlock insights, and take action in real time."**
- Cover `/assets/yisbir_cover_banner.png` (1,062,128 B), alt "Yisbir Site Intelligence Cover". Visible in the image (from the local copy): a camera labelled **"SENTINEL AI-V12 | SITE MONITOR"**, overlays "SAFETY COMPLIANCE", "SITE SAFETY INDEX: 94%", "PPE ADHERENCE: 98%" and "TIMESTAMP: 20:14:32 (GMT+8)". The image looks AI-generated **(inference)** and is **not Yisbir-branded**.
- Buttons: "Explore Solutions" (→ #construction), "Watch Video" (`/assets/yisbir.mp4`, 27,845,919 B).

**Mock console**
- "Yisbir Video AI Console v2.4" · "Live System Connected"
- Side menu: "🎥 Video Streams", "🔍 Smart Search", "📊 Analytics Reports", "🚨 Real-time Alerts", "⚙️ Admin Panel"
- Tiles: "Total Videos 24,331 ↑ 12.5%", "Total Hours 8,432 ↑ 18.7%", "Events Detected 68,642 ↑ 23.4%", "AI Accuracy 98.6% ↑ 2.4%"
- Video panel: "Person 99.2%", "Vehicle 95.8%", "Camera_04_HSE_Zone", "Rec", "Simulating Active Stream Video Indexing..."
- "Recent Activity": "Unsafe Work Practice / Camera 03 • 2m ago"; "PPE Violation Alert / Camera 01 • 5m ago"; "Perimeter Secure / Gate Access • 12m ago"; "Updated real-time"

**Industries ribbon:** "One Platform. Infinite Possibilities." followed by "Smart Cities", "Retail", "Transportation", "Banking", "Manufacturing", "Healthcare", "Education", "Energy", "Hospitality".

**"Why Yisbir": "See More. Know More. Act Faster."**
- "Yisbir converts your videos into searchable, actionable intelligence with AI that works for any industry and every use case."
- "AI Video Indexing": "Automatically index videos by objects, people, actions, locations, and more."
- "Smart Search": "Find any moment instantly with natural language search."
- "Actionable Insights": "AI-driven analytics and dashboards that help you make smarter decisions."
- "Real-Time Alerts": "Detect events, anomalies, and get notified in real time."

**Construction module (`#construction`)**
- Label "Yisbir for Construction & Infrastructure"; H2 **"AI-Powered Construction Site Intelligence Platform"**; line "Transforming CCTV Cameras into Safety, Compliance & Operational Intelligence Tools". Image alt "Construction AI Monitoring".
- "Automatic HSE Detections":
  - "Missing Safety Helmets": "Identify workers without required head protection."
  - "Missing Safety Vests": "Detect PPE violations in active work zones."
  - "Unsafe Work Practices": "Monitor risky behavior and unsafe site activity."
  - "Restricted Zone Entry": "Alert teams when workers enter hazardous areas."
  - "Fall & Incident Detection": "Detect falls, accidents, and emergencies."
  - "Workers in Hazardous Areas": "Track workers near hazards and danger zones."
- "Key Benefits": "Improve Worker Safety", "Strengthen HSE Compliance", "Reduce Site Risks", "Enhance Security", "Accelerate Incident Investigations", "Improve Project Visibility".

**Security: "Site Security & Asset Protection" / "Protect people, equipment & project assets with AI intelligence"**
- "Detect Threats": "Unauthorized Site Access", "Intrusions After-Hours", "Perimeter Breaches", "Suspicious Behavior & Vandalism"
- "Monitor Areas": "Entry & Exit Gates", "Storage Areas & Equipment Yards", "Material Warehouses", "Temporary Worker Camps"
- "Protect Assets": "Equipment & Material Theft", "Vehicle Movement Anomalies", "Enhanced Access Control", "Improved Site Visibility"

**"Smart Investigations": "Find. Verify. Act."**
- "AI-powered search across live & recorded video to investigate any incident in seconds."
- "Search by Person Attributes": "Clothing color, helmet color, vest color, gender, etc."
- "Search by Vehicle Details": "Vehicle type, color, license plate number, etc."
- "Search by Location": "Select any zone, gate, area, or camera."
- "Search by Date & Time": "Find exact moments across timelines."
- Mock "Unified Command Center":
  - "PPE Violations 124 / Active warning status"
  - "Safety Alerts 37 / ↑ 18% vs yesterday"
  - "Site Occupancy 62% / 842 Workers on-site"
  - "Security Alerts 19 / Active perimeter tracking"
  - "Business Outcomes: Safer Worksites • Stronger Security • Faster Incident Investigation"

**"Powerful Capabilities": "Everything You Need from Your Videos"**
- "Object & Motion Detection": "Detect and track objects, people, vehicles, and activities."
- "Facial Recognition": "Identify and match faces across cameras in real time."
- "Video Summarization": "AI creates short summaries of long videos automatically."
- "Metadata Extraction": "Extract valuable metadata including text, license plates, logos, and more."
- "Scene Change Detection": "Automatically detect scene changes and key moments."
- "Cross-Camera Search": "Search across multiple cameras and locations in seconds."

**Chatbot (contradicts the page):**
- "Yisbir is an AI-powered talent acquisition and smart recruitment matching platform designed to streamline enterprise hiring. For more information or to request a live demo, please contact us at info@meerana.ae or fill out the Contact Us form below!" (@1,581,290)
- Suite label "Yisbir (AI HR)".

### 6.3 Tasree3 (`/tasree3`; config @1,878,196, fn `RU` @1,882,630)

**Header and hero**
- Tagline: **"AI-Assisted Process Mining & Process Engineering"**. Pill: **"AI Process Intelligence"**.
- Badges: "AI-Powered BPM Platform", "Data-Driven", "Secure", "Enterprise-Ready".
- Hero H1: "Design Smarter. Optimize Faster." + "Transform Continuously."
- Description: **"Tasree3 is an AI-assisted process mining and process engineering platform that helps organizations design, analyze, optimize, and improve business processes through intelligent workflow discovery, visual modeling, performance insights, and AI-powered recommendations."**
- Cover `/assets/tasree3_cover_banner.png`, alt "Tasree3 Process Mining Cover". The image shows a monitor headed **"BPM INSIGHTS | AI-POWERED OPTIMIZATION | GLOBAL OPERATIONS"**. Some smaller text is garbled; it reads approximately "Costoiner Chaut", "Autemation Rate" and "Order Yolame". It looks AI-generated **(inference)** and is not Tasree3-branded.
- Buttons: "Explore Capabilities", "Watch Video" (`/assets/tasree.mp4`, 8,352,369 B).

**Mock simulator: "Visual Process Modeling Simulator" / "AI-Powered BPM"**
- "Step 1 · Order Received · Trigger Event"
- "Step 2 (AI Decision) · Validate Order · Auto Match: 99.8%"
- "Step 3 · Check Inventory · API Dispatch"
- "End State · Order Completed · Process Resolved"
- "💡 Process Mining Insight: AI detected a 24% delay in manual approvals on Step 2. Auto-optimization enabled."

**What is it**
- Label "What is Tasree3?"; H2 "Next-Generation Process Excellence".
- "Tasree3 is a next-generation process excellence platform that enables organizations to understand how their processes actually work, model improved workflows, analyze performance, and apply AI-driven recommendations for continuous operational improvement."

**"Core Features & Services": "Everything You Need for Modern Process Management"**
- Subtitle: "Streamline workflows, discover bottlenecks, and drive continuous improvement."
- "Automatic Process Discovery": "Generate workflows from operational data automatically."
- "Visual Process Modeling": "Build process diagrams with intuitive drag-and-drop tools."
- "AI-Powered Optimization": "Get AI recommendations to improve workflows and reduce cycle times."
- "Performance Insights": "Identify bottlenecks, delays, and process gaps with real-time analytics."
- "Instant Reports": "Generate complete, audit-ready process reports in seconds."
- "Real-Time Collaboration": "Enable teams to design and collaborate on processes across departments."
- "Smart AI Layer": "Use predictive insights to make smarter operational decisions."
- "Continuous Improvement": "Discover, analyze, optimize, and deploy improvements in an ongoing lifecycle."
- "Regional Readiness": "Full support for Arabic, RTL layouts, and regional business requirements."

**"Platform Value": "Key Benefits of Tasree3"**
- "All-in-one platform for process mining, modeling, and AI insights"
- "Faster process discovery and decision-making"
- "Reduced operational complexity and manual analysis"
- "Improved productivity through workflow optimization"
- "Lower cost compared to using multiple disconnected tools"
- "Better visibility into bottlenecks, delays, and inefficiencies"
- "Supports continuous improvement across departments"
- "Scalable for SMEs, enterprises, and government organizations"
- Orbit graphic: "AI Insights", "Modeling", "Mining", "Control"; centre "T3".

**"Industry Solutions": "Built for Every Industry"**
- "Manufacturing": "Streamline production and supply chain processes."
- "Banking & Finance": "Optimize approvals, compliance, and risk management."
- "Healthcare": "Enhance patient care and operational efficiency."
- "Government": "Improve transparency and service delivery with process control."
- "Enterprise": "Drive digital transformation and operational excellence."
- "And Many More": "Applicable across industries and business functions."

**"Operational Impact": "Drive Better Outcomes"**
- "70%" "Faster Time to Model": "Reduce process modeling time by up to 70%"
- "Continuous" "Improved Efficiency": "Identify inefficiencies and optimize processes"
- "100%" "End-to-End Visibility": "Get full transparency across all workflows"
- "Secure" "Risk & Compliance Assured": "Ensure compliance with strong automated governance"
- "Smarter" "Data-Backed Decisions": "Make decisions powered by real-time process mining"

**Chatbot:** repeats the hero description, followed by "For more information or to request a live demo…". Suite label "Tasree3 (Digital Transformation)".

**No external link** to tasree3.ae or any Tasree3 website exists in the bundle or API.

### 6.4 Nazoo (`/nazoo`; config @1,899,636, fn `qU` @1,903,747)

**Header and hero**
- Tagline: **"Correspondence & Workflow Management System"**. Pill: **"Correspondence Management"**.
- Badges: "AI-Powered Correspondence", "10x Faster Processing", "100% Secure & Compliant", "End-to-End Visibility".
- Hero H1: "Smarter Correspondence. Stronger Decisions." + "Zero Chaos."
- Description: **"Nazoo empowers organizations to initiate, manage, track, approve, sign, and archive internal and external communications through a secure digital platform."**
- Cover `/assets/nazoo_cover_banner.png` (788,323 B), alt "Nazoo Correspondence Cover". There is no local copy, so it was not viewed.
- Buttons: "Explore Features", "Watch Video" (`/assets/nazo.mp4`, 23,483,149 B).

**Mock dashboard: "Nazoo Workflow Dashboard" / "Live Activity Console"**
- Side menu: "Inbox (14)", "Templates", "Workflows", "Digital Vault"
- Tiles: "Total Letters 12,842 ↑ 18.5%", "In Progress 2,139 ↑ 12.3%", "Awaiting Action 321 ↓ 4.5%", "Completed 10,382 ↑ 22.1%"
- "Pending Correspondence Approval Queue":
  - "**Official Letter to ADIB Bank**", "Initiated by: Executive Admin Office", "Awaiting E-Sign"
  - "Inter-Departmental Circular: Q3 Policy", "Initiated by: Legal Compliance", "Reviewing Route"
  - ADIB is also among the partner logos.

**What is it**
- Label "What is Nazoo?"; H2 "Digital Correspondence & Workflow Excellence".
- "Nazoo is a digital correspondence platform that simplifies how organizations manage official communication, documents, approvals, templates, tracking, and archiving. It supports secure workflows from document initiation to review, approval, e-signature, status tracking, and final storage."

**"Core Features & Services": "Everything You Need. All in One Intelligent Platform."**
- Subtitle: "Automate your official correspondence lifecycle securely."
- "Inbox & Outbox Management": "Streamline and track incoming and outgoing official correspondence channels."
- "Template Management": "Standardize letters, circulars, and memos with a built-in pre-approved template library."
- "Correspondence Initiation": "Generate and send official documents, memos, and circulars instantly with AI assistance."
- "Workflow Management": "Automate approval chains, review routing, and task handoffs without manual bottlenecks."
- "Search & Filter": "Find any correspondence in seconds with smart metadata and OCR text search."
- "User Management": "Define custom access permissions, roles, and signature authority levels."
- "Document Management": "Securely store, organize, category index, and archive all communication records."
- "Data Security & Vault": "Enterprise-grade digital security vaults, encryption keys, and complete audit trail logs."
- "E-Signatures": "Legally compliant, secure electronic signatures for remote approvals and verification."

**"Platform Value": "Key Benefits of Nazoo"**
- "Faster and standardized correspondence processing"
- "End-to-end workflow automation for approvals and routing"
- "Centralized document storage, retrieval, and archiving"
- "Improved visibility across communication and document status"
- "Paperless approvals through e-signature workflows"
- "Secure operations with roles, audit trails, and encryption"
- "Scalable platform for growing organizational needs"
- "Flexible deployment: on-premises or cloud"
- Orbit graphic: "Inbox", "E-Signs", "Routing", "Archives"; centre "N".

**"Usage Scenarios": "Target Use Cases"**
- "Corporate Offices": "Standardize executive communications, board resolutions, and external legal letters."
- "Executive Admin": "Automate review routes and memo distribution across leadership offices."
- "Document Control": "Keep a centralized index database, audit logs, and version control records."
- "Legal Compliance": "Track notices, draft contract reviews, and archive regulatory filings."
- "HR & Finance": "Manage employee notifications, approval circulars, and expense workflows."
- "Correspondence Desk": "Instantly digitize incoming mail and assign to specific department workflows."

**Chatbot:** repeats the hero description, followed by "For more information…". Suite label **"NAZO (Document Management)"**.

### 6.5 Wasel (`/wasel`; config @1,921,739, fn `JU` @1,925,835)

**Header and hero**
- Tagline: **"Smart Gate & Access Control System"**. Pill: **"IoT Access Solution"**.
- Badges: "IoT-Powered Gate Control", "Secure & Encripted" [sic], "Online & Offline Modes", "Real-time Monitoring".
- Hero H1: "Smart Access. Total Control." + "Anywhere."
- Description: **"WASEL is an IoT door and gate management solution that modernizes access control through multi-mode connectivity, real-time monitoring, and secure role-based access. It is designed for residential communities, villas, apartments, commercial facilities, and multi-gate environments."**
- Cover `/assets/wasel_cover_banner.png`, alt "Wasel Smart Gate Cover". The image shows a gated community sign **"OAKWOOD RESERVE"** and a phone reading "GATE OPEN" and "GATE 1 OPEN • Welcome Home". Some phone text is garbled; it reads approximately "SECUNEY UNLOCKSD". It looks AI-generated **(inference)** and is not Wasel-branded.
- Buttons: "Explore Features", "Watch Video" (`/assets/wasel.mp4`, 2,066,755 B).

**Phone mock-up**
- "Wasel Mobile Key", "CONNECTED", "Device: Main Entry Gate 01"
- "Gate is CLOSED/OPENING/OPEN/CLOSING", "Tap to Open" / "Tap to Close" / "Moving..."
- "Auto-Close configured for 60 seconds. Uses BLE Local Key fallback mode automatically if Wi-Fi goes offline."

**What is it**
- Label "What is Wasel?"; H2 "IoT Door & Gate Management Excellence".
- "WASEL is a smart IoT-based gate and door access control system that connects mobile applications, IoT gate controller hardware, cloud services, local network access, and Bluetooth fallback modes to provide flexible, secure, and real-time access management."

**"Core Features & Services": "Everything You Need in One Smart System"**
- Subtitle: "Manage and monitor your physical barriers remotely and securely."
- "Multi-Mode Connectivity": "Connect via Cellular, Local Wi-Fi, Bluetooth, or local offline configurations."
- "Mobile App Control": "Open/close gates, view statuses, and receive instant alert logs from anywhere."
- "Real-Time Monitoring": "Track gate position sensors, temperature, humidity, and active status feeds."
- "IoT Gate Controller": "Industrial-grade hardware controller unit with plug-and-play connections."
- "Audit & Activity Logs": "Detailed historic logs showing time/date, triggering user, and access methods."
- "Multi-Gate Management": "Centralized panel control for multiple gates and access points across different regions."
- "Access Security": "Encrypted keys, administrative privileges, user management, and roles."
- "Device Provisioning": "Fast OTA provisioning, setup wizards, and automatic device configurations."
- "Fallback & Offline Modes": "Offline BLE Bluetooth access ensures you never get locked out during internet downtime."

**"Platform Value": "Key Benefits of Wasel"**
- "Centralized control for multiple gates and access points"
- "Real-time gate status and sensor visibility"
- "Secure role-based access management"
- "Reliable operation with online and offline fallback modes"
- "Reduced dependency on a single network connection"
- "Improved safety, transparency, and access accountability"
- "Flexible access via mobile, Wi-Fi, Bluetooth, and cloud"
- "Suitable for residential, commercial, and multi-gate environments"
- Orbit graphic: "WiFi / LTE", "Bluetooth", "Auto-Arm", "App Control"; centre "W".

**"Deployments": "Built for Every Environment"**
- "Residential Communities": "Automate resident entry gates, visitor passes, and track entry history."
- "Commercial Buildings": "Restrict office floor doors, staff parking gates, and server room access."
- "Industries & Warehouses": "Secure loading dock gates, logistics yards, and heavy equipment zones."
- "Parking Lots": "Integrate automatic ticketing arm control and smart parking sensors."
- "Toll Gates": "High-speed automatic barrier controls linked to billing systems."
- "Construction Sites": "Perimeter gate tracking for safety compliance and contractor check-ins."

**Chatbot**
- "WASEL is an IoT door and gate management solution that modernizes access control through multi-mode connectivity, real-time monitoring, and secure role-based access for residential communities, villas, apartments, and commercial facilities. For more information…"
- Suite label **"Wasel (Logistics)"**, which contradicts this.

**Related:** "Remotioo Smart Gate" on the Accelerator page (§5.6) is a second gate-control offering, and its relationship to Wasel is not stated **(uncertain)**.

### 6.6 Asset Tracking / "Smart Tracking" (`/asset-tracking`; config `aB` @1,940,724, fn `oB` @1,943,955; bundle only)

**Header and hero**
- Name **"Asset Tracking"**; tagline **"RFID & IoT Powered Asset Tracking System"**; pill **"RFID & IoT Solution"**.
- Badges: "AI-Powered Tracking", "RFID Enabled", "Real-time Visibility", "Prevent Losses".
- Hero H1: "Track Every Asset." + "Maximize Every Opportunity."
- Description: **"Smart Tracking helps organizations gain real-time visibility, improve asset utilization and reduce losses with RFID-powered intelligence."**
- Cover `/assets/asset_tracking_cover_banner.png` (1,098,529 B), alt "Asset Tracking RFID Cover". Not viewed.
- Only one button: "Explore Use Cases". There is **no video**.

**Mock console: "Smart Tracking Console v1.0" / "Telemetry Connected"**
- Side menu: " Asset Registry", " Geofences", " Maintenance"
- Tiles: "Total Assets 12,548 ↑ 10.5%", "Active Assets 11,453 ↑ 4.2%", "Alerts 32 ↓ 18.2%", "Utilization 87% ↑ 5.1%"
- Map image `/assets/earth-night.jpg`, alt "Satellite Tracking Map", with markers "EXCAVATOR_123", "GENERATOR_RFID" and " Geofence: Zone_B_SiteA"
- "Activity Logs":
  - "Asset Transferred / Excavator #123 moved to Site 03 • 5m ago"
  - "Maintenance Completed / Generator RFID logged complete • 12m ago"
  - "New Asset Registered / Excavator RFID added • 1h ago"

**What is it**
- Label **"What is Smart Tracking?"**; H2 "Complete Visibility. Optimized Lifespans."
- "Our Asset Tracking system is an enterprise-grade IoT platform that maps and monitors company inventory, heavy machineries, fleet shipments, and tools using rugged RFID tags and active GPS telemetry, giving organizations absolute operational visibility and audit-readiness."

**"Capabilities": "Powerful Use Cases"**
- Subtitle: "Streamline inventory counts, track movements, and secure your fleet assets."
- "Real-time Tracking": "Track assets in real-time across multiple geographic locations and job sites."
- "Inventory Management": "Automate inventory counts, detect stock levels, and reduce counting discrepancies."
- "Maintenance Management": "Schedule preventative maintenance logs, track usage hours, and extend asset lifespan."
- "Loss Prevention": "Get instant geofencing alerts, unauthorized movement alarms, and prevent tool shrinkage."
- "Compliance & Audit": "Maintain comprehensive digital audit trails and ensure regulatory compliance."

**"Platform Value": "Key Benefits of Smart Tracking"**
- "Centralized monitoring dashboard for all high-value assets"
- "Real-time geofencing boundaries and security sensors"
- "Automated counts with passive RFID tags"
- "Reduced asset retrieval and lookup times by 90%"
- "Extended asset life cycle through proactive maintenance alerts"
- "Custom compliance and utilization metrics reports"
- "Integrates with existing CRM, ERP, and databases"
- "Supports active GPS, BLE beacons, and passive RFID hardware"
- Orbit graphic: "Geofences", "RFID Tagging", "Active Sync", "Telemetry"; centre "ST".

**"Sector Solutions": "Built for Every Industry"**
- "Construction": "Track heavy equipment, tools, and contractor assets across job sites."
- "Healthcare": "Monitor high-value medical assets, wheelchairs, and critical equipment."
- "Manufacturing": "Optimize assembly line assets, parts inventory, and raw material workflows."
- "Logistics": "Track fleet vehicles, shipping containers, and valuable cargo shipments."
- "Retail": "Manage in-store assets, inventory levels, and reduce retail shrinkage."
- "Government": "Ensure public asset accountability, audits, and optimize resource usage."

**Chatbot:** "Our Asset Tracking system leverages IoT, RFID, and Bluetooth BLE technology for real-time location tracking, inventory management, and equipment security. For more information…". Suite label "IoT Asset Tracking".

### 6.7 Other named offerings on the live site
- **Smart Office Application.** API only; hidden in the UI (§5.4). The chatbot still describes it (§5.7).
- **Hi Legal Management Application.** Also appears as "Hi Legal Management Apllication" [sic] in the card list (§5.4).
- **Real Estate & E Commerce Application.** Also "Real Estate & E-Commerce Application" (§5.4).
- **EV Charger** and **Warehouse Management** (§5.4).
- **Green Hub.** Listed under "Our Unique Products" and also on "Meerana Accelerator", with the same text (§5.4, §5.6).
- **Remotioo Smart Gate** (§5.6). It is spelled "Remotioo"; "Remootio" does not appear on the site.
- **Zing HR**: "We provide Zing HR integration for comprehensive human capital management, payroll automation, leave tracking, and employee self-service." (chatbot) and "Zing HR" (dropdown).
- **Voice Assistance.** Contact dropdown only, with no description **(uncertain)**.
- **VOC Solution Using Gen AI** (§5.3).
- **Meerana App.** Privacy-policy subject: location clock-in/out, camera OCR, microphone speech-to-text and photo library. **(inference)** This is the Smart Office / Mandoobee mobile app.
- **Meerana Bot** (chat widget) and **"OpenAI Chatbot"** (unlinked beta page, §13).

### 6.8 Requested names that are NOT found anywhere in the bundle or API
- "AI in a Box"
- "Mandoobi" (only "Mandoobee" and "Mandobee" occur)
- "Nazo" as a display name (only "NAZO" in the dropdown and "nazo" as a matching keyword and file name)
- "Smart Tracking" as a separate product: it occurs only as an alternative name inside the Asset Tracking page
- "ZingHR" written as one word
- FinTech; visitor management as a product; "tasree3.ae"; app-store links

---

## 7. Awards and recognitions
None of these have a dedicated Awards section. They appear in hero slides and news cards only.

| # | Wording on the site (verbatim) | Date as shown | Issuer as stated | Where | Image |
|---|---|---|---|---|---|
| A1 | Hero title "Ensuring Employee Wellbeing and Workplace Environment"; text **"MOHRE Award Recognizes Our Dedication to Workforce Wellbeing!"** | none | "MOHRE" (the acronym is not expanded on the site; it normally means the UAE Ministry of Human Resources & Emiratisation, which is my gloss) | Home hero slide 2 (`homepageInfo` id 2) | banner-02.webp |
| A1 | News: **"Winning MOHRE Award for Workforce wellbeing, Quality of Life"** | "November 23, 2023" | MOHRE | News id 5 → `https://www.instagram.com/p/Cz_etD0SErJ/?igshid=MjlkZjg0ZTE3YQ%3D%3D` | new01.webp. Text in the image: "المنشآت الفائزة / Winning Establishments" and "ميرانا لتقنية المعلومات / Meerana Information Technology" |
| A2 | News: **"Meerana recieving award from MOHRE UAE"** [sic] | "September 13, 2024" | "MOHRE UAE" | News id 21 → `https://www.instagram.com/p/C_2RRcQvWI1/?igsh=MXEydmEybzU1dnhoNQ%3D%3D` | news13.webp. **(uncertain)** whether this is the same award as A1 or a second, 2024 award. |
| A3 | Hero title **"Chosen Among Future 100 Companies"**; text "We are humbled and honored to be selected among the Future 100 companies, a testament to Meerana's commitment to excellence and innovation." | none | Not named | Home hero slide 3 (`homepageInfo` id 5) | herobg5.webp |
| A3 | News: **"Meerana Selected Among 100 Future Companies"** | "Decemeber 2, 2023" [sic] | Not named | News id 6 → LinkedIn post (slug `meerana_future100-activity-7139199069037539328`) | new02.webp. The image is a grid of company names including "Meerana", with a "Future 100" logo. |
| A4 | News: **"Meerana received the award for Best Small Enterprise"** | "September 5, 2024" | **Not named** | News id 12 → `https://www.instagram.com/p/C_fTX7-uCtz/?img_index=1` | news12.webp. Photo of an award being handed over; Arabic text visible including "2024م". |

Related recognition-type items:
- "CEO contribution as deputy chairman of UAE innovation association" (July 2023, news id 2).
- The embedded Dubai Chambers video "Dubai Dreamers: From Dubai to the World with Meerana Technologies".

## 8. Partners, clients and alliances

### 8.1 Headings and relationship wording (verbatim)
- Home section heading, from the API: "Partners  & Clients" (two spaces in the data; anchor `#partner`).
- Home section text (static, bundle @1,501,627): "We are proud to partner with a wide range of organizations on emerging technologies. Together we bring unique and global solutions for reinventing business." Button: "See more".
- Navbar: "Partners & Clients". Footer: **"Clients & Partners"**.
- `/partners`:
  - Breadcrumb "Home / Partners  & Clients"; H1 "Partners  & Clients".
  - Title "Empowering Innovation Through Collaborative Partnerships in Emerging Technologies", followed by the same "We are proud to partner…" subtitle.
  - Button "Become a Partner"; images partner01.webp and partner02.webp.
  - A grid of **all 32 logos** in grayscale with `alt=""`.
  - Section **"Be a Partner"** (text from `partnerinfoInfo`, the same "We are proud to partner…" sentence) with a form (§15).
- **No logo is labelled as partner, client or alliance.** They all sit in one undifferentiated grid. The word "alliance" is **never used**.
- The home page shows only the first 4 logos in API order (`slice(0,4)`): dell.png, DubaiELEC.png, EmiratesNBD.png, dewa.png.

### 8.2 Logos in display order (`partners_clientsInfo.companyLogo`)
✔ = checked visually from a local copy of identical byte size. All others are identified **from the filename only (uncertain)**.

| # | File | Identification |
|---|---|---|
| 1 | dell.png | ✔ Dell |
| 2 | DubaiELEC.png | ✔ "Dubai Electricity & Water Authority" (DEWA), Arabic and English |
| 3 | EmiratesNBD.png | ✔ "Emirates NBD" |
| 4 | dewa.png | DEWA (filename). **Possibly a second DEWA logo (uncertain).** |
| 5 | confluent.png | ✔ "CONFLUENT" |
| 6 | botminds.png | ✔ "botminds.ai" |
| 7 | digital.png | ✔ "DigitalX" |
| 8 | commvalt.png [sic] | Commvault (filename) |
| 9 | darAlBar.png | "Dar Al Bar" or "Dar Al Ber" (uncertain) |
| 10 | software.png | ✔ "software AG" |
| 11 | smartHub.png | "Smart Hub" (uncertain) |
| 12 | generalCivil.png | "General Civil …", possibly the General Civil Aviation Authority (uncertain) |
| 13 | moro.png | ✔ "M()RO" (Moro) |
| 14 | realEstate.png | A real-estate entity (uncertain) |
| 15 | humanResources.png | A "Human Resources" entity, possibly MOHRE (uncertain) |
| 16 | jumbo.png | "Jumbo" (uncertain) |
| 17 | sabeeltech.png | "Sabeel Tech" (uncertain) |
| 18 | ministryOfInterior.png | ✔ "UNITED ARAB EMIRATES MINISTRY OF INTERIOR / GEN. COMMAND OF CIVIL DEFENSE / DIRECTORATE GEN. OF DUBAI CIVIL DEFENSE" |
| 19 | UAEInvertors.png [sic] | "UAE Inventors" (uncertain) |
| 20 | course_provider2.jpeg | SAS. The same file is the "SAS" course-provider image (`courseProviderInfo` id 2). |
| 21 | indusNovateur.png | "Indus Novateur" (uncertain) |
| 22 | cabinetAffairs.png | A Cabinet Affairs body (uncertain) |
| 23 | ADIB.png | ADIB, Abu Dhabi Islamic Bank (filename) |
| 24 | kofax.png | ✔ "KOFAX" |
| 25 | neonax.png | "Neonax" (uncertain) |
| 26 | modon.png | "Modon" (uncertain) |
| 27 | magrudy.png | "Magrudy" (uncertain) |
| 28 | cronos.png | "Cronos" (uncertain) |
| 29 | src.png | "SRC" (unknown) |
| 30 | b.png | Unknown |
| 31 | agilePoint.png | AgilePoint (filename) |
| 32 | ruyabank.png | "Ruya" bank (uncertain) |

### 8.3 Relationships stated in text (stronger evidence than the logos)
- **Reseller and technology portfolio** (Managed Services, verbatim in §5.5): Agilepoint, Kofax, Commvault, Confluent, Software AG, SAP (Ariba, S/4 Hana, Business By design, Business One, C4C, Success Factors), plus PC hardware.
- **Software AG partnership:** news "Software AG, Meerana sign partnership" (October 12, 2022) → `https://techxmedia.com/software-ag-meerana-technologies-sign-partnership-to-build-future-ready-business-models/`.
- **Course providers** (`/courses`): FPT, SAS, Commvault, Botminds, Sprinklr (§12).
- **Zing HR integration** (chatbot).
- Government and international activity news (§10): Ministry of Economy visits and B2B missions.

## 9. Certifications
**None.** "ISO", "certif", "27001" and "9001" do not occur in the bundle or the API.

## 10. News and insights

Sources:
- Home section "Latest News", subtitle "Explore our news feed for new updates and compelling new stories". It shows the newest items first by API id and has a "Read More" button to `/latest-news`.
- `/latest-news` page, heading "Latest News", sorted by date parsed in the browser.

Every card links **out** to the URL listed below. There are no internal articles. Text is verbatim from `latestnewsInfo.php`.

| id | dateString (verbatim) | Headline (verbatim) | Link | Image |
|---|---|---|---|---|
| 1 | "October 12, 2022" | "Software AG, Meerana sign partnership" | techxmedia.com/software-ag-meerana-technologies-sign-partnership-to-build-future-ready-business-models/ | new04.webp |
| 2 | "July 2023" | "CEO contribution as deputy chairman of UAE innovation association" | linkedin.com/posts/meerana_meerana-activity-7082238453475647488-tDJb | new05.webp |
| 3 | "Novemeber 15, 2023" [sic] | "MEERANA's strategic expansion into Kenya and Rwanda" | theeastafrican.co.ke/tea/**sponsored**/-meerana-s-strategic-expansion-into-kenya-and-rwanda-4434204 (a sponsored placement, per the URL path) | new06.webp |
| 4 | "November 23, 2023" | "Ministry of economy Korea and Qatar stands" | linkedin.com/posts/meerana_comeup-activity-7128277489184890881-v0Xf | new03.webp |
| 5 | "November 23, 2023" | "Winning MOHRE Award for Workforce wellbeing, Quality of Life" | instagram.com/p/Cz_etD0SErJ/ | new01.webp |
| 6 | "Decemeber 2, 2023" [sic] | "Meerana Selected Among 100 Future Companies" | linkedin.com/posts/meerana_future100-activity-7139199069037539328-j3Im | new02.webp |
| 7 | "May 6, 2024" | "Jakarta visit: Enhancing bilateral cooperation and expressing gratitude." | linkedin.com/posts/mataralmehairi_thanks-activity-7193617560318226433-AC1X | news10.webp |
| 8 | "May 9, 2024" | "Vietnam visit: Fostering international trade relations and collaboration." | linkedin.com/posts/mataralmehairi_dubaiinternationalchamber-worldinfocus-activity-7194695281953669123-OkuZ | news09.webp |
| 9 | "May 24, 2024" | "Paris visit: Strategic partnerships with the Ministry of Economy." | linkedin.com/posts/mohamed-elsaady-8a8311151_ministry-of-economy-activity-7201085203698577408-9xg0 | news08.webp |
| 10 | "June 4-7, 2024" | "St. Petersburg visit: Discussing global economic and trade matters." | linkedin.com/posts/mataralmehairi_great-activity-7206008268425465856-JSzw | news11.webp |
| 11 | "August 22, 2024" | "Lithuania visit: Strengthening B2B relations, exploring new opportunities" | linkedin.com/posts/mohamed-elsaady-8a8311151_b2b-h2h-activity-7233877754759311363-Ib3z | news07.webp |
| 12 | "September 5, 2024" | "Meerana received the award for Best Small Enterprise" | instagram.com/p/C_fTX7-uCtz/ | news12.webp |
| 21 | "September 13, 2024" | "Meerana recieving award from MOHRE UAE" [sic] | instagram.com/p/C_2RRcQvWI1/ | news13.webp |

The newest item is dated **13 September 2024**; nothing has been added in the roughly two years since. The external links were not opened.

## 11. Careers (`/career`; footer link only)
- Breadcrumb "Home / Careers"; H1 "Careers"; headline **"Be a part of Something Great"** ("Something Great" is highlighted).
- Text: "Welcome to our career application form! Take the first step towards joining our dynamic team by providing your essential details and showcasing your qualifications"
- Image `./assets/career.png`.
- **No job listings or vacancies.**
- Form fields:
  - "Enter full name" (required)
  - "Enter email" (required, type text)
  - "Message" (required)
  - A file input `pdfUrl` with a decorative "Upload" button (type=button)
  - Submit button "Send Message"
- Success text: "Thank You for your interest, We will call you back as soon as possible!"
- Submission: POST multipart to `https://api.meerana.ae/allDataInfo/carrerformInfo.php` [sic].
- Chatbot careers answer: see §5.7.
- **Site Terms** text is in fact job-application terms (§14, §17).

## 12. Courses (`/courses`, `/course-provider/:id`, `/course-registration/:id`)

**/courses**
- Breadcrumb "Home / Course Providers"; H1 "Course Providers".
- Intro: "Explore a wide range of training courses from top providers. Whether you're looking to develop new skills, enhance your career, or pursue a personal passion, our providers offer a diverse array of courses. Join us and embark on a journey of learning and growth!"
- Provider cards with "Learn More".

| Provider | Description (verbatim) | Courses |
|---|---|---|
| FPT | "A global IT services provider from Vietnam, offering custom software, digital transformation, and specialized technology services." | 1 "FPT Software’s Global Internship Program" ("An immersive course offering hands-on experience for students in software development.", AED 1000.00, "2 weeks")<br>2 "FPT University’s International exchange programs" ("Experience a global learning environment with FPT University’s exchange programs.", 1500.00, "4 weeks")<br>3 "FPT Software’s AI Center Residency" ("Join the cutting-edge FPT Software’s AI Center Residency program to deepen your expertise in AI.", 2000.00, "6 weeks")<br>4 "Investigate areas of collaboration to support people living with disabilities." ("A specialized course focusing on collaborative strategies to support individuals with disabilities.", 800.00, "3 weeks") |
| SAS | "A global analytics software company offering data management, advanced analytics, and AI solutions to help organizations make data-driven decisions." | none |
| Commvault | "A global leader in data management and protection, providing backup, recovery, and data management solutions for enterprises to secure, manage, and use their data effectively." | none |
| Botminds | "A company specializing in AI-powered document processing and automation, providing solutions for intelligent data extraction and workflow automation to enhance business efficiency." | none |
| Sprinklr | "A platform for managing customer experience and engagement across digital channels, offering social media management and analytics solutions." | none |

**Provider page**
- Shows "Duration: …" and "Price: AED …".
- When a provider has no courses: " Currently, there are no courses available.Please check back soon." [sic, missing space]

**Registration page**
- Shows "Provider: {provider_id}". This prints the numeric id, not the name.
- Shows "Price: {price}" without a currency.
- Form fields:
  - "Enter full name"
  - "Enter email"
  - "Enter qualification"
  - "Enter phone number"
  - "Enter location"
  - "Upload CV / Resume" (.pdf, .doc, .docx)
  - Button "Register"
- Success text: "Thank you for registering! We will contact you soon."
- `image_url` values are placeholders such as "random_image_url_1" and are not rendered.

## 13. Other pages
- **Gallery (`/gallery`)**
  - H1 "Gallery"; text "Explore our latest moments captured on Instagram."; states "Loading images..." and "Unable to load gallery images".
  - The page fetches `http://api.scrapestack.com/scrape?access_key=<hard-coded key>&url=https://www.instagram.com/meerana.technologies/` and parses `window._sharedData`.
  - The request is **plain HTTP from an HTTPS page**, so browsers block it as mixed content. Instagram profile pages are also generally understood to no longer embed `_sharedData`. **(inference)** The live page therefore shows "Unable to load gallery images". I did not call scrapestack.
  - **Security note:** a third-party access key is embedded in the public bundle at about @1,825,804. Its value is deliberately not reproduced here.
- **OpenAI Chatbot (`/openai-chatbot`, unlinked)**
  - Side panel "Navigation", "Chat Area", "Dashboard", "Settings".
  - "API Key" input with placeholder "Enter your API key". "Model Version" options "GPT-4", "GPT-4o", "Custom".
  - "Upload Document" / "Upload File" posts to `http://20.46.197.154:7000/start_chat`; chat posts to `/chat`.
  - Chat area: "OpenAI Chatbot", "No messages yet...", "Type your message here...", "Send".
  - Offline message: "Server is currently offline. Please contact us directly at info@meerana.ae."
  - Dashboard: "Dashboard (Dummy Data)", "Sample1/2/3", "Sample Bar Chart", "Sample Pie Chart".
  - This is a developer test page and is publicly routable.
- **/landing.** Unlinked duplicate of the home body.

## 14. Legal pages
- **Privacy (`/privacy`)**
  - Breadcrumb "Home / Privacy Policy"; H1 "Privacy Policy"; "**Last updated:** December 6, 2024".
  - This is a **mobile-app** policy. Its subject is "Meerana App".
  - Sections: Interpretation and Definitions; Collecting and Using Your Personal Data; "Location Data" (clock-in/clock-out attendance tracking); "Camera Permission" (OCR); "Microphone Permission" (speech-to-text); "Photo Library Access"; "Speech Recognition"; "Explicit Consent"; Data Retention and Security; Sharing and Disclosure; Your Rights; Changes; Contact Us.
  - Company definition: "Meerana Technologies, #1704, Blue Bay Tower, Business Bay, Dubai, UAE". "Country: Refers to the United Arab Emirates."
  - Contact block: "Meerana Technologies / #1704, Blue Bay Tower, Business Bay, Dubai, UAE / Email: info@meerana.ae".
  - It does **not** cover the website's own forms, newsletter, profile-download email capture or cookies.
- **Site Terms (`/site-terms`).** H1 "Site Terms". The single paragraph is about **job applications**. It begins "By submitting this application, you are confirming that all information provided is accurate and complete…", includes "We are an equal opportunity employer…", and ends "Your submission indicates that you have read, understood, and agree to abide by these terms and conditions."
- **Legal of Service (`/legal-of-service`).** Breadcrumb "Home / Legal of Service"; H1 "Legal of Service" (the footer spells it "Legal Of Service"). The single generic paragraph begins "Our website's Terms of Service govern the use of our platform…". **No governing law, entity or jurisdiction is named.**

## 15. Forms, endpoints and API status

### 15.1 Base URLs (inlined `process.env`, bundle @1,578,950)
- `REACT_APP_BASE_URL_PROD: "https://api.meerana.ae"`
- `REACT_APP_BASE_URL_DEV: "http://localhost/meerana-website-backend"`
- `REACT_APP_CHATBOT_URL` is unset, so the fallback `http://20.46.197.154:7000/chatbot` is used.

### 15.2 GET endpoints (called today)
All on `https://api.meerana.ae/allDataInfo/`, Apache, `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST`.

| Endpoint | Status / type / bytes | Used by | Rendered? |
|---|---|---|---|
| homepageInfo.php | 200 json 694 | Hero slider | Yes |
| aboutusInfo.php | 200 json 467 | About | Yes |
| chooseusInfo.php | 200 json 739 | Why Choose Us | Yes (the `video` field is unused) |
| ourteamInfo.php | 200 json 754 | Our Team | Yes |
| solutionInfo.php | 200 json 2,406 | Solutions cards and navbar submenu | Yes |
| solutionInfo.php?id=1, 2, 3, 6 | 200 json 3,234 / 5,605 / 3,276 / 1,630 | /construction | Yes |
| solutionInfo.php?id=4, 5, 7, 8, 9, 10 | 200 `{"status":"failure"}` | none | n/a |
| testimonalsInfo.php | 200 json 1,570 | Fetched on home | **No.** The content is "Lorem Ipsum…" placeholder text for "Abdul Waheed" ("Dubai,UAE") and "Mohamed Imran" ("Chennai,TN"). |
| partners_clientsInfo.php | 200 json 865 | Home and /partners | Yes |
| partnerinfoInfo.php | 200 json 185 | /partners | Yes |
| experienceInfo.php | 200 json 101 | Banner and profile download | Yes |
| locationInfo.php | 200 json 1,194 | Fetched on home | **No** (the globe uses hard-coded data) |
| contactusinfoInfo.php | 200 json 173 | Contact intro | Yes |
| latestnewsInfo.php | 200 json 3,534 | Home and /latest-news | Yes |
| courseProviderInfo.php (and ?id=1, ?id=2) | 200 json 2,530 (1,444; 253) | /courses, /course-provider | Yes |
| courseInfo.php (and ?id=1) | 200 json 1,211 (286) | /course-registration | Yes |
| `https://api.meerana.ae/` | 200, empty body | none | n/a |
| `https://api.meerana.ae/allDataInfo/` | 403 | none | n/a |

### 15.3 POST endpoints (from code; **not called**)

| Form | Fields (FormData keys) | Endpoint | UI text |
|---|---|---|---|
| **Home Contact Us** | FullName, Email, Phone, Country, Product, Message | `https://api.meerana.ae/allDataInfo/contactformInfo.php` (axios, multipart) | See the field list below |
| Footer newsletter | email | `…/subscribersInfo.php` | "Enter your email address" / "Subscribe Now" / "Thank you for subscribing!" |
| Download Profile (email gate) | email | `…/profiledownlodersInfo.php` [sic] | "If you want to download profile, submit your email !" / "Enter Your Email" / "OK" / "Close". On success it downloads `/assets/Meerana Profile.pdf` as "MEERANA-CP-DE-V1.0 2026.pdf". An invalid address triggers the alert "Please enter a valid email address." |
| Be a Partner | FirstName, LastName, PhoneNumber, Country, Email, Message | `…/partnerformInfo.php` | Placeholders "First Name", "Last Name", "PhoneNumber", "Select a Country", "Email", "Message"; "Send Message"; success "Thank you for your Interest! Our Team will contact you as soon as possible". **Bug:** the select is named `country` but the code sends `Country`, so the country is never submitted. |
| Careers | FullName, Email, Message, pdfUrl (file) | `…/carrerformInfo.php` | §11 |
| Course registration | FullName, Email, Qualification, PhoneNumber, Location, cvUrl, CourseId, CourseName, ProviderId, Price, Decs, Duration | `…/courseRegistrationInfo.php` (fetch POST) | §12 |
| Chat widget | JSON {session_id, question} | `http://20.46.197.154:7000/chatbot` | GET timed out (unreachable) |
| OpenAI chatbot | FormData file, user_id; JSON {user_id, query} | `http://20.46.197.154:7000/start_chat` and `/chat` | GET timed out |
| Gallery | GET | `http://api.scrapestack.com/scrape?...` | not called |

**Home Contact Us form detail**
- Fields:
  - "Full Name" (optional)
  - "Email Address *" (required, type text)
  - "Phone Number"
  - "Select a Country" (about 244 countries, from data/countries.js)
  - "Our Products": "Mandoobee", "Tasree3", "Asset Tracking", "NAZO", "Wasel", "Voice Assistance", "Zing HR", "Yisbir"
  - "Message" (required)
- Buttons: "Send Message" / "Sending..."
- Responses:
  - Success: "Thanks for contacting us, we have received your response and we will get back to you soon."
  - Error: the server's message, or "Failed to submit form. Please try again."
  - Network error: "Unable to reach server. Please check your connection and try again."
  - Alert headers: "Notification" / "Notice".

## 16. Assets inventory (HEAD on 2026-10-02)
**All 108 referenced asset files exist.** Every one returned 200 with its real MIME type, not the SPA fallback. Upload dates fall into two batches: 13 Aug 2026 and 22 Sep 2026. Full list: `research/live-site/asset-head-check-2026-10-02.json`.

Notable files:
- **Videos (none were downloaded):**
  - mandoobee_video.mp4: 32,445,796 B
  - yisbir.mp4: 27,845,919
  - nazo.mp4: 23,483,149
  - Meerana_Technologies.mp4: 9,183,003 (unused)
  - tasree.mp4: 8,352,369
  - wasel.mp4: 2,066,755
- **Company profile PDF:** `/assets/Meerana Profile.pdf`, application/pdf, 32,027,818 B, Last-Modified 13 Aug 2026. Not reviewed.
- **Product covers:**
  - asset_tracking_cover_banner.png: 1,098,529
  - yisbir_cover_banner.png: 1,062,128
  - wasel_cover_banner.png: 817,350
  - nazoo_cover_banner.png: 788,323
  - tasree3_cover_banner.png: 696,040
  - smart-office-app.png: 224,288
- **Large images:**
  - bg-vector.png: 2,443,541
  - bespoke-06.webp: 2,265,034
  - unique-02.webp: 651,630
  - career.png: 503,484
- **Globe texture:** `/static/media/earth-night.da273783100dfbfd07c0.jpg` (715,000 B), with the same file also at `/assets/earth-night.jpg`.
- **Missing:** `/logo192.png` (apple-touch-icon), `/robots.txt`, `/sitemap.xml`, `/manifest.json`. All return the SPA HTML.

## 17. Internal contradictions and inconsistencies on the live site

1. **Yisbir is two different products.**
   - Product page: "AI-Powered Video Analytics & Indexing" / "Video Analytics Solution" (/yisbir).
   - Chatbot: "Yisbir is an AI-powered talent acquisition and smart recruitment matching platform designed to streamline enterprise hiring." (@1,581,290) and "Yisbir (AI HR)" (@1,588,211).
2. **Wasel.** The page says "Smart Gate & Access Control System" and the chatbot's own Wasel answer agrees, but the chatbot suite list says **"Wasel (Logistics)"**.
3. **Mandoobee.**
   - Page: "AI-Powered Workplace Platform" with the pill "Smart Office Solution".
   - Chatbot suite list: **"Mandoobee (PRO Automation)"**.
   - The route is spelled `/mandobee`.
4. **Tasree3.** The page says "AI-Assisted Process Mining & Process Engineering"; the chatbot suite list says "Tasree3 (Digital Transformation)". The video file is `tasree.mp4`.
5. **Nazoo / NAZO.**
   - The page, route and description use "Nazoo".
   - The contact dropdown and chatbot use "NAZO", and the chatbot calls it "NAZO (Document Management)" rather than correspondence management.
   - The video file is `nazo.mp4`.
6. **Asset Tracking vs Smart Tracking.** The same page uses both names: H1 "Asset Tracking", but "Smart Tracking helps…", "What is Smart Tracking?", "Key Benefits of Smart Tracking" and "Smart Tracking Console v1.0". The chatbot says "IoT Asset Tracking".
7. **Smart Office Application.** It is still in the CMS under "Our Unique Products" and still answered by the chatbot, but code hides it from the cards and detail page. Mandoobee reuses its screenshot.
8. **Two gate-control offerings with no stated relationship:** Wasel (product page) and "Remotioo Smart Gate" (Accelerator), which claims to be "The First end to end encripted Wi-Fi and bluetooth  enabled smart remote controller…".
9. **"Community" vs "company".**
   - "Meerana is an innovative technology company…" (About)
   - "This is the reason Meerana is a "Community" and not a company." (Why Choose Us)
   - "Meerana Technologies LLC" (footer)
   - "An Emarati Group of Companies" (About subtitle)
10. **Mission wording differs in three places.**
    - "highest quality technological services" (vision quote)
    - "highest quality technology services" (Why Choose Us)
    - "highest quality products & services" (footer)
11. **Locations differ by source.**
    - Globe: Dubai, London, Egypt, Chennai.
    - CMS locations: Dubai, India (Meerana Technologies LLP), UK (128 City Rd, London). No Egypt, and not rendered.
    - Privacy policy: Dubai only.
    - News: Kenya and Rwanda expansion, which appears nowhere else.
12. **Two Instagram handles.** The footer uses `meeranatechnologies`; the gallery scraper uses `meerana.technologies`.
13. **"Partners & Clients" vs "Clients & Partners"** (navbar and page vs footer). No logo is marked as partner or client. The same SAS image is used both as a partner logo and as a course provider.
14. **Future 100 naming.** The hero says "Chosen Among Future 100 Companies"; the news says "Meerana Selected Among 100 Future Companies".
15. **Dates are out of date.** The footer copyright reads "2024", while the profile download is named "…V1.0 2026.pdf". The newest news item is from Sept 2024. The privacy policy was last updated December 6, 2024.
16. **Wrong legal-page content.** "Site Terms" contains job-application terms. "Legal of Service" is a generic ToS that names no entity or jurisdiction. The privacy policy covers a mobile app, not the website.
17. **Card names differ from detail-page names** (category list → detail page):
    - "Enterprises Architecture" → "Enterprise IT Architecture"
    - "Erp Solution" → "ERP Solution"
    - "E Commerce" → "E-Commerce"
    - "IOT Application & Solution" → "IOT Application & Solutions"
    - "Customer Experience & Happiness" → "Customer Experience and Happiness"
    - "Metaverse, Blockchain & AI" → "Metaverse, Blockchain and AI". Its description covers only blockchain.
    - "Hi Legal Management Apllication" → "Hi Legal Management Application"
    - "Real Estate & E-Commerce Application" → "Real Estate & E Commerce Application"
18. **One subtitle for every category.** All four categories, including Consultation and Managed Services, use "We offer a vast range of high quality products…".
19. **Positioning conflict.** The hero says Meerana focuses on "a powerful combination of IoT(Internet of Things) and Blockchain related smart technologies". The products are mostly AI- and workflow-led: AI video analytics, AI process mining, AI workplace.
20. **Team name mismatch.** The displayed name is "Mohammed Youssry"; his LinkedIn URL slug is "mohamed-elsaady-8a8311151".
21. **Typos (verbatim):**
    - "Emarati", "Novemeber", "Decemeber", "recieving", "Apllication", "encripted" (Wasel badge and Remotioo)
    - "hapiness", "commvalt" and "UAEInvertors" (filenames), "carrerformInfo" and "profiledownlodersInfo" (endpoint names)
    - "Testimonals" (commented-out code), "It provide on-demand access…", "An ERP (system integrating…"
22. **Imagery.** The product cover images show non-Meerana brand text: "SENTINEL AI-V12" (Yisbir), "OAKWOOD RESERVE" (Wasel) and "BPM INSIGHTS" (Tasree3). They contain garbled generated text **(inference: AI-generated)**. The Nazoo mock-up uses a real bank name, "Official Letter to ADIB Bank".

## 18. Present in the bundle, API or source map but NOT shown to users
- **Product `stats` arrays and Mandoobee `trustedBy` placeholder companies** (§4.3). They ship in the public bundle.
- **Testimonials** (Lorem Ipsum) and **locationInfo** map embeds. Both are fetched and never rendered.
- **chooseusInfo `video`** (Meerana_Technologies.mp4).
- **"Smart Office Application"** (hidden by code).
- **Source map only:** this code was removed from the live bundle by the minifier, so it never runs.
  - Product demo-request handlers posting to contactformInfo.php with Product values "Mandoobee Demo Request", "Yisbir Demo Request", "Tasree3 Demo Request", "Nazoo Demo Request" and "Wasel Demo Request".
  - Their messages: "Requested a demo for Mandoobee App.", "Requested a demo for Yisbir Video Intelligence.", "Requested a demo for Tasree3 EPC BPM.", "Requested a demo for Nazoo Correspondence Management." and "Requested a demo for Wasel Smart Gate Control."
  - Error alert: "Something went wrong. Please try again or contact us directly at info@meerana.ae."
  - These give alternative product descriptors: "Mandoobee App", "Yisbir Video Intelligence", "Tasree3 EPC BPM", "Nazoo Correspondence Management", "Wasel Smart Gate Control". **None of them are live.**
- **Commented-out JSX** (source map only):
  - nav items "Beta OpenAI Chatbot", "New Mandobee", "CAREERS" and "Testimonals"
  - product-page footers `&copy; {new Date().getFullYear()} Meerana. All rights reserved.`
  - the privacy-policy phone placeholder
  - the Yisbir config `mockupImage: "/assets/smart-office-app.png"` (in the bundle, never rendered).

## 19. Technical and SEO notes relevant to the redesign (brief)
- The site is a client-rendered SPA with a default CRA meta description and no OG tags, sitemap or robots file. Crawlers see a 909-byte shell.
- Most copy lives in an external PHP/JSON API with open CORS, so content can change without a code deploy.
- The **public source map** (`.js.map`) exposes the full JSX source. The **CSS source map** is also public (106,962 B).
- Exposed in the client bundle:
  - a hard-coded third-party API key (gallery)
  - a raw-IP HTTP chatbot backend
  - a developer test page (`/openai-chatbot`)
- Mixed-content (HTTP) calls from the HTTPS site break the gallery and chatbot.
- The product pages are orphaned (§1).
- Brand colours used throughout: primary `#072FA5`, dark `#202124`, footer `#3A3A3A`. Font: Open Sans.
