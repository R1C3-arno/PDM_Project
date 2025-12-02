# Video Production Requirements

## Video 1: User Journey Demo (Slide 4)

### Technical Specifications
- **Duration**: 2-3 minutes
- **Resolution**: 1920x1080 (Full HD)
- **Format**: MP4 (H.264)
- **Audio**: Optional soft background music (no voiceover needed - Quoc Anh will narrate live)

### Content Breakdown

| Timestamp | Section | Required Content |
|-----------|---------|------------------|
| 0:00 - 0:20 | Landing Page | - Hero section with "Apply Now" CTA<br>- Scroll through Benefits section<br>- Show Features section<br>- FAQ accordion interaction |
| 0:20 - 0:45 | Registration & Login | - Click "Apply Now" or "Sign In"<br>- Fill registration form (show validation)<br>- Show successful registration<br>- Login with credentials<br>- Show navbar changing to "Dashboard" |
| 0:45 - 1:15 | Dashboard Overview | - Stats cards animation on load<br>- Hover over quick action cards<br>- Click through sidebar navigation<br>- Show recent applications list |
| 1:15 - 2:15 | New Application | - Click "New Application" button<br>- Step 1: Personal Information<br>- Step 2: Employment Details<br>- Step 3: Loan Amount & Term<br>- Step 4: Document Upload (simulate)<br>- Submit and show confirmation |
| 2:15 - 2:45 | Application Tracking | - Navigate to "My Applications"<br>- Click on submitted application<br>- Show status timeline<br>- View offer page (if available)<br>- Show contract signing flow |

### Recording Instructions

1. **Browser Setup**
   - Use Chrome in incognito mode
   - Set zoom to 100%
   - Hide bookmarks bar
   - Clear cache before recording

2. **Test Data**
   - Use demo credentials: `test@test.com` / `TestPassword@123`
   - Or create a fresh account for clean experience

3. **Mouse Movements**
   - Move cursor smoothly, not jerky
   - Pause briefly on clickable elements before clicking
   - Use zoom effects on small UI elements

4. **Timing**
   - Pause 1-2 seconds after each action
   - Let animations complete before moving on
   - Don't rush through forms

### Editing Notes
- Add cursor highlight effect
- Add zoom transitions for form inputs
- Add subtle transition effects between sections
- Consider adding step numbers or captions

---

## Video 2: Staff Workflow Demo (Slide 5)

### Technical Specifications
- **Duration**: 2-3 minutes
- **Resolution**: 1920x1080 (Full HD)
- **Format**: MP4 (H.264)
- **Audio**: Optional soft background music

### Content Breakdown

| Timestamp | Section | Required Content |
|-----------|---------|------------------|
| 0:00 - 0:20 | Staff Login | - Show staff login page (different from user login)<br>- Login as Banker first<br>- Show role indicator in dashboard |
| 0:20 - 1:00 | Banker Workflow | - Dashboard with pending applications<br>- Click to review an application<br>- View applicant details<br>- Show document viewer<br>- Generate offer form<br>- Submit for approval |
| 1:00 - 1:40 | Verifier Workflow | - Login as Verifier (or switch role)<br>- KYC verification queue<br>- Open verification task<br>- Check document authenticity<br>- AML check interface<br>- Approve/Flag actions |
| 1:40 - 2:20 | Underwriter Workflow | - Login as Underwriter<br>- Risk assessment dashboard<br>- Credit score visualization<br>- DTI ratio calculation display<br>- Approve/Reject with notes |
| 2:20 - 2:50 | Admin Panel | - Login as Admin<br>- User management table<br>- Add/Edit user modal<br>- System configuration<br>- Analytics dashboard |

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Banker | banker@olavs.com | TestPassword@123 |
| Verifier | verifier@olavs.com | TestPassword@123 |
| Underwriter | underwriter@olavs.com | TestPassword@123 |
| Admin | admin@olavs.com | TestPassword@123 |

### Recording Instructions

1. **Role Switching**
   - Either record separate sessions for each role
   - Or logout/login between roles
   - Show clear role indicator in each dashboard

2. **Workflow Actions**
   - Show the complete action, not just the start
   - Demonstrate status changes in real-time
   - Show success notifications/toasts

3. **Data Requirements**
   - Need applications in various states
   - Need pending verifications
   - Need documents to review

### Editing Notes
- Use color coding transitions for different roles
- Add role labels in corner during each section
- Split screen comparison could work for role differences

---

## Recording Software Recommendations

### Free Options
1. **OBS Studio** - Best for high quality
2. **Loom** - Easy with built-in editing
3. **macOS Screen Recording** - Simple, native

### Paid Options
1. **Camtasia** - Professional editing
2. **ScreenFlow** - Mac-focused, excellent

### Post-Production
1. **DaVinci Resolve** (Free) - Color grading, effects
2. **iMovie** (Free, Mac) - Simple editing
3. **Clipchamp** (Free, Windows) - Quick edits

---

## Checklist Before Recording

### Environment
- [ ] Development server running
- [ ] Database seeded with demo data
- [ ] Backend server running
- [ ] All features working

### Browser
- [ ] Chrome/Firefox latest version
- [ ] Incognito/Private mode
- [ ] 100% zoom level
- [ ] Extensions disabled
- [ ] Bookmarks bar hidden

### Screen
- [ ] Resolution set to 1920x1080
- [ ] Desktop clean (no sensitive info)
- [ ] Notifications disabled
- [ ] Recording area clear

### Content
- [ ] Script reviewed
- [ ] Test accounts ready
- [ ] Demo data loaded
- [ ] Practice run completed

---

## File Naming Convention

```
OLAVS_UserJourney_v1_YYYYMMDD.mp4
OLAVS_StaffWorkflow_v1_YYYYMMDD.mp4
```

## Delivery
- Upload to Google Drive/OneDrive
- Share link with team
- Have backup copy on USB
- Test playback on presentation laptop
