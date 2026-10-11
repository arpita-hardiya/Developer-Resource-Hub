# Developer Resource Hub

A free resource hub for programmers. It collects useful GitHub repositories, videos and playlists across six developer topics in one place, with live search and the option to add your own repositories.

- Live demo: https://arpita-hardiya.github.io/Developer-Resource-Hub/
- Repository: https://github.com/YOUR-USERNAME/YOUR-REPO-NAME

## Features

- Six topic pages: Frontend, Backend, DevOps, API Documentation, Cloud Computing, and IoT & Hardware. Each page has an About section, 3 GitHub repositories, and 3 video topics with a short explanation video and a playlist.
- Live search: type in the search box on the main page to find repositories from all six topic pages at once. It matches the name, link, category and description.
- Add a repository: enter a GitHub link (or owner/repo), choose a category, and it is saved under "Your Added Repositories". Invalid links and duplicates are rejected.
- Saved data: added repositories stay after a page refresh, and can be removed with one click.
- Easy navigation: clickable topic cards, HOME / ROADMAP / REPO+ links, a Home button and a back-to-top button on every topic page.
- Search on topic pages: each topic page has its own search bar for its repositories and videos, plus "Copy link" buttons.

## Tech Stack

- HTML5: page structure
- CSS3: styling and layout (maroon and rose theme)
- JavaScript (vanilla): search, add repository, navigation
- localStorage: saves added repositories in the browser
- Font Awesome: icons

No frameworks, libraries or build tools are used.

## Setup

1. Download this repository as a ZIP and extract it, or clone it:
   ```
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   ```
2. Open the project folder.
3. Double-click `index.html` to open it in your browser.

No installation is needed. Keep all files in the same folder so the pages and scripts can find each other. An internet connection is needed for the icons, images and external links.

## Project Structure


├── index.html      Main page (topic cards, search, add repository)
├── styleDev.css    Styles for the main page
├── script.js       Main page logic (search across all repos, add repo)
├── subpage.js      Shared logic for the six topic pages
├── frontend.html   Frontend Development
├── backend.html    Backend Development
├── devops.html     DevOps
├── api.html        API Documentation
├── cloud.html      Cloud Computing and Architecture
└── iot.html        IoT and Hardware


## How It Works

- script.js: keeps a list of all repositories from the six topic pages. Typing in the search box filters that list and shows the matches.
- Repositories you add are stored in the browser's localStorage as JSON, and are loaded again every time the page opens. They are saved only in the browser where you added them.
- subpage.js: reads each topic page, adds a search bar, copy-link buttons and a back-to-top button, and filters the repositories and videos as you type.

## Future Improvements

- Upvote button for resources
- Dark / light theme toggle
- Show added repositories on their topic pages
- Store data on a server so it is shared between users

## Author

Made by Arpita Hardiya, BTech CSE student, for the GDGoC recruitment task (Task 3: Developer Resource Hub).
