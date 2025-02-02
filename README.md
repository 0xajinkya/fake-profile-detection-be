# Fake Profile Detection Backend

This backend is designed to analyze Twitter profiles and determine if they are real or fake using machine learning. It automates data scraping, feature extraction, and classification while maintaining real-time status updates for users.

## Features
- **Fake Profile Classification:** Achieves **92% accuracy** in detecting fake social media profiles.
- **Automated Data Extraction:** Scrapes profile details and **analyzes 10+ attributes**, including engagement rate, follower ratio, media usage, and more.
- **Real-time Prediction Pipeline:** Ensures classification results are **processed and stored in under 10 seconds**.
- **User Dashboard Integration:** Enables users to monitor profile status and take necessary actions.

## How It Works
1. **Profile Scraping:** The backend triggers a scraper to collect data from a Twitter profile, including its latest **10 posts**.
2. **Feature Extraction:** Once scraping is completed, the webhook extracts key attributes such as:
   - Engagement rate
   - Comment rate
   - Number of posts
   - Followers and following count
   - Profile description details (presence of links, hashtags, average caption length, etc.)
3. **Prediction & Storage:** The extracted data is sent to a trained ML model, which predicts if the profile is real or fake. The results are then stored in the database.
4. **User Notification:** The requester can view the profile status on their dashboard and take further actions.

## Setup Instructions
### Prerequisites
- **Node.js** (v16 or later)
- **Docker** (optional, for database setup)
- **Environment Variables:** Refer to the `.env.test` file for required environment variables.

### Installation
```sh
# Clone the repository
git clone https://github.com/0xajinkya/fake-profile-detection-be.git
cd fake-profile-detection-be

# Install dependencies
bun install
```

### Running the Project
```sh
# Start the backend server
bun run dev
```