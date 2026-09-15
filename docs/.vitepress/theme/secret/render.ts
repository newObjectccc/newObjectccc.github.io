/**
 * 日记正文 → HTML 的渲染管线，秘密空间详情页与公开分享页共用。
 * GFM + 单换行转 <br>：手打的日记按 Enter 换行就该换行；
 * 额外空行保留——每多一个换行，多一条可见的呼吸缝；
 * 独占一行的 bilibili / YouTube 裸 URL 变成内嵌播放器。
 */
import { marked } from "marked";
import { embedVideoLines } from "./video";

export function renderEntryMarkdown(content: string): string {
  const softened = softenIndent(content);
  const withGaps = softened.replace(/\n{3,}/g, (m) => "\n\n" + "<br>\n\n".repeat(m.length - 2));
  return marked.parse(embedVideoLines(withGaps), { breaks: true, gfm: true });
}

// 行首 4+ 个半角空格会被 marked 当成缩进代码块：等宽字体、不换行、溢出整页。
// 日记段首敲空格只是想留白，统一折成全角空格（4 个半角 ≈ 1 个全角）；
// 代码围栏内部不动
function softenIndent(markdown: string): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) inFence = !inFence;
      if (inFence) return line;
      return line.replace(/^[ \t]+/, (m) => {
        const width = m.replace(/\t/g, "    ").length;
        // 1~3 个空格 markdown 本来就忽略，保持原样
        return width < 4 ? m : "　".repeat(Math.round(width / 4));
      });
    })
    .join("\n");
}
