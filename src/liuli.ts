import { Article } from "./article_util";

interface LiuliResponse {
  code: number,
  msg: string,
  data: LiuliData|null,
}

interface LiuliData {
  articles: Article[]|null,
  magnets: string[]|null,
}

export { LiuliResponse, LiuliData }