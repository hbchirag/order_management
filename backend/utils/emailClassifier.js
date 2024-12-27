const { ClassificationRule, EmailAttachment, EmailListEntry } = require('../models');

const classifyEmail = async (email) => {
  // Check against email filtering rules (whitelist/blocklist)
  const isWhitelisted = await EmailListEntry.findOne({
    where: { type: 'whitelist', email_address: email.sender, status: true },
  });
  const isBlacklisted = await EmailListEntry.findOne({
    where: { type: 'blocklist', email_address: email.sender, status: true },
  });

  if (isBlacklisted) {
    return { status: 'Filtered Out', reason: 'Blacklisted email sender' };
  }

  if (isWhitelisted) {
    return { status: 'Confirmed Order Email', reason: 'Whitelisted email sender' };
  }

  // Check against classification rules
  const rules = await ClassificationRule.findAll({ where: { is_active: true } });

  for (const rule of rules) {
    const pattern = new RegExp(rule.pattern, 'i');
    if (rule.type === 'Subject' && pattern.test(email.subject)) {
      return { status: 'Confirmed Order Email', reason: `Matched subject rule: ${rule.rule_name}` };
    } else if (rule.type === 'Body Text' && pattern.test(email.content)) {
      return { status: 'Confirmed Order Email', reason: `Matched body text rule: ${rule.rule_name}` };
    } else if (rule.type === 'Attachment Name') {
      const attachments = await EmailAttachment.findAll({ where: { email_id: email.id } });
      const attachmentMatches = attachments.some((attachment) => pattern.test(attachment.file_name));
      if (attachmentMatches) {
        return { status: 'Confirmed Order Email', reason: `Matched attachment rule: ${rule.rule_name}` };
      }
    }
  }

  // Default to pending review if no rules matched
  return { status: 'Pending Review', reason: 'No matching rules found' };
};

module.exports = classifyEmail;
