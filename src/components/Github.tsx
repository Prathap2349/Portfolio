import GithubClient from "./GithubClient";
import { fetchGithubData } from "@/lib/github";
import { profile } from "@/data/profile";

export default async function Github() {
  const data = await fetchGithubData(profile.github.primary.username);
  
  return <GithubClient data={data} />;
}
