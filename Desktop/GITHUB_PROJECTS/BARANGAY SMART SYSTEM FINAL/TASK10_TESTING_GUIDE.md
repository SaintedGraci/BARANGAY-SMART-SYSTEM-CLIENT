# Task 10: Modern Announcement Feed - Testing Guide

## Prerequisites
Before testing, ensure you have:
1. Database running (PostgreSQL)
2. Backend server running (`cd barangay_server && npm start`)
3. Frontend running (`cd barangay_client && npm run dev`)

## Step 1: Run Database Migration

The new announcement features require database schema updates.

```bash
cd barangay_server
node migrations/add-announcement-fields.js
```

Expected output:
```
✅ Added isPinned column to Announcements table
✅ Added category column to Announcements table
✅ Announcement fields migration completed successfully
```

## Step 2: Start the Backend Server

```bash
cd barangay_server
npm start
```

Server should start on `http://localhost:5000`

## Step 3: Start the Frontend

```bash
cd barangay_client
npm run dev
```

Frontend should start on `http://localhost:5173`

## Step 4: Manual Testing Checklist

### Admin Dashboard Testing

#### Login as Admin
1. Go to `http://localhost:5173/admin-login`
2. Login credentials:
   - Username: `admin`
   - Password: `admin123`

#### Test Create Announcement
1. Navigate to "Announcements" tab
2. Click "Create Announcement" button
3. Fill in the form:
   - Title: "Community Clean-Up Drive"
   - Priority: Important
   - Status: Publish Now
   - Content: "Join us this Saturday for our monthly community clean-up..."
4. Upload an image (optional)
5. Click "Publish"
6. ✅ Verify announcement appears in feed with modern card design

#### Test Announcement Display
Verify the announcement post shows:
- ✅ Barangay avatar (BB logo)
- ✅ "Barangay Bakilid" header
- ✅ "Official Announcement" badge
- ✅ Post timestamp
- ✅ Priority badge (if Important/Urgent)
- ✅ Title in large text
- ✅ Content text
- ✅ Image displays properly (not huge banner)
- ✅ Three-dot menu (⋯) in top-right

#### Test Pin Announcement
1. Click three-dot menu (⋯) on an announcement
2. Select "Pin Announcement"
3. ✅ Verify announcement moves to top of feed
4. ✅ Verify "📌 Pinned" indicator appears
5. Click menu again and select "Unpin Announcement"
6. ✅ Verify announcement returns to chronological order

#### Test Edit Announcement
1. Click three-dot menu (⋯)
2. Select "Edit Announcement"
3. Modify the title or content
4. Click "Update"
5. ✅ Verify changes appear immediately
6. ✅ Verify "Edited" indicator shows

#### Test Archive Announcement
1. Click three-dot menu (⋯)
2. Select "Archive Announcement"
3. Confirm the action
4. ✅ Verify announcement disappears from active feed
5. Change filter to "Archived"
6. ✅ Verify announcement appears in archived section

#### Test Delete Announcement
1. Click three-dot menu (⋯)
2. Select "Delete Announcement"
3. Confirm deletion
4. ✅ Verify announcement is completely removed

#### Test Filters
1. Click "Important" filter tab
2. ✅ Verify only Important priority announcements show
3. Click "Emergency" filter tab
4. ✅ Verify only Urgent priority announcements show
5. Click "All" to reset

#### Test Search
1. Type keywords in search box
2. ✅ Verify announcements filter in real-time
3. ✅ Verify search works for both title and content

#### Test Image Upload
1. Create new announcement
2. Drag and drop an image onto upload area
3. ✅ Verify preview appears
4. ✅ Verify you can remove the image
5. Publish and verify image displays properly

### Resident Dashboard Testing

#### Login as Resident
1. Go to `http://localhost:5173/login`
2. Use a resident test account or register a new one

#### Test Resident View
1. Navigate to "Announcements" tab
2. ✅ Verify announcements display in modern feed
3. ✅ Verify NO admin controls visible (no three-dot menu)
4. ✅ Verify NO edit/delete buttons
5. ✅ Verify pinned announcements appear first
6. ✅ Verify images display properly
7. ✅ Verify "Helpful" and "Comment" buttons visible (but disabled/non-functional)

#### Test Long Content
1. Find an announcement with long description
2. ✅ Verify content is truncated with "See more" button
3. Click "See more"
4. ✅ Verify full content expands
5. Click "See less"
6. ✅ Verify content collapses

#### Test Image Lightbox
1. Click on an announcement image
2. ✅ Verify full-size image opens in lightbox
3. ✅ Verify you can close the lightbox

### Responsive Testing

