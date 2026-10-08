export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
}

export interface GithubProfile {
  public_repos: number;
  followers: number;
}

export async function fetchGithubData(username: string) {
  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 }
    });
    
    if (!profileRes.ok) throw new Error("Failed to fetch profile");
    const profile: GithubProfile = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      next: { revalidate: 3600 }
    });

    if (!reposRes.ok) throw new Error("Failed to fetch repos");
    const repos: GithubRepo[] = await reposRes.json();

    // Calculate total stars from the fetched repos (approximate for portfolio)
    const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

    return { profile, repos, stars, error: null };
  } catch (error) {
    console.error("GitHub API Error:", error);
    // Graceful fallback for rate limits
    return { 
      profile: { public_repos: 11, followers: 2 }, 
      repos: [
        { id: 1, name: "Portfolio", description: "My personal developer portfolio built with Next.js.", language: "TypeScript", stargazers_count: 1, updated_at: new Date().toISOString(), html_url: "https://github.com/Prathap2349/Portfolio" },
        { id: 2, name: "LoadMove", description: "Home and goods transport platform.", language: "TypeScript", stargazers_count: 0, updated_at: new Date().toISOString(), html_url: "https://github.com/Prathap2349/LoadMove" },
      ], 
      stars: 1, 
      error: null 
    };
  }
}
