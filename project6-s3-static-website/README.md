# S3 Static Website

This project contains all the necessary files to host a static website on Amazon S3.

## Files Included
- `index.html` - Main website page
- `error.html` - Custom error page
- `styles.css` - CSS styles
- `script.js` - JavaScript functionality
- `bucket-policy.json` - S3 bucket policy
- `website-configuration.json` - S3 website configuration

## Setup Instructions

1. Create an S3 bucket:
```bash
aws s3 mb s3://your-bucket-name
```

2. Enable static website hosting:
```bash
aws s3 website s3://your-bucket-name --index-document index.html --error-document error.html
```

3. Update the bucket policy:
   - Edit `bucket-policy.json` and replace `YOUR-BUCKET-NAME` with your actual bucket name
   - Apply the policy:
```bash
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
```

4. Upload the website files:
```bash
aws s3 sync . s3://your-bucket-name --exclude "*.json" --exclude "README.md"
```

5. Configure bucket for static website hosting:
```bash
aws s3api put-bucket-website --bucket your-bucket-name --website-configuration file://website-configuration.json
```

## Website Features
- Responsive design
- Smooth scrolling navigation
- Contact form
- Animated sections
- Mobile-friendly layout

## Security Notes
- The bucket policy allows public read access to all objects
- Make sure to only upload content that is meant to be public
- Consider using CloudFront for additional security and performance

## Testing
After setup, you can access your website at:
```
http://your-bucket-name.s3-website-region.amazonaws.com
```

Replace `region` with your AWS region (e.g., us-east-1).

## Maintenance
- Regularly update the website content
- Monitor S3 bucket access logs
- Keep track of storage usage
- Consider implementing CloudFront for better performance 