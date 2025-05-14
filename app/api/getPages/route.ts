import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const dirRelativeToPublicFolder = 'pages'
  const dir = path.resolve('./public', dirRelativeToPublicFolder)
  const filenames = fs.readdirSync(dir)
  const blogPages = filenames.map(name => path.join('/', dirRelativeToPublicFolder, name))
  return NextResponse.json(blogPages)
}
