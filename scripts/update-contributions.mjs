import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const token = process.env.GITHUB_TOKEN;
const username = process.env.GITHUB_USERNAME || "leatrise";
const outputPath = resolve("static/data/contributions.json");

if (!token) {
    throw new Error("GITHUB_TOKEN is required");
}

const query = `
    query ContributionCalendar($login: String!) {
        user(login: $login) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            color
                            contributionCount
                            contributionLevel
                            date
                            weekday
                        }
                    }
                }
            }
        }
    }
`;

const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "leatrise-homepage-contributions"
    },
    body: JSON.stringify({ query, variables: { login: username } })
});

if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();

if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
}

const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;

if (!calendar) {
    throw new Error(`No contribution calendar found for ${username}`);
}

const calendarData = {
    username,
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks
};

let previousData = null;
try {
    previousData = JSON.parse(await readFile(outputPath, "utf8"));
} catch (error) {
    if (error.code !== "ENOENT") {
        throw error;
    }
}

const previousCalendar = previousData && {
    username: previousData.username,
    totalContributions: previousData.totalContributions,
    weeks: previousData.weeks
};

if (JSON.stringify(previousCalendar) === JSON.stringify(calendarData)) {
    console.log("Contribution data is already current.");
    process.exit(0);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({
    ...calendarData,
    generatedAt: new Date().toISOString()
}, null, 2)}\n`);

console.log(`Updated ${outputPath} for ${username}.`);
