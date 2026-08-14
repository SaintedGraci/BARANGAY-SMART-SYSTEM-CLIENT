Redesign the current Announcements section of our Barangay Smart System.

TECH STACK:

* React
* Express.js
* Existing backend and API structure
* Keep the existing authentication and RBAC
* Do NOT break existing announcement CRUD functionality
* Do NOT remove existing database fields unless absolutely necessary
* Reuse the existing API endpoints where possible

CURRENT PROBLEM:
The current Announcements page looks like a basic administrative card/list system. The announcement image is displayed as a huge banner, the content hierarchy is poor, and the entire page feels like a CMS instead of a modern community announcement feed.

I want to completely redesign the announcement presentation so it feels similar to a modern Facebook/community feed.

IMPORTANT:
Do NOT copy Facebook's branding, colors, logo, or exact interface.
Instead, use the familiar concept of a social-media-style community post while maintaining our own Barangay Smart System design language.

==================================================

1. OVERALL PAGE DESIGN
   ==================================================

Redesign the Announcements page into a modern announcement feed.

Keep the existing sidebar and top navigation, but improve the content area.

Layout:

LEFT:

* Existing admin sidebar

CENTER:

* Announcements page header
* Announcement creation button
* Announcement feed

RIGHT (desktop only):

* Optional small "Barangay Information" panel
* Pinned announcements
* Announcement categories/filter
* Recent activity or useful information

The central feed should be the visual focus.

The announcement feed should have a maximum width around 650–750px so that posts do not become excessively wide.

Do NOT stretch announcement posts across the entire dashboard width.

==================================================
2. ANNOUNCEMENT PAGE HEADER
===========================

Create a clean modern header:

Title:
"Barangay Announcements"

Subtitle:
"Stay updated with the latest news, events, advisories, and important information from Barangay Bakilid."

Add:

[ + Create Announcement ]

button for authorized admin users.

Below the header, add filters:

* All
* Important
* Events
* Advisories
* Community
* Emergency
* Archived

Add a search field:

"Search announcements..."

The filters should be visually clean and responsive.

==================================================
3. FACEBOOK-INSPIRED ANNOUNCEMENT POST
======================================

Each announcement should look like a social/community post rather than a generic dashboard card.

Structure:

---

Barangay Bakilid
Official Announcement
August 14, 2026 · 2:30 PM
⋯
-

TITLE

ANNOUNCEMENT DESCRIPTION

MEDIA

POST FOOTER

---

POST HEADER:

Display:

* Barangay logo/avatar
* Barangay Bakilid
* "Official Announcement" badge
* Posted date and time
* Optional "Edited" indicator
* Three-dot menu for authorized administrators

Example:

[Barangay Logo]

Barangay Bakilid
Official Announcement · Aug 14 at 2:30 PM

The official badge should make it obvious that the post came from the barangay.

==================================================
4. ANNOUNCEMENT TITLE
=====================

Display the announcement title prominently.

Example:

"Barangay Clean-Up Drive This Saturday"

Use a strong but modern typography hierarchy.

The title should not be excessively large.

Avoid making it look like a webpage banner.

==================================================
5. ANNOUNCEMENT CONTENT
=======================

Display the announcement description underneath the title.

Support:

* Paragraphs
* Line breaks
* Basic formatting if already supported
* URLs
* Bullet points where appropriate

For very long announcements:

Show a shortened preview initially.

Example:

"Residents are invited to participate in our community clean-up drive this Saturday..."

Then provide:

"See more"

Clicking "See more" expands the complete announcement.

==================================================
6. IMAGE DISPLAY
================

Images should no longer appear as an enormous full-width banner.

Instead, display them as a social-media-style post image.

Use:

* width: 100%
* max-width: 100%
* object-fit: cover
* rounded corners
* appropriate aspect ratio
* no unnecessary cropping

Recommended aspect ratio:

4:3 or 16:9 depending on the uploaded image.

Do NOT force every image into one fixed height.

Preserve the image's important content as much as possible.

If the uploaded image is portrait-oriented, handle it gracefully instead of stretching it.

If there are multiple images:

1 image:

* Full-width image

2 images:

* Two-column layout

3 images:

* Responsive grid

4+ images:

* Grid with a "+X more" overlay

Clicking an image should open a modern image lightbox/modal.

==================================================
7. VIDEO SUPPORT
================

If an announcement contains a video instead of an image:

Display a proper video player.

Requirements:

* Responsive video container
* Play button
* Native video controls
* Poster/thumbnail if available
* No stretched video
* Preserve aspect ratio
* Allow fullscreen

