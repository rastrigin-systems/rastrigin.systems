import type { APIRoute } from 'astro';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Only allow in dev mode
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Not available in production' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { slug, content } = await request.json();

    if (!slug || !content) {
      return new Response(JSON.stringify({ error: 'Missing slug or content' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Construct file path
    const filePath = join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);

    // Read existing file to get frontmatter
    const existingContent = await readFile(filePath, 'utf-8');
    const frontmatterMatch = existingContent.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      return new Response(JSON.stringify({ error: 'Could not parse frontmatter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Reconstruct file with original frontmatter + new content
    const newFileContent = `---\n${frontmatterMatch[1]}\n---\n\n${content}`;

    await writeFile(filePath, newFileContent, 'utf-8');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving post:', error);
    return new Response(JSON.stringify({ error: 'Failed to save' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
