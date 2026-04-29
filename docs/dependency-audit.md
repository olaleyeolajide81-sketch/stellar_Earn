# Dependency Audit Guide

This document explains the dependency audit implementation for the stellar_Earn project.

## Overview

The dependency audit system provides automated security vulnerability scanning and reporting for npm dependencies.

## Features

- **Automated CI/CD Integration**: Security audits run on every push and pull request
- **Weekly Scheduled Audits**: Regular monitoring for new vulnerabilities
- **Multi-Node Version Support**: Tests against Node.js 18.x and 20.x
- **Comprehensive Reporting**: Detailed audit reports and artifact uploads
- **Local Development Tools**: Easy-to-use npm scripts for manual audits

## CI/CD Implementation

### GitHub Actions Workflows

#### 1. Dedicated Audit Workflow (`.github/workflows/dependency-audit.yml`)

Triggers:
- Push to main/develop branches
- Pull requests to main/develop branches  
- Weekly schedule (Mondays at 9:00 UTC)

Actions performed:
- Runs `npm audit` with moderate severity threshold
- Generates audit reports in JSON and Markdown formats
- Uploads reports as GitHub Actions artifacts
- Fails build on high severity vulnerabilities

#### 2. Integrated Audit in Test Workflow (`.github/workflows/test.yml`)

The existing test workflow now includes a security audit step that runs alongside linting and testing.

## Local Development

### Available Scripts

```bash
# Run a basic security audit
npm run audit

# Automatically fix vulnerabilities (safe updates only)
npm run audit:fix

# Check for moderate+ severity vulnerabilities
npm run audit:check

# Run comprehensive vulnerability fix with reporting
npm run audit:fix-all
```

### Vulnerability Fix Script

The `scripts/fix-vulnerabilities.js` script provides automated vulnerability resolution:

1. Runs initial security audit
2. Attempts automatic fixes using `npm audit fix --force`
3. Generates before/after comparison report
4. Identifies remaining high/critical vulnerabilities requiring manual attention

### Usage Examples

#### Basic Audit
```bash
npm run audit
```

#### Automatic Fix
```bash
npm run audit:fix
```

#### Comprehensive Fix with Reporting
```bash
npm run audit:fix-all
```

This will:
- Generate a `vulnerability-fix-report.md` file
- Show which vulnerabilities were automatically fixed
- Highlight any remaining high/critical issues

## Security Levels

The audit system uses the following severity levels:

- **Low**: Informational issues, minimal security impact
- **Moderate**: Issues that should be addressed but aren't critical
- **High**: Serious vulnerabilities that should be fixed promptly
- **Critical**: Extremely severe vulnerabilities requiring immediate action

## CI/CD Configuration

### Audit Thresholds

- **CI/CD Pipeline**: Fails on high severity vulnerabilities
- **Scheduled Audits**: Reports all moderate+ severity issues
- **Local Development**: Configurable via audit scripts

### Node.js Matrix Testing

Audits run across multiple Node.js versions to ensure compatibility:
- Node.js 18.x
- Node.js 20.x

## Reports and Artifacts

### GitHub Actions Artifacts

Each audit run generates:
- `audit-report-{node-version}.md`: Human-readable audit summary
- `audit-report-{node-version}.json`: Machine-readable audit data

### Local Reports

Running `npm run audit:fix-all` generates:
- `vulnerability-fix-report.md`: Comprehensive fix report with before/after comparison

## Best Practices

### Regular Maintenance

1. **Weekly Reviews**: Check scheduled audit results
2. **Prompt Fixes**: Address high/critical vulnerabilities immediately
3. **Dependency Updates**: Keep packages updated to prevent vulnerabilities
4. **Security Monitoring**: Monitor npm security advisories

### Development Workflow

1. **Before Commit**: Run `npm run audit:check` to ensure no new vulnerabilities
2. **After Updates**: Run `npm run audit:fix-all` to resolve any issues
3. **PR Reviews**: Check audit results in pull request workflows

### Troubleshooting

#### Common Issues

**Audit fails on dependency conflicts:**
```bash
# Clean install and retry
rm -rf node_modules package-lock.json
npm install
npm run audit:fix
```

**High vulnerabilities that can't be auto-fixed:**
- Check for major version updates
- Review package compatibility
- Consider alternative packages
- Manual dependency resolution

**False positives:**
- Review npm security advisory details
- Check if vulnerability applies to your usage
- Consider ignoring specific vulnerabilities if not applicable

## Integration with Development Tools

### IDE Integration

Most IDEs can integrate with npm audit results:
- **VS Code**: Use security extensions
- **WebStorm**: Built-in security audit integration
- **Others**: Configure external tool integration

### Pre-commit Hooks

Consider adding pre-commit hooks for security:
```bash
# Example pre-commit hook
#!/bin/sh
npm run audit:check
```

## Monitoring and Alerts

### GitHub Actions Notifications

Configure repository notifications for:
- Workflow failures (high severity vulnerabilities)
- Weekly audit summaries
- Security advisories

### External Monitoring

Consider integrating with:
- GitHub Dependabot
- Snyk security scanning
- OWASP dependency checking

## Contributing

When contributing to the audit system:

1. **Test Changes**: Verify audit workflow modifications
2. **Update Documentation**: Keep this guide current
3. **Security Focus**: Prioritize security improvements
4. **Backward Compatibility**: Ensure existing workflows continue working

## Support

For issues with the dependency audit system:

1. Check GitHub Actions workflow logs
2. Review generated audit reports
3. Consult npm audit documentation
4. Verify Node.js and npm versions

---

*Last updated: $(date)*
*Part of stellar_Earn security implementation*
