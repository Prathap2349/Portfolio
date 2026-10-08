import GithubClient from "./GithubClient";
import { fetchGithubData } from "@/lib/github";
import { profile } from "@/data/profile";

export default async function Github() {
  const { profile: githubProfile, allRepos, stars, error } = await fetchGithubData(profile.github.primary.username);
  
  // Only show the 6 most recently updated repos in the github section
  const recentRepos = allRepos.slice(0, 6);

  return <GithubClient data={{ profile: githubProfile, repos: recentRepos, stars, error }} />;
}
