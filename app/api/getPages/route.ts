import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const dirRelativeToPublicFolder = 'pages'
  const dir = path.resolve('./public', dirRelativeToPublicFolder)
  const filenames = fs.readdirSync(dir)

  const blogPages = filenames.map((name) => {
    const filePath = path.join(dir, name)
    const content = fs.readFileSync(filePath, 'utf-8')
    // Extract YAML frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    let meta: Record<string, string> = {}
    if (match) {
      const lines = match[1].split('\n')
      for (const line of lines) {
        const [key, ...rest] = line.split(':')
        if (key && key.trim() !== 'image') {
          meta[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '')
        }
      }
    }
    return {
      ...meta,
      slug: name.replace(/\.md$/, ''),
    }
  })

  return NextResponse.json(blogPages)
}
