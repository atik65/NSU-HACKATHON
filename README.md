# Reportify - Crime Reporting Platform with Fake Detection

> Created by Team The Mavericks for NSU WebXtreme Hackathon
> 


<p align="center">
  <img src="/public/images/reportify.png" alt="ide" width="500"/>
</p>


## 🚀 Features

*   **Crime Report Submission:** Users can post images of crimes, and the platform will generate a description using AI.
*   **Fake Report Detection:** AI algorithms predict the likelihood of a report being fake.
*   **Secure Authentication:**  Authentication is implemented using refresh and access tokens.
*   **Community Moderation:** Users can comment on images to dispute potentially false reports.

  
### Crime Report Submission:

<p align="center">
  <img src="/public/images/post.png" alt="ide" width="500"/>
</p>

#### Ai Description

- **Route**: `http://localhost:3000/api/ai-des`
- **Method**: POST
- **Body** :

```bash
{

  "image": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHC....." //base64
}
```

- **Sample Response**:

```json
{
    "aiResponse": "In a shocking display of brazen thievery, a sly thief was caught on camera swooping in to snatch a unsuspecting woman's purse, leaving her stunned and vulnerable. The swift and calculated heist occurred in broad daylight, sending a chilling reminder of the ever-present threat of crime in our communities. As the investigation unfolds, authorities are racing to track down the culprit and bring them to justice."
}
```

### Fake Report Detection

#### Ai Description

- **Route**: `http://localhost:3000/api/report-crime`
- **Method**: POST
- **Body** :

```bash
{
  "title": "A thief is trying to steal a woman's purse",
  "description": "Breaking news: a shocking string of events has unfolded, with reports flooding in from all directions, each one more astonishing than the last. As the investigation deepens, the trail of clues leads to a tangled web of deceit and corruption. The question on everyone's mind: what's behind this deluge of reports?",
  "division": "Dhaka",
  "district": "Dhaka",
  "crime_time": "2025-02-10T22:00:00Z",
  "image": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUUFBgVFRUZGRgaGxoYGxsaGBoaGBoaGhgbGxobGxsbIS0kGyEqHxoaJTklKi4xNTQ0GiM6Pzo0Pi0zNDEBCwsLEA8QHx......" //base64
}
```

- **Sample Response**:

```json
{
    "crime_id": "67ad6a80d91508b71e2916ba",
    "status": "success",
    "message": "Crime report submitted successfully!",
    "ai_response": {
        "fake": 0,
        "real": 100
    }
}
```

### Secure Authentication

<p align="center">
  <img src="/public/images/auth.png" alt="ide" width="500"/>
</p>

#### SingUp

- **Route**: `http://localhost:3000/api/register`
- **Method**: POST
- **Body** :

```bash
{
    "email": "23201122@uap-bd.edu",
    "password": "23201122",
    "phone": "01756187122"
}
```

- **Sample Response**:

```json
{
    "message": "User registered successfully.",
    "user_id": "67ad6bd8d91508b71e2916bd",
    "status": "success"
}
```


#### SingIn

- **Route**: `http://localhost:3000/api/login`
- **Method**: POST
- **Body** :

```bash
{

  "email": "nikon87744@shouxs.com",
    "password": "hello"

}
```

- **Sample Response**:

```json
{
    "message": "Logged in successfully!",
    "user_id": "67ac4930a4511ec095cc9ea2",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdhYzQ5MzBhNDUxMWVjMDk1Y2M5ZWEyIiwiZW1haWwiOiJuaWtvbjg3NzQ0QHNob3V4cy5jb20iLCJpYXQiOjE3Mzk0MTg3MzQsImV4cCI6MTc0MDAyMzUzNH0.U0epn0QD0zkFp5s72_vxgv16Sh2urF3mHfbgCJ6RkN4",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdhYzQ5MzBhNDUxMWVjMDk1Y2M5ZWEyIiwiaWF0IjoxNzM5NDE4NzM0LCJleHAiOjE3NDIwMTA3MzR9.uhQsNCapvRrn524RaN1UJNxb1cfRoVWmC52VUHvoECE",
    "expiredAt": "2025-02-20T03:52:14.503Z",
    "status": "success"
}
```

### Community Moderation

<p align="center">
  <img src="/public/images/comment.png" alt="ide" width="500"/>
</p>



#### Comment

- **Route**: `http://localhost:3000/api/crime/67ab50613c54a73940b76656/comment`
- **Method**: POST
- **Body** :

```bash
{
  "comment": "This is a sample comment for testing.",
  "proof_image": "+ekkfOsrKoscRHJg91dO0idrNJNhl1a3ZhkEE4DHFe3wTLIqshyrAMDjGx5bGsrKjk6RbH2zotWlmxWVlQKHMpwMkZJ6dKkibasrK5hRvVWVlZQCf/Z....",
  "proof_video": "https://example.com/sample-video.mp4",
  "user_id": "123456"
}

```

- **Sample Response**:

```json
{
    "comment_id": "67ad68e3d91508b71e2916b8",
    "status": "success",
    "message": "Comment submitted successfully!"
}
```

## Postman URL (API Test)

https://solar-firefly-943308.postman.co/workspace/New-Team-Workspace~842ec9bb-4997-4cd8-a806-521445c9123d/collection/13566725-fd9ef6a7-dfea-42a4-9c95-baf22d1a492b?action=share&creator=13566725


## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.6
- **Authentication**: NextAuth
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI
  - Shadcn/ui
  - Framer Motion
- **Database**: MongoDB with Mongoose


## 🚦 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/atik65/NSU-HACKATHON.git
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with the following variables:

```env
#auth
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_SECRET=d6CZ404XT+gAsrRZJraImpx69tvgnYy5nIHh9pRrM/I=
NEXTAUTH_URL="http://localhost:3000"

# mongodb database
MONGO_PASS=0TGpmCXGFVb1S9DJ
MONGO=mongodb+srv://23201128:0TGpmCXGFVb1S9DJ@reportify.qztzb.mongodb.net/?retryWrites=true&w=majority&appName=Reportify

# tokens
ACCESS_TOKEN_SECRET=reportify
REFRESH_TOKEN_SECRET=hackathon
JWT_SECRET=reportify123

# email ifos
EMAIL_USER=mytwicket@gmail.com
EMAIL_PASS=dhiagpwobynmfire

# AI Models
GROQ_API_KEY=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
HF_API_KEY=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

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=siratul
CLOUDINARY_API_KEY=973265198543579
CLOUDINARY_API_SECRET=yt0DyMGXp092Z0dpJ6tQ4yG5Eqw
CLOUDINARY_URL=cloudinary://973265198543579:yt0DyMGXp092Z0dpJ6tQ4yG5Eqw@siratul



NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_SECRET=d6CZ404XT+gAsrRZJraImpx69tvgnYy5nIHh9pRrM/I=
NEXTAUTH_URL="http://localhost:3000"

```

4. **Run the development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📜 License

This project is licensed under the MIT License.

---
Created by Team The Mavericks for NSU WebXtreme Hackathon