The post should automatically determine whether the uploaded media is:

IMAGE or VIDEO.

Do not display a broken image element when the media is a video.

==================================================
8. MEDIA PREVIEW BEFORE POSTING
===============================

When an administrator creates a new announcement and uploads media:

Immediately show a preview.

Example:

[ Uploaded Image Preview ]

or

[ Video Preview ]

Allow the administrator to:

* Replace media
* Remove media
* Upload another media file

Validate:

* Supported image formats
* Supported video formats
* File size
* File type

Show friendly validation messages.

==================================================
9. POST FOOTER
==============

At the bottom of each announcement, create a clean social-feed-style footer.

Possible actions:

👍 Helpful
💬 Comment
↗ Share

However, ONLY implement these actions if the backend/database supports them.

Do not create fake buttons that do nothing.

For a simpler version, use:

[ Helpful ] [ Comment ]

The "Helpful" interaction can allow residents to indicate that they have seen/useful information.

Show a subtle count if supported.

Example:

👍 24 residents found this helpful

==================================================
10. COMMENTS
============

If comments are implemented:

Clicking "Comment" should open an expandable comment section.

Display:

* Resident name
* Resident profile/avatar
* Comment
* Date/time
* Optional admin response

Administrators should be able to:

* Hide inappropriate comments
* Delete comments according to permissions

Residents should only be able to manage their own comments.

If comments are NOT currently implemented in the backend, do not build a fake comment system.

Instead, leave the UI architecture ready for future implementation.

==================================================
11. PRIORITY BADGES
===================

Replace the current visually awkward badges with subtle modern badges.

Examples:

IMPORTANT
EMERGENCY
EVENT
ADVISORY
GENERAL

Use different visual treatments but keep them consistent with the Barangay Smart System design.

Emergency announcements should be visually noticeable without making the entire UI look aggressive.

Example:

🔴 EMERGENCY

Important announcements:

🟠 IMPORTANT

General announcements:

🔵 GENERAL

Do not overuse colors.

==================================================
12. PINNED ANNOUNCEMENTS
========================

Allow authorized administrators to pin an announcement.

Pinned announcements should appear at the top of the feed.

Display a small indicator:

📌 Pinned

Pinned posts should remain visually consistent with normal posts.

Add an admin action:

Pin Announcement
Unpin Announcement

Do not duplicate the announcement.

==================================================
13. ADMIN ACTIONS
=================

The current Edit and Delete buttons are too visually dominant.

Replace them with a three-dot menu:

⋯

Clicking it opens:

Edit Announcement
Pin Announcement / Unpin Announcement
Archive Announcement
Delete Announcement

Only display actions allowed by the current user's RBAC permissions.

For example:

Secretary:

* Create
* Edit
* Archive
* Delete if authorized

Staff:

* Only actions permitted by the existing role permissions

System Administrator:

* Do NOT automatically give them normal administrative announcement-management privileges if our RBAC rules say they are primarily technical/viewer users.

Respect the existing RBAC implementation.

==================================================
14. ANNOUNCEMENT CREATION MODAL
===============================

Redesign the "New Announcement" form as a modern modal or dedicated creation page.

Fields:

Announcement Title
Announcement Content
Category
Priority
Media Upload
Publish Date
Status

Example:

---

Create Announcement

Title
[____________________________]

Category
[ Advisory ▼ ]

Priority
[ Normal ▼ ]

Message
[****************************]
[****************************]
[____________________________]

Media
[ Upload Image or Video ]

[ Preview ]

Status
(•) Publish Now
( ) Save as Draft

```
    Cancel       Publish
```

---

The form should have excellent validation and error messages.

==================================================
15. RESIDENT VIEW
=================

This is VERY IMPORTANT.

Residents should NOT see the administrator controls.

Residents should see announcements as a clean community feed.

Resident post:

[Barangay Logo]
Barangay Bakilid
Official Announcement · Aug 14 at 2:30 PM

Barangay Clean-Up Drive This Saturday

Please join us...

[IMAGE / VIDEO]

👍 Helpful    💬 Comment

The resident view should feel friendly, readable, and mobile-friendly.

Remove:

* Edit
* Delete
* Archive
* Admin menus
* Internal system information
* Database-related information

Residents should only see information relevant to them.

==================================================
16. ADMIN VS RESIDENT EXPERIENCE
================================

Use the SAME announcement component architecture but different permissions.

For example:

<AnnouncementPost
 announcement={announcement}
 userRole={userRole}
 isAdmin={...}
/>

