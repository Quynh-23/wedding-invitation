GOOGLE SHEETS RSVP SETUP

Website RSVP now saves directly to the Google Sheet instead of sending an email for every guest.
Spreadsheet: https://docs.google.com/spreadsheets/d/16CoRjtLjZhVX6q96H24lLf5oBUO9C-h7Nyv6UNfJL2g/edit

ONE-TIME SETUP
1. Open the spreadsheet above.
2. Choose Extensions > Apps Script.
3. In the Apps Script editor, replace the contents of Code.gs with the Code.gs file included in this ZIP. Save.
4. Click Deploy > New deployment. Choose Web app.
5. Set Execute as: Me. Set Who has access: Anyone. (This is needed so wedding guests can submit without signing in. The script only appends the submitted RSVP fields.)
6. Click Deploy and complete Google's authorization prompts.
7. Copy the Web app URL. It must end in /exec.
8. Open js/script.js and the Web App URL is already configured in js/script.js. Keep the URL inside the quotation marks.
9. Commit and push the updated website to GitHub Pages.

WHAT HAPPENS
- The first submission creates a tab named RSVP and adds the column headers.
- Each guest response is appended as a new row with timestamp, name, attendance, guest count, message, and request ID.
- No RSVP email is sent. Open the Google Sheet to review responses.

IMPORTANT
- Do not share the Apps Script editor with guests. Only the deployed /exec URL is used by the website.
- Do not use the /dev test URL.
- Test once after deploying. Confirm a new row appears in the RSVP tab.
- If you later edit Code.gs, go to Deploy > Manage deployments > Edit, choose New version, and deploy again.
- Anyone with the Web App URL can submit data, so keep the URL in the website code and do not publish it separately.
