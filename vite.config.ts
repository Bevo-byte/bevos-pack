import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const [repositoryOwner, repositoryName] = process.env.GITHUB_REPOSITORY?.split('/') ?? []
const isUserOrOrganizationSite = repositoryName?.toLowerCase() === `${repositoryOwner?.toLowerCase()}.github.io`
const base = process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isUserOrOrganizationSite
  ? `/${repositoryName}/`
  : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
