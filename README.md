## Inspiration
Have you ever gotten so locked into a coding session that you miss an important email? Yeah, us too.

This entire project was born from real pain. Before this hackathon even started, one of our original teammates was deep in their portfolio project and completely missed the confirmation email to RSVP. Just like that, one team member was ejected from the team. And we realized: this happens all the time to developers.

We get so focused that the outside world starts buffering. Interviews, RSVPs, test deadlines, they all get buried in inboxes. Even tools like Gmail or Outlook that try to highlight events just stop short of doing the actual thing: making sure we don’t miss it.

So we thought… what if we didn’t just remind you about the deadline? What if we handled it for you?

## What it does

Our tool is like a personal assistant for developers who are too heads-down in code to check their inbox. It automatically:
- Reads your emails
- Extracts important dates, action items, and deadlines
- Sets prep reminders before those events (e.g., “start LeetCoding” 3 days before your interview)
- Makes sure nothing important slips through the cracks

*We’re not just detecting dates like Gmail does. We’re parsing the meaning of your emails and taking real action.*

You code. We handle the logistics.

## How we built it
1. Frontend: React + BaseWeb to keep the UI minimal, clean, and dev-friendly
2. Email ingestion: Gmail API with OAuth2 flow to pull in emails securely
3. NLP: OpenAI + custom regex patterns to find dates, events, keywords, and urgency in plain email text
4. Custom scheduler: Our own system for scheduling prep pings leading up to the event
5. Google Gemini API: for messaging ingestion
6. Twilio API: SMS notifications (most reliable while people are working, without interrupting the flow of work)
7. Google Cloud Products: We utilized Firebase and Firestore for login authentication and storing our users' data securely.
We focused on making the entire thing feel invisible. You connect your inbox, and it just quietly keeps your life on track while you grind.

## Challenges we ran into
- Email formatting is chaos! No two emails are the same. Figuring out how to parse everything reliably was a lot.
- Getting the OAuth flow right for Gmail took longer than expected. So many scopes, so little time.
- Designing the prep reminder logic was tricky. We didn’t just want to create events, we wanted to know what kind of reminders to send and when.
- Balancing automation with trust. This tool has access to your inbox, so privacy and transparency were top of mind from the start.
## Accomplishments that we're proud of
- Very few Git merge conflicts; we focused on producing clean code with our files and coding conventions, which saved us a ton of time in the long term.
- Built a working system end-to-end: inbox ➡️ NLP ➡️ calendar ➡️ reminders
- Got smart enough to tell the difference between an interview invite vs a Zoom link in a newsletter
- Created something that’s actually useful, like we all genuinely want to keep using and building upon this after the hackathon
- Didn't crash the entire project (but came close)

## What we learned
- That devs constantly miss things because their brains are too busy holding code
- How to work with both Gmail and Twilio APIs securely and sanely
- How to fine-tune OpenAI to be helpful without hallucinating deadlines that don’t exist
- How to balance UX with utility

## What's next for Buzz Didn't Remind Me
1. Add Discord/Notion integrations so reminders follow you wherever you work
2. Expand beyond Gmail, support Outook, university email systems, etc
3. Let users set "focus hours" so we only surface critical stuff when you're locked in
4. Add smarter prep flows, like suggested LeetCode sets or GRE study cards, depending on the event
5. Launch a public beta because this solves a very real, very dev-specific problem, and honestly, we all need it

If you're deep in your code, who's watching your life?
We built a tool that does. ✨
