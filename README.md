# From Prompt to Product

The workshop site: labs, classroom pages and live voting.

## Run locally

    npm install
    npm run dev

Open http://localhost:3000. The presenter key in development is `dev`.

## Deploy on Vercel

1. Push this folder to a new GitHub repository and import it in Vercel.
2. Add a Redis database from the Vercel Marketplace (Upstash) and connect it to the project.
   This provides `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   (`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` also work).
3. Add an environment variable `HOST_KEY` with a long presenter password.
   Without it, presenter controls are disabled in production.
4. Redeploy, open `/host` and check that the "No shared database" warning is gone.
5. Open `/join` on the live site, download the QR codes and add them to the slides.

Without a database, votes live in one server's memory and get lost or split on Vercel.

## During the session

| Page      | Who       | Use                                              |
| --------- | --------- | ------------------------------------------------ |
| `/vote`   | Students  | Follows the question you pick                    |
| `/screen` | Projector | Question, QR code, results after you reveal them |
| `/host`   | You       | Pick questions, reveal, remove text answers      |

Text answers appear on the projector only after you reveal them, so read them first.
Votes are anonymous: each device gets a random id. Someone determined can vote twice.
Run "Reset all votes" after rehearsing.

## Editing content

- Questions: `lib/polls.ts`. Correct answers: `lib/answers.ts`.
- Mission cards: `lib/missions.ts`.
