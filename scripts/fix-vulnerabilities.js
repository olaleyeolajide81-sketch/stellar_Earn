#!/usr/bin/env node

/**
 * Vulnerability Fix Script
 * 
 * This script helps automate the process of fixing npm vulnerabilities
 * by running audit fix and generating a report of the changes.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
  console.log(`\n🔧 ${description}`);
  console.log(`Running: ${command}`);
  
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log('✅ Success');
    if (output.trim()) {
      console.log(output);
    }
    return output;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

function generateReport(beforeAudit, afterAudit, fixesApplied) {
  const report = `# Vulnerability Fix Report
Generated: ${new Date().toISOString()}

## Before Fix
\`\`\`
${beforeAudit}
\`\`\`

## Fixes Applied
${fixesApplied}

## After Fix
\`\`\`
${afterAudit}
\`\`\`

## Summary
This report shows the vulnerability fixes applied to the repository.
`;

  const reportPath = path.join(process.cwd(), 'vulnerability-fix-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report generated: ${reportPath}`);
}

function main() {
  console.log('🚀 Starting vulnerability fix process...\n');

  // Step 1: Run initial audit
  const beforeAudit = runCommand('npm audit --json', 'Running initial security audit');
  
  if (!beforeAudit) {
    console.error('❌ Failed to run initial audit');
    process.exit(1);
  }

  // Step 2: Try to fix vulnerabilities automatically
  console.log('\n🔨 Attempting to fix vulnerabilities automatically...');
  const fixOutput = runCommand('npm audit fix --force', 'Running automatic vulnerability fix');

  // Step 3: Run audit again to see remaining issues
  const afterAudit = runCommand('npm audit --json', 'Running post-fix security audit');

  // Step 4: Generate report
  generateReport(beforeAudit, afterAudit, fixOutput || 'No automatic fixes applied');

  // Step 5: Check if there are still high/critical vulnerabilities
  try {
    const auditResult = JSON.parse(afterAudit);
    const highVulns = auditResult.vulnerabilities ? 
      Object.values(auditResult.vulnerabilities).filter(v => v.severity === 'high' || v.severity === 'critical') : 
      [];

    if (highVulns.length > 0) {
      console.log(`\n⚠️  Still have ${highVulns.length} high/critical vulnerabilities that need manual attention:`);
      highVulns.forEach(vuln => {
        console.log(`  - ${vuln.name}: ${vuln.severity} - ${vuln.title}`);
      });
      console.log('\n💡 These may require manual package updates or configuration changes.');
    } else {
      console.log('\n✅ All high/critical vulnerabilities have been resolved!');
    }
  } catch (error) {
    console.log('⚠️  Could not parse audit results, but fix process completed.');
  }

  console.log('\n🎉 Vulnerability fix process completed!');
}

if (require.main === module) {
  main();
}

module.exports = { runCommand, generateReport };
