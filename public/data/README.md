# Data Directory

This directory now contains only small configuration files.
Large data files (MPs, bills, news) have been moved to PostgreSQL database.

## Remaining Files:
- voting-info.json
- citizen-rights.json
- message-templates.json
- mp-statistics.json
- app-summary.json

## Removed Files (now in database):
- mps.json - Migrated to PostgreSQL
- postcode-to-constituency.json - Migrated to PostgreSQL
- bills.json - Migrated to PostgreSQL
- news.json - Migrated to PostgreSQL

## Benefits:
- Reduced project size by ~1.3MB
- Faster application loading
- Better data query performance
- Real-time data updates capability

Last updated: 2025-07-15T09:44:40.938Z
