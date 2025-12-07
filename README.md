# n8n-nodes-copyseeker

n8n community node for [Copyseeker](https://copyseeker.net) - Reverse Image Search API

[Installation](#installation) • [Configuration](#configuration) • [Operations](#operations) • [Use Cases](#use-cases) • [Support](#support)

## Installation

### Via n8n Community Nodes

1. Go to **Settings** > **Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-copyseeker`
4. Click **Install**

### Via npm
```bash
npm install n8n-nodes-copyseeker
```

## Prerequisites

Get your API key from [RapidAPI Copyseeker](https://rapidapi.com/copyseeker1-copyseeker-default/api/reverse-image-search-by-copyseeker)

## Configuration

1. Add **Copyseeker** node to workflow
2. Click **Create New Credentials**
3. Enter your RapidAPI key
4. Save

## Operations

### Reverse Image Search

Find where an image appears online.

**Input:**
- Image URL (required)
- Return Full Response (optional)
- Filter by Minimum Rank (optional)
- Include Visual Similar Images (optional)

**Output:**
```json
{
  "bestGuess": "logo design",
  "totalMatches": 15,
  "highestRankedSource": {
    "url": "https://example.com",
    "title": "Example Website",
    "rank": 8.5
  },
  "topEntities": ["Web Design", "Logo", "Branding"],
  "visuallySimilarCount": 23,
  "allPages": [],
  "entities": [],
  "visuallySimilar": []
}
```

### Site-Specific Search

Search for an image on a specific website.

**Input:**
- Image URL (required)
- Target Site (required) - domain without protocol
- Return Full Response (optional)
- Filter by Minimum Rank (optional)
- Include Visual Similar Images (optional)

## Use Cases

### Copyright Protection
Monitor unauthorized use of your images across the web.

### E-commerce Visual Search
Enable customers to find products by uploading images.

### Brand Protection
Detect counterfeit products and unauthorized logo usage.

### Content Moderation
Filter duplicate or previously flagged content.

### Fraud Detection
Verify profile photos in dating apps, insurance claims, job applications.

### Fact-Checking
Verify image authenticity and track original sources.

## Page Authority Scores

| Score | Authority |
|-------|-----------|
| 8.0-10.0 | Very High - Major sites, likely original |
| 6.0-7.9 | High - Established sites |
| 4.0-5.9 | Medium - Regular sites |
| 2.0-3.9 | Low - Smaller sites |
| 0.0-1.9 | Very Low - New or low-authority |

## Best Practices

**Do:**
- Use direct image URLs (.jpg, .png, .gif, .webp)
- Keep images under 10MB
- Implement error handling
- Cache results when possible
- Use minimum rank filtering

**Don't:**
- Use HTML page URLs
- Include protocol in Target Site
- Exceed rate limits
- Process same image repeatedly

## Troubleshooting

**No matches found**
- Verify URL is direct and public
- Image may be too new to index

**Rate limit exceeded**
- Check RapidAPI plan limits
- Add delays between requests

**Invalid credentials**
- Verify RapidAPI key
- Check subscription status

## Support

- [Copyseeker Website](https://copyseeker.net)
- [GitHub Issues](https://github.com/man-tas/n8n-nodes-copyseeker/issues)
- [RapidAPI Page](https://rapidapi.com/copyseeker1-copyseeker-default/api/reverse-image-search-by-copyseeker)

## License

MIT

---

Built for the n8n community • [Documentation](https://docs.n8n.io/integrations/community-nodes/)