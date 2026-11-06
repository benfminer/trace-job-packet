# TRACE Job Readiness Packet

A guided web app that walks a TRACE student (with a teacher or job coach) through the 12-page Job Readiness Packet:
resume, cover letter, application info, references, availability, documents, disclosure, transportation, support team,
benefits, interview prep, and a job search tracker. Each page prints to look like the paper handout, and the resume and
cover letter also download as Word files.

**Privacy:** the site stores nothing. Student answers stay in the browser tab until staff click Save, which downloads a
`First_Last_packet.json` file to keep in a staff-only folder. There is no backend, no browser storage, and no place for
Social Security numbers, ID numbers, or passwords.

## Develop

```sh
npm install
npm run dev      # add ?demo to the URL to load a made-up sample student
npm test
npm run build
```

Pushing to `main` builds and publishes the site to GitHub Pages (`.github/workflows/deploy.yml`).
