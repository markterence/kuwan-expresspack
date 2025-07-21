import { defineConfig } from '@markterence/kuwan-expresspack'
/**
 * Email configuration for the application.
 */
export default defineConfig({
    custom: {
        auth: {
            user: process.env.EMAIL_USER || 'test',
            pass: process.env.EMAIL_PASS || 'test',
        },
        host: process.env.EMAIL_HOST || 'smtp.example.com',
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
    }
})
