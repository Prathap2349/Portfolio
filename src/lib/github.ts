export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
  topics?: string[];
}

export interface GithubProfile {
  public_repos: number;
  followers: number;
}

export async function fetchGithubData(username: string) {
  try {
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.mercy-preview+json" // For topics
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 }
    });
    
    if (!profileRes.ok) throw new Error("Failed to fetch profile");
    const profile: GithubProfile = await profileRes.json();

    // Fetch up to 100 to catch everything
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers,
      next: { revalidate: 3600 }
    });

    if (!reposRes.ok) throw new Error("Failed to fetch repos");
    const allRepos: GithubRepo[] = await reposRes.json();

    const stars = allRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    return { profile, allRepos, stars, error: null };
  } catch (error) {
    console.error("GitHub API Error:", error);
    return { 
      profile: null, 
      allRepos: [], 
      stars: 0, 
      error: "Unable to load live GitHub data right now. Try again later." 
    };
  }
}