The component should determine which actions are available based on RBAC.

Do not duplicate the entire announcement UI just to create admin and resident versions.

==================================================
17. EMPTY STATE
===============

If there are no announcements:

Display a beautiful empty state.

Example:

📢

No announcements yet

There are currently no published announcements from Barangay Bakilid.

For administrators:

[ + Create Announcement ]

Do not simply show a blank page.

==================================================
18. LOADING STATE
=================

Use skeleton loading cards while announcements are loading.

Do not show a blank screen.

Example skeleton:

[ Avatar ] █████████
█████

████████████████████
████████████████████
████████████████████

██████████████████████████

==================================================
19. ERROR STATE
===============

If announcements fail to load:

Show:

"Unable to load announcements."

Then:

[ Try Again ]

Do not expose raw API errors to users.

==================================================
20. RESPONSIVE DESIGN
=====================

Desktop:

Sidebar
+
Main content
+
Centered announcement feed

Tablet:

Reduce side spacing.

Mobile:

* Sidebar becomes mobile navigation
* Announcement feed becomes almost full width
* Header becomes compact
* Images become full feed width
* Buttons remain touch-friendly
* Three-dot menu remains accessible
* Do not allow horizontal scrolling

The announcement experience should feel like a modern mobile community feed.

==================================================
21. VISUAL DESIGN
=================

Use the existing Barangay Smart System visual identity.

Maintain:

* Clean white cards
* Soft borders
* Subtle shadows
* Blue primary color
* Rounded corners
* Modern typography
* Consistent spacing
* Professional government/community aesthetic

Avoid:

* Huge decorative banners
* Excessive gradients
* Excessive colors
* Oversized buttons
* Too many badges
* Dense tables
* Old-fashioned dashboard cards
* Random decorative illustrations
* Excessive empty space

The goal is:

"Modern official barangay social/community feed"

NOT:

"Facebook clone"

and NOT:

"Generic admin CRUD page."

==================================================
22. DATA STRUCTURE
==================

Work with the existing announcement data structure first.

If the backend currently provides fields such as:

id
title
description/content
image
video
status
priority
createdAt
updatedAt

reuse them.

If additional fields are genuinely required, add them carefully.

Potential future fields:

category
isPinned
mediaType
publishedAt
author
helpfulCount
commentCount

Do not break existing records.

Existing announcements with images must continue displaying correctly.

==================================================
23. SECURITY AND RBAC
=====================

Do not rely only on hiding buttons in React.

The Express backend must continue enforcing permissions.

A user should not be able to edit/delete/archive announcements simply by manually calling the API.

Respect our existing authentication and RBAC middleware.

==================================================
24. PERFORMANCE
===============

Optimize announcement media.

For images:

* Lazy load images below the fold
* Prevent layout shifting
* Use appropriate dimensions
* Avoid unnecessarily huge images

For videos:

* Do not automatically load/play every video
* Use thumbnails/posters when possible
* Load the video player efficiently

If there are many announcements, implement pagination or infinite scrolling using the existing API where appropriate.

==================================================
25. IMPORTANT UI REQUIREMENT
============================

The final result should look substantially different from the current screenshot.

The current layout:

Large announcement banner
↓
Title
↓
Description
↓
Image URL
↓
Posted date
↓
Edit / Delete

should be replaced with:

[Barangay Avatar]
Barangay Bakilid · Official Announcement
Date · Time                         ⋯

Announcement Title

Announcement Description

[ IMAGE / VIDEO ]

👍 Helpful    💬 Comment

This should visually resemble a polished community social feed.

==================================================
26. IMPLEMENTATION RULE
=======================

Before changing the code:

1. Inspect the existing Announcements React component.
2. Inspect the existing announcement API.
3. Inspect the database model/schema.
4. Inspect existing RBAC permissions.
5. Identify how images/videos are currently uploaded and stored.
6. Preserve existing functionality.
7. Then redesign the UI.

Do NOT blindly create a new mock announcement system.

Use the real existing data.

Do NOT replace working backend functionality just to redesign the frontend.

After implementation:

* Test creating an announcement.
* Test editing an announcement.
* Test deleting an announcement.
* Test archiving.
* Test image upload.
* Test video upload.
* Test resident viewing.
* Test admin viewing.
* Test RBAC.
* Test responsive layout.
* Test announcements with no media.
* Test announcements with long text.
* Test portrait images.
* Test landscape images.
* Test invalid media.
* Test loading and error states.

The final result should feel like a production-ready Barangay Smart System announcement feed that residents would actually enjoy using.