#### Desktop (1920x1080)
1. Open browser at full width
2. ✅ Verify feed has max-width (not stretched across screen)
3. ✅ Verify all elements properly spaced
4. ✅ Verify images don't exceed reasonable height

#### Tablet (768x1024)
1. Resize browser or use dev tools
2. ✅ Verify layout remains clean
3. ✅ Verify filters remain accessible
4. ✅ Verify buttons are touch-friendly

#### Mobile (375x667)
1. Resize to mobile width
2. ✅ Verify single-column layout
3. ✅ Verify filters scroll horizontally
4. ✅ Verify three-dot menu accessible
5. ✅ Verify images scale properly
6. ✅ Verify no horizontal scrolling

### Edge Cases Testing

#### Empty State
1. Delete all announcements (or filter to empty category)
2. ✅ Verify nice empty state message
3. ✅ Verify "Create Announcement" button (admin only)

#### Very Long Title
1. Create announcement with 150+ character title
2. ✅ Verify title displays without breaking layout

#### Very Long Content
1. Create announcement with 2000+ characters
2. ✅ Verify "See more" appears
3. ✅ Verify expansion works smoothly

#### Portrait Image
1. Upload a tall portrait-oriented image
2. ✅ Verify image doesn't stretch awkwardly
3. ✅ Verify aspect ratio preserved

#### Broken Image
1. Edit announcement directly in database with invalid image URL
2. ✅ Verify broken image handled gracefully
3. ✅ Verify post still displays properly

#### Multiple Pinned
1. Pin 3+ announcements
2. ✅ Verify all pinned ones appear at top
3. ✅ Verify correct ordering within pinned section

### API Testing (Optional)

Run the diagnostic script:
```bash
cd barangay_server
node test-task10-diagnostic.js
```

This will test:
- ✅ Authentication
- ✅ Database schema
- ✅ Create announcement
- ✅ Get announcements
- ✅ Pin/unpin
- ✅ Update announcement
- ✅ Archive announcement
- ✅ Delete announcement
- ✅ RBAC permissions

## Known Issues to Check

### If Images Don't Display
- Check R2/Cloudinary configuration
- Verify image upload middleware is working
- Check browser console for CORS errors

### If Three-Dot Menu Doesn't Work
- Check browser console for React errors
- Verify user has admin role
- Check RBAC permissions

### If Migration Fails
- Check database connection
- Verify Sequelize is up to date
- Check if columns already exist

### If Filters Don't Work
- Check browser console
- Verify announcement data has priority field
- Check React state updates

## Success Criteria

✅ **Visual Design**
- Modern social feed appearance
- Clean, professional look
- Proper spacing and typography
- Responsive on all devices

✅ **Functionality**
- Create/edit/delete works
- Pin/unpin works
- Archive works
- Filters work
- Search works
- Image upload works

✅ **User Experience**
- Admin sees full controls
- Residents see clean view
- No broken layouts
- Smooth interactions
- Fast loading

✅ **RBAC**
- Residents can't edit/delete
- Admin actions work
- Unauthorized access blocked
- Permissions enforced

## Performance Checks

1. **Loading Speed**
   - Page should load in < 2 seconds
   - Images should lazy load
   - No layout shifting

2. **Interaction Speed**
   - Filters respond instantly
   - Search updates in real-time
   - Modals open smoothly

3. **Mobile Performance**
   - Smooth scrolling
   - Touch targets large enough
   - No lag on interactions

## Troubleshooting

### Problem: "Migration file not found"
**Solution:** Run from barangay_server directory

### Problem: "Column already exists" error
**Solution:** Migration already ran successfully, skip this step

### Problem: Three-dot menu cut off
**Solution:** Check z-index and overflow CSS

### Problem: Images too large
**Solution:** Check OptimizedImage component usage

### Problem: Feed too wide on desktop
**Solution:** Check max-width constraint in AnnouncementFeed

## Report Issues

If you find bugs:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Note your user role
4. Capture screenshot if visual bug
5. Check if it's mobile or desktop specific

## Final Verification

Before marking Task 10 complete:
- [ ] Migration ran successfully
- [ ] All admin features work
- [ ] Resident view looks clean
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] RBAC enforced properly
- [ ] Images display correctly
- [ ] Old announcements still work
- [ ] Performance is good
- [ ] No broken layouts

## Next Steps After Testing

If everything works:
1. ✅ Mark Task 10 as complete
2. Create any necessary documentation
3. Deploy to production (if ready)
4. Train users on new interface

If issues found:
1. Document all issues
2. Prioritize fixes
3. Re-test after fixes
4. Repeat until all criteria met
