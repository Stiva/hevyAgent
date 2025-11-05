// Database connection and utilities for Neon PostgreSQL
import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)
